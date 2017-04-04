"""
Code from Flask-login

https://github.com/maxcountryman/flask-login

MIT License
"""
import hmac
from hashlib import sha512

import six
from flask import current_app, request
from werkzeug.security import safe_str_cmp

from nekumo.models import User

AUTH_COOKIE_NAME = 'auth'


def get_auth_user():
    """Get authenticated user.
    """
    cookie = request.cookies.get(AUTH_COOKIE_NAME, None)
    if not cookie:
        return False
    user_id = decode_cookie(cookie)
    session = current_app.nekumo.session_maker()
    users = session.query(User).filter_by(id=user_id)
    if users.count():
        return users.first()


def has_perm(entry):
    if not current_app.nekumo.config['auth_mode']:
        return True
    user = get_auth_user()
    return bool(user)


def login_user(user, response):
    data = encode_cookie(str(user.id))
    response.set_cookie(AUTH_COOKIE_NAME,
                        value=data)


def encode_cookie(payload):
    '''
    This will encode a ``unicode`` value into a cookie, and sign that cookie
    with the app's secret key.
    :param payload: The value to encode, as `unicode`.
    :type payload: unicode
    '''
    return u'{0}|{1}'.format(payload, _cookie_digest(payload))


def decode_cookie(cookie):
    '''
    This decodes a cookie given by `encode_cookie`. If verification of the
    cookie fails, ``None`` will be implicitly returned.
    :param cookie: An encoded cookie.
    :type cookie: str
    '''
    try:
        payload, digest = cookie.rsplit(u'|', 1)
        if hasattr(digest, 'decode'):
            digest = digest.decode('ascii')  # pragma: no cover
    except ValueError:
        return

    if safe_str_cmp(_cookie_digest(payload), digest):
        return payload


def _cookie_digest(payload, key=None):
    key = _secret_key(key)

    return hmac.new(key, payload.encode('utf-8'), sha512).hexdigest()


def _secret_key(key=None):
    if key is None:
        key = current_app.config['SECRET_KEY']

    if isinstance(key, six.string_types):  # pragma: no cover
        key = key.encode('latin1')  # ensure bytes

    return key
