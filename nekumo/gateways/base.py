from nekumo.conf.base import Config
from nekumo.core.i18n import _

ALL_METHODS_PROPERTIES = {
    'name': _('Name'),
    'type': _('Type'),
    'delete': _('Delete'),
    'list': _('List'),
    'mkdir': _('Mkdir'),
}


class GatewayConfig(Config):
    def __init__(self, uri):
        super().__init__()
        self.uri = uri


class NekumoEntryBase(object):
    methods = ['delete']
    properties = ['name', 'type']

    @property
    def name(self):
        raise NotImplementedError

    @property
    def type(self):
        raise NotImplementedError

    def delete(self):
        raise NotImplementedError


class NekumoDirBase(NekumoEntryBase):
    methods = NekumoEntryBase.methods + ['list', 'mkdir']

    def list(self, depth=None):
        raise NotImplementedError

    def mkdir(self, name):
        raise NotImplementedError


class NekumoFileBase(NekumoEntryBase):
    pass


class NekumoDirListBase(object):
    def delete(self):
        raise NotImplementedError


class GatewayBase(object):
    config_class = None

    def __init__(self, config):
        self.config = config

    @classmethod
    def parse(cls, args, parser_argument):
        return [cls(cls.config_class(gateway_uri)) for gateway_uri in getattr(args, parser_argument.dest)]
