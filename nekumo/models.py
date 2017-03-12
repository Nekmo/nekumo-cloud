import os

from sqlalchemy_utils.types.choice import ChoiceType

from nekumo.core.i18n import _
from sqlalchemy import Column, DateTime, String, Integer, func, Boolean, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import ClauseElement
from sqlalchemy_utils import EmailType, PasswordType

Base = declarative_base()


TARGET_CHOICES = [
    ('THIS', _('This')),
    ('CHILDREN', _('Children')),
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


class Path(Base):
    __tablename__ = 'paths'
    id = Column(Integer, primary_key=True, autoincrement=True)
    gateway_id = Column(String(512), index=True)
    path = Column(String(4096), index=True)
    permissions = relationship("Permission", back_populates="path")

    created_at = Column(DateTime, default=func.now())


class Permission(Base):
    __tablename__ = 'permissions'
    id = Column(Integer, primary_key=True, autoincrement=True)
    path_id = Column(Integer, ForeignKey('paths.id'))
    path = relationship("Path", back_populates="permissions")

    create = Column(Boolean, default=False)
    read = Column(Boolean, default=False)
    update = Column(Boolean, default=False)
    delete = Column(Boolean, default=False)
    superuser = Column(Boolean, default=False)
    # O sólo hijos directos
    recursive = Column(Boolean, default=False)
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


class Group(Base):
    __tablename__ = 'groups'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(80), unique=True)
    users = relationship("User", secondary=user_groups_table, back_populates="groups")
    permissions = relationship("Permission", secondary=permission_groups_table, back_populates='groups')

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


class User(Base):
    __tablename__ = 'users'
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


def get_or_create(session, model, defaults=None, commit=True, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        params = dict((k, v) for k, v in kwargs.items() if not isinstance(v, ClauseElement))
        params.update(defaults or {})
        if commit:
            instance = model(**params)
            session.add(instance)
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
