import os

from nekumo.conf.base import Config
from nekumo.core.i18n import _
from nekumo.models import Path, get_or_create

ALL_METHODS_PROPERTIES = {
    'name': _('Name'),
    'type': _('Type'),
    'delete': _('Delete'),
    'list': _('List'),
    'mkdir': _('Mkdir'),
}


class GatewayConfig(Config):
    scheme = None

    def __init__(self, uri):
        super().__init__()
        self.uri = uri

    @classmethod
    def validate_uri(cls, uri):
        """Comprobar si la uri pertenece a este gateway
        """
        return uri.scheme == cls.scheme


class NekumoUploadBase(object):
    pass


class NekumoDownloadBase(object):

    @property
    def local_path(self):
        return self.get_local_path()

    def get_local_path(self):
        raise NotImplementedError

    def download_method(self):
        """local_path, io...
        :return:
        """
        raise NotImplementedError


class NekumoLocalDownload(NekumoDownloadBase):
    def __init__(self, local_path):
        self._local_path = local_path

    def get_local_path(self):
        return self._local_path

    def download_method(self):
        return 'local_path'


class NekumoEntryBase(object):
    methods = ['rename', 'delete', 'parent', 'move', 'copy', 'details']
    properties = ['name', 'type']
    path = ''
    root_path = ''

    def __init__(self, gateway_path, gateway=None):
        self.gateway_path = gateway_path
        self.gateway = gateway

    def rename(self, new_name=None, new_path=None):
        raise NotImplementedError

    def delete(self):
        raise NotImplementedError

    def parent(self):
        raise NotImplementedError

    def move(self, target):
        raise NotImplementedError

    def copy(self, target):
        raise NotImplementedError

    def download(self):
        raise NotImplementedError

    @property
    def name(self):
        raise NotImplementedError

    @property
    def type(self):
        raise NotImplementedError

    @property
    def gateway_root_path(self):
        return self.gateway.root_path

    @property
    def relative_path(self):
        return self.gateway_path.rstrip('/').replace(self.gateway_root_path.rstrip('/'), '', 1).lstrip('/')

    @property
    def iface_root_path(self):
        return self.gateway.iface_root_path

    @property
    def iface_path(self):
        return os.path.join(self.iface_root_path, self.relative_path)

    def has_method(self, method):
        return method in self.methods

    def has_property(self, property):
        return property in self.properties

    def breadcrumbs(self):
        # TODO: usar parent para sacar los elementos hasta el elemento del root_path para
        # construir el listado.
        items = []
        parent = self
        while True:
            items.append(parent)
            parent = parent.parent()
            if not parent:
                break
        return list(reversed(items))

    def details(self):
        raise NotImplementedError

    @property
    def id(self):
        p, exists = get_or_create(self.gateway.nekumo.session, Path, path=self.gateway_path, gateway_id=self.gateway.id)
        return p.id


class NekumoDirBase(NekumoEntryBase):
    methods = NekumoEntryBase.methods + ['list', 'mkdir']

    def upload(self, target):
        raise NotImplementedError

    def list(self, depth=None):
        raise NotImplementedError

    def mkdir(self, name):
        raise NotImplementedError


class NekumoFileBase(NekumoEntryBase):
    pass


class NekumoDirListBase(object):
    def delete(self):
        raise NotImplementedError

    def to_json(self):
        raise NotImplementedError


class GatewayBase(object):
    config_class = None

    def __init__(self, config, nekumo):
        self.config = config
        self.nekumo = nekumo

    @property
    def root_path(self):
        return self.config.uri

    @property
    def iface_root_path(self):
        return '/'

    @classmethod
    def parse(cls, args, parser_argument):
        # TODO: borrar?
        return [cls(cls.config_class(gateway_uri))
                for gateway_uri in getattr(args, parser_argument.dest)]

    @property
    def id(self):
        """El id es el identificado único que diferencia un gateway de otro.
        """
        return self.config.uri
