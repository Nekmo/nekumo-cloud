import os

import pyinotify as pyinotify

from nekumo.core.events import GatewayUpdateEvent


class EventHandler(pyinotify.ProcessEvent):
    def __init__(self, iface):
        super().__init__()
        self.iface = iface

    def process_default(self, event):
        path = event.pathname.replace(self.iface.get_root_path(), '')
        directory = os.path.split(path)[0]
        action = event.maskname.replace('IN_', '').lower()
        self.iface.pubsub.fire(directory, GatewayUpdateEvent(self.iface, path, action))


def init_watcher(iface):
    # The watch manager stores the watches and provides operations on watches
    wm = pyinotify.WatchManager()
    notifier = pyinotify.ThreadedNotifier(wm, EventHandler(iface))
    notifier.daemon = True
    notifier.start()
    mask = pyinotify.IN_DELETE | pyinotify.IN_CREATE  # watched events
    wdd = wm.add_watch(iface.get_root_path(), mask, rec=True)
