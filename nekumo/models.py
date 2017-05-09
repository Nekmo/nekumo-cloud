import os

from sqlalchemy_utils.functions.database import escape_like
from sqlalchemy_utils.types.choice import ChoiceType

from nekumo.core.i18n import _
from sqlalchemy import Column, DateTime, String, Integer, func, Boolean, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import ClauseElement
from sqlalchemy_utils import EmailType, PasswordType


LOOKUPS = ['contains', 'icontains', 'startswith', 'istartswith', 'endswith', 'iendswith']


Base = declarative_base()


def exclude_keys(data, exclude=()):
    return {key: value for key, value in data.items() if key not in exclude}


def get_model_lookup(model, lookup, value):
    """Pasar de un lookup de tipo field__icontains a uno usable por filter. 
    :param model: 
    :param lookup: 
    :param value: 
    :return: 
    """
    parts = lookup.split('__')
    field = getattr(model, parts[0])
    if len(parts) < 2:
        return field == value
    nocase_part = parts[1][1:] if parts[1].startswith('i') else parts[1]
    l = '%' if nocase_part in ['contains', 'startswith'] else ''
    l += escape_like(value)
    l += '%' if nocase_part in ['contains', 'endswith'] else ''
    fn = field.ilike if parts[1].startswith('i') else field.like
    return fn(l)


def lookup_dict(model, d):
    return [get_model_lookup(model, key, value) for key, value in d.items()]


class ModelMixin(object):
    __exclude_params__ = None
    _session = None

    def __init__(self, *args, **kwargs):
        self._session = kwargs.pop('_session', None)
        kwargs = self.update_params(**kwargs)
        super(ModelMixin, self).__init__(*args, **kwargs)

    def update(self, **kwargs):
        self._session = kwargs.pop('_session', self._session)
        kwargs = self.update_params(**kwargs)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def update_params(self, **kwargs):
        kwargs = {k: v for k, v in kwargs.items()
                  if hasattr(self.__class__, k)}
        return exclude_keys(kwargs, self.__exclude_params__ or [])


TARGET_CHOICES = [
    ('THIS', _('This')),
    ('SUBFILES', _('Subfiles')),
    ('RECURSIVE', _('Recursive')),
]


permission_users_table = Table('permission_users', Base.metadata,
    Column('permission_id', Integer, ForeignKey('permissions.id')),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('created_at', DateTime, default=func.now())
)


permission_groups_table = Table('permission_groups', Base.metadata,
    Column('permission_id', Integer, ForeignKey('permissions.id')),
    Column('group_id', Integer, ForeignKey('groups.id')),
    Column('created_at', DateTime, default=func.now())
)


class Path(ModelMixin, Base):
    __tablename__ = 'paths'
    id = Column(Integer, primary_key=True, autoincrement=True)
    gateway_id = Column(String(512), index=True)
    path = Column(String(4096), index=True)
    permissions = relationship("Permission", back_populates="path")

    created_at = Column(DateTime, default=func.now())


class Permission(ModelMixin, Base):
    __tablename__ = 'permissions'
    id = Column(Integer, primary_key=True, autoincrement=True)
    path_id = Column(Integer, ForeignKey('paths.id'))
    path = relationship("Path", back_populates="permissions")

    create = Column(Boolean, default=False)
    read = Column(Boolean, default=False)
    update = Column(Boolean, default=False)
    delete = Column(Boolean, default=False)
    superuser = Column(Boolean, default=False)

    target = Column(ChoiceType(TARGET_CHOICES), default='THIS')
    # User y Group M2M. Luego al consultar, se crea caché por cada directorio
    # con registros <user/group> -> permisos. Como la mayoría de las peticiones
    # son sobre archivos, esto agilizará mucho. Usar caché global que, al cambiar
    # el tree, borre los permisos. Obtener los permisos recursivamente hacia
    # abajo.
    users = relationship("User", secondary=permission_users_table, back_populates='permissions')
    groups = relationship("Group", secondary=permission_groups_table, back_populates='permissions')

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


user_groups_table = Table('user_groups', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('group_id', Integer, ForeignKey('groups.id')),
    Column('created_at', DateTime, default=func.now()),
)


class Group(ModelMixin, Base):
    __tablename__ = 'groups'
    __exclude_params__ = ('created_at', 'updated_at')
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(80), unique=True)
    users = relationship("User", secondary=user_groups_table, back_populates="groups")
    permissions = relationship("Permission", secondary=permission_groups_table, back_populates='groups')

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())



    def __repr__(self):
        return '<Group ({}) {}>'.format(self.id, self.name)


class User(ModelMixin, Base):
    __tablename__ = 'users'
    __exclude_params__ = ('created_at', 'updated_at')
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(30), index=True, unique=True)
    password = Column(PasswordType(
        schemes=[
            'pbkdf2_sha512',
        ],
    ))
    email = Column(EmailType, nullable=True, default=None)
    is_staff = Column(Boolean, default=False)
    groups = relationship("Group", secondary=user_groups_table, back_populates='users')
    permissions = relationship("Permission", secondary=permission_users_table, back_populates='users')

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    def update_params(self, **kwargs):
        def get_group(group):
            return get_or_create(self._session, Group, commit=False, name=group['name'])[0]
        kwargs = super(User, self).update_params(**kwargs)
        if not kwargs.get('password'):
            kwargs.pop('password')
        kwargs['groups'] = [get_group(group) for group in kwargs.get('groups', [])]
        return kwargs

    def to_json(self):
        return {
            'id': self.id,
            'username': self.username,
            'groups': [{'id': g.id, 'name': g.name} for g in self.groups],
            'email': self.email,
            'is_staff': self.is_staff,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }


def get_or_create(session, model, defaults=None, commit=True, add=True, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        params = dict((k, v) for k, v in kwargs.items() if not isinstance(v, ClauseElement))
        params.update(defaults or {})
        instance = model(**params)
        if add:
            session.add(instance)
        if commit:
            session.commit()
        return instance, True


def get_session_maker(db_name):
    # if os.path.exists(db_name):
    #     os.remove(db_name)
    engine = create_engine('sqlite:///' + db_name)
    Session = sessionmaker()
    Session.configure(bind=engine)
    Base.metadata.create_all(engine)
    return Session
