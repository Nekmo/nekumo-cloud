from flask import session
from flask.ext.socketio import Namespace
from flask.globals import current_app
from flask_socketio import emit, join_room, leave_room

from nekumo.ifaces.angular_web import socketio
from nekumo.ifaces.angular_web.api import AngularWebAPI, AngularNekumoListAPI


class APINamespace(Namespace):
    io_events = ['connect', 'disconnect']

    def on_connect(self):
        pass

    def on_disconnect(self):
        pass

    def trigger_event(self, event, *args):
        # TODO: debe soportar también los métodos de NekumoListAPI
        if event in self.io_events:
            return super(APINamespace, self).trigger_event(event, *args)
        return self.socketio._handle_event(self.execute_handler(event, *args), event, self.namespace,
                                           *args)

    def execute_handler(self, event, *args):
        entry = None
        entries = None
        get_entry = self.socketio.nekumo.get_entry
        if 'entry' in args[1]:
            iface_path = args[1].pop('entry')
            entry = get_entry(iface_path)
        else:
            entries = args[1].pop('entries')
            entries = [get_entry(x) for x in entries]
        def execute(options):
            # El argumento room define el usuario que recibirá el mensaje
            if entry:
                data = AngularWebAPI(entry).execute(event, **options or {})
                data = data.to_json() if data else {'method': event}
            else:
                data = AngularNekumoListAPI(entries).execute(event, **options or {})
            # self.emit(event, data, args[0])
            return data
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
