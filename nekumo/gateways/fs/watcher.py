import logging
import os

import pyinotify as pyinotify

from nekumo.core.events import GatewayUpdateEvent


logger = logging.getLogger('nekumo')


class EventHandler(pyinotify.ProcessEvent):
    def __init__(self, iface):
        super().__init__()
        self.iface = iface

    def process_default(self, event):
        path = event.pathname.replace(self.iface.get_root_path(), '')
        entry = self.iface.get_entry(path)
        directory = os.path.split(path)[0]
        action = event.maskname.replace('IN_', '').lower()
        self.iface.pubsub.fire(directory, GatewayUpdateEvent(self.iface, entry, action))


def init_watcher(iface):
    # The watch manager stores the watches and provides operations on watches
    wm = pyinotify.WatchManager()
    notifier = pyinotify.ThreadedNotifier(wm, EventHandler(iface))
    notifier.daemon = True
    notifier.start()
    mask = pyinotify.IN_DELETE | pyinotify.IN_CREATE  # watched events
    try:
        wdd = wm.add_watch(iface.get_root_path(), mask, rec=True, quiet=False)
    except pyinotify.WatchManagerError as e:
        logger.warning('Watcher not available for {}: {}'.format(iface, e))
