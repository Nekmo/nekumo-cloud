from flask import session, request
from flask.ext.socketio import Namespace
from flask.globals import current_app
from flask_socketio import emit, join_room, leave_room

from nekumo.ifaces.angular_web import socketio
from nekumo.ifaces.angular_web.api import AngularNekumoAPI, AngularNekumoAPIClient

CLIENTS = {}


class APINamespace(Namespace):
    io_events = ['connect', 'disconnect']

    def on_connect(self):
        pass

    def on_disconnect(self):
        pass

    def trigger_event(self, event, *args):
        # TODO: debe soportar también los métodos de NekumoEntriesAPI
        if event in self.io_events:
            return super(APINamespace, self).trigger_event(event, *args)
        return self.socketio._handle_event(self.execute_handler(event, *args), event, self.namespace,
                                           *args)

    def get_api_client(self):
        sid = request.sid
        CLIENTS[sid] = CLIENTS.get(sid) or AngularNekumoAPIClient(sid, current_app, self.socketio)
        return CLIENTS[sid]

    def execute_handler(self, event, *args):
        def execute(options):
            return AngularNekumoAPI(args[1], self.socketio.nekumo, self.get_api_client()).execute(event, options or {})
        return execute

    def on_joined(self, message):
        """Sent by clients when they enter a room.
        A status message is broadcast to all people in the room."""
        room = session.get('room')
        join_room(room)
        emit('status', {'msg': ' has entered the room.'}, room=room)

    def on_text(self, message):
        """Sent by a client when the user entered a new message.
        The message is sent to all people in the room."""
        room = session.get('room')
        emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=room)

    def on_left(self, message):
        """Sent by clients when they leave a room.
        A status message is broadcast to all people in the room."""
        room = session.get('room')
        leave_room(room)
        emit('status', {'msg': session.get('name') + ' has left the room.'}, room=room)


# @socketio.on('joined', namespace='/chat')
# def joined(message):
#     """Sent by clients when they enter a room.
#     A status message is broadcast to all people in the room."""
#     room = session.get('room')
#     join_room(room)
#     emit('status', {'msg': ' has entered the room.'}, room=room)
#
#
# @socketio.on('text', namespace='/chat')
# def text(message):
#     """Sent by a client when the user entered a new message.
#     The message is sent to all people in the room."""
#     room = session.get('room')
#     emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=room)
#
#
# @socketio.on('left', namespace='/chat')
# def left(message):
#     """Sent by clients when they leave a room.
#     A status message is broadcast to all people in the room."""
#     room = session.get('room')
#     leave_room(room)
#     emit('status', {'msg': session.get('name') + ' has left the room.'}, room=room)
