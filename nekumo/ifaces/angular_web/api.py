import socketio
from flask.globals import current_app

from nekumo.core.api import NekumoAPI, NekumoAPIClient


class AngularNekumoAPIClient(NekumoAPIClient):
    def __init__(self, sid, app, socketio):
        self.sid = sid
        self.app = app
        self.socketio = socketio
        super().__init__()

    def listener(self, event):
        # self.socketio.emit('event', event, namespace='/api')
        # TODO: event -> ifaceEvent
        data = dict(entry=event.entry, action=event.action, **event.data)
        self.socketio.emit(event.method, data, namespace='/api')
        # with self.app.app_context():
        #     self.socketio.emit('event', event, namespace='/api')


class AngularNekumoAPI(NekumoAPI):
    pass
