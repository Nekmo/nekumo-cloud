import os

from sqlalchemy import Column, DateTime, String, Integer, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import ClauseElement
from sqlalchemy_utils import PasswordType

Base = declarative_base()


class Path(Base):
    __tablename__ = 'paths'
    id = Column(Integer, primary_key=True, autoincrement=True)
    gateway_id = Column(String(512), index=True)
    path = Column(String(4096), index=True)
    created_at = Column(DateTime, default=func.now())


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(30), index=True, unique=True)
    password = Column(PasswordType(
        schemes=[
            'pbkdf2_sha512',
        ],
    ))



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
