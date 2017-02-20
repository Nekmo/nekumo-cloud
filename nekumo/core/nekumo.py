import hashlib
import os
from nekumo.gateways import get_gateway_classes, get_gateway_class_by_uri
from nekumo.models import get_session_maker


class Nekumo(object):
    gateways = None
    ifaces = None
    _id = None

    def __init__(self, gateways=None, debug=False):
        if gateways:
            self.gateways = list(self.get_gateways(gateways))
        self.set_nekmo_dir()
        self.session_maker = self.get_db_session_maker()
        self.session = self.session_maker()
        self.debug = debug

    def set_nekmo_dir(self):
        self.nekumo_dir = os.path.expanduser('~/.local/nekumo/envs/{}'.format(self.id))
        self.data_dir = os.path.join(self.nekumo_dir, 'data')
        os.makedirs(self.data_dir, exist_ok=True)

    def get_db_session_maker(self):
        return get_session_maker('db.sqlite3')

    def set_ifaces(self, ifaces):
        self.ifaces = ifaces

    @property
    def id(self):
        if not self._id:
            self._id = hashlib.sha1(b'\x00'.join([gateway.id.encode('utf-8')
                                                  for gateway in self.gateways])).hexdigest()
        return self._id

    def get_gateway_by_path(self, relative_path=''):
        return self.gateways[0].get_entry(relative_path)

    def get_entry(self, relative_path=''):
        relative_path = relative_path.lstrip('/')
        return self.get_gateway_by_path(relative_path)

    def get_gateways(self, gateways):
        for gateway in gateways:
            cls = get_gateway_class_by_uri(gateway)
            config = cls.config_class(gateway)
            yield cls(config, self)
