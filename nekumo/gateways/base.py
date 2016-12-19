from nekumo.conf.base import Config


class GatewayConfig(Config):
    def __init__(self, uri):
        super().__init__()
        self.uri = uri


class GatewayBase(object):
    config_class = None

    def __init__(self, config):
        self.config = config

    @classmethod
    def parse(cls, args, parser_argument):
        return [cls(cls.config_class(gateway_uri)) for gateway_uri in getattr(args, parser_argument.dest)]
