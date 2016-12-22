from nekumo.conf.base import Config, Input


class IfaceConfig(Config):
    config = Input(default=False)


class IfaceBase(object):
    config_class = None

    def __init__(self, nekumo, config):
        self.nekumo = nekumo
        self.config = config

    def start(self):
        pass
