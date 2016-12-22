import os
from wsgiref.simple_server import WSGIServer, WSGIRequestHandler

import asyncio
import werkzeug.serving

from nekumo.conf.base import Input
from nekumo.gateways.base import ALL_METHODS_PROPERTIES
from nekumo.ifaces.base import IfaceBase, IfaceConfig
from flask import Flask
from werkzeug.debug import DebuggedApplication

from nekumo.ifaces.simple_web.jinja import filters

NEKUMO_ROOT = '/.nekumo'


class SimpleWebConfig(IfaceConfig):
    address = Input(default='127.0.0.1')
    port = Input(default=7070)
    debug = Input(default=True)


class SimpleWebIface(IfaceBase):

    def __init__(self, nekumo, config):
        super(SimpleWebIface, self).__init__(nekumo, config)
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
        self.update_globals(self.get_default_globals())
        self.app.register_blueprint(web_bp)
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
        app = flask_class(name)
        app.debug = debug
        import binascii
        app.secret_key = binascii.hexlify(os.urandom(24))
        return app

    def _run(self):
        self.app.run(self.config.address, self.config.port, self.config.debug,
                     threaded=os.environ.get('NEKUMO_DEBUG_IFACE') != 'simple_web')
        # self.app.logger.info('app starting up....')
        # self.server = WSGIServer(
        #     (self.config.address, self.config.port),
        #     app,
        #     # handler_class=NekumoHandler
        #     handler_class=werkzeug.serving.WSGIRequestHandler
        # )
        # self.server.serve_forever()

    def run(self):
        # werkzeug.serving.run_with_reloader(self._run) if self.config.debug else self._run()
        self._run()


Iface = SimpleWebIface
