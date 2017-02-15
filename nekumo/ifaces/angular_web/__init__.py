
import os

import datetime

from flask import json
from flask.json import JSONEncoder
from os3.core.comparators import StartsWithEqual

from nekumo.conf.base import Input
from nekumo.gateways.base import ALL_METHODS_PROPERTIES
from nekumo.ifaces.base import IfaceBase, IfaceConfig
from flask import Flask
from flask_socketio import SocketIO
import socketio as socketio_lib
from flask import json as flask_json

from nekumo.ifaces.simple_web.jinja import filters

NEKUMO_ROOT = '/.nekumo'


class NekumoEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        elif isinstance(obj, datetime.timedelta):
            return (datetime.datetime.min + obj).time().isoformat()
        elif isinstance(obj, StartsWithEqual):
            return obj.name
        else:
            return super(NekumoEncoder, self).default(obj)


class FlaskSafeJSON(object):
    @staticmethod
    def dumps(*args, **kwargs):
        kwargs['cls'] = NekumoEncoder
        return flask_json.dumps(*args, **kwargs)

    @staticmethod
    def loads(*args, **kwargs):
        return flask_json.loads(*args, **kwargs)


socketio = SocketIO(json=FlaskSafeJSON)


class AngularWebConfig(IfaceConfig):
    address = Input(default='0.0.0.0')
    port = Input(default=7080)
    debug = Input(default=True)


class AngularWebIface(IfaceBase):

    def __init__(self, nekumo, config):
        super(AngularWebIface, self).__init__(nekumo, config)
        self.app = self.get_app_flask(debug=self.config.debug)
        self.app.nekumo = nekumo
        self.set_up_flask()

    def get_default_globals(self):
        return {
            'ALL_METHODS_PROPERTIES': ALL_METHODS_PROPERTIES,
            'LIST_METHODS': ['delete'],
        }

    def set_up_flask(self):
        from .views import web_bp
        from . import events
        self.update_globals(self.get_default_globals())
        self.app.register_blueprint(web_bp)
        socketio.nekumo = self.nekumo
        socketio.init_app(self.app, path='.nekumo/io', channel='.nekumo/io')
        socketio.on_namespace(events.APINamespace('/api'))

        self.app.jinja_env.add_extension('jinja2.ext.i18n')
        self.app.jinja_env.filters.update(filters)
        self.app.jinja_env.install_null_translations(newstyle=True)

    def update_globals(self, new_globals, app=None):
        if app is None:
            app = self.app
        app.jinja_env.globals.update(new_globals)

    @staticmethod
    def get_app_flask(name=None, debug=False, flask_class=Flask):
        if name is None:
            name = __name__
        app = flask_class(name, static_path='/.nekumo/static')
        app.debug = debug
        import binascii
        app.secret_key = binascii.hexlify(os.urandom(24))
        return app

    def _run(self):
        # Finally, if you're using PyCharm/PyDev,
        # enabling File->Settings..->Python Debugger->Gevent compatible debugging might be required.

        # eio = engineio.Server(async_mode='gevent')
        # app = engineio.Middleware(eio, self.app)
        # pywsgi.WSGIServer(('', self.config.port), app,
        #                   handler_class=WebSocketHandler).serve_forever()

        # socketio.run(self.app, self.config.address, self.config.port, threaded=True)

        socketio.run(self.app, self.config.address, self.config.port)

        # sio = socketio_lib.Server(async_mode='threading')
        # self.app.wsgi_app = socketio_lib.Middleware(sio, self.app.wsgi_app)
        # self.app.run(self.config.address, self.config.port, threaded=True)

        # self.app.run(self.config.address, self.config.port, self.config.debug,
        #              threaded=os.environ.get('NEKUMO_DEBUG_IFACE') != 'simple_web')
        # self.app.logger.info('app starting up....')

        # self.server = WSGIServer(
        #     (self.config.address, self.config.port),
        #     self.app,
        #     # handler_class=NekumoHandler
        #     handler_class=werkzeug.serving.WSGIRequestHandler
        # )
        # self.server.serve_forever()

    def run(self):
        # werkzeug.serving.run_with_reloader(self._run) if self.config.debug else self._run()
        self._run()


Iface = AngularWebIface
