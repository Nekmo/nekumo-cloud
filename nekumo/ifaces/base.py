from nekumo.conf.base import Config


class IfaceConfig(Config):
    def __init__(self):
        super().__init__()


class IfaceBase(object):
    config_class = None

    def __init__(self, nekumo, config):
        self.nekumo = nekumo
        self.config = config

    def start(self):
        pass
