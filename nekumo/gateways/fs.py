import os

from nekumo.conf.base import ParserInput
from nekumo.gateways.base import GatewayBase, GatewayConfig
from os3.fs.directory import Dir
from os3.fs.entry import Entry


class FSConfig(GatewayConfig):
    uri = ParserInput('--fs-gateway')


class FSGateway(GatewayBase):
    config_class = FSConfig

    def get_root_path(self):
        return self.config.uri

    def get_absolute_path(self, relative_path):
        return os.path.join(self.get_root_path(), relative_path)

    def get_entry(self, relative_path=''):
        return Entry(self.get_absolute_path(relative_path))
