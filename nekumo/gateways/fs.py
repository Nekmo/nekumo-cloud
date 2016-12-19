import os

from nekumo.conf.base import ParserInput
from nekumo.gateways.base import GatewayBase, GatewayConfig
from os3.fs.directory import Dir, DirList
from os3.fs.entry import Entry
from os3.fs.file import File
from os3.utils.nodes import deep_scandir


class NekumoEntryMixin(object):
    @classmethod
    def get_classes(cls):
        return {
            'Dir': NekumoDir,
            'File': NekumoFile,
        }


class NekumoEntry(NekumoEntryMixin, Entry):
    # def __new__(cls, *args, **kwargs):
    #     return super().__new__(__entry_class=NekumoEntry, *args, **kwargs)

    def __init__(self, path, **kwargs):
        self.root_path = kwargs.pop('root_path', None)
        super().__init__(path, **kwargs)

    @classmethod
    def get_node(cls, path, root_path):
        path = cls._get_path(path)
        return cls.get_cls(path)(path, root_path)

    def relative_path(self):
        return self.path.replace(self.root_path, '', 1)

NekumoEntry.entry_class = NekumoEntry


class NekumoDir(NekumoEntry, Dir):
    def ls(self, depth=None, fail=False, **kwargs):
        return self.get_dir_list_class()(self.path, depth, fail, root_path=self.root_path, **kwargs)

    @classmethod
    def get_dir_list_class(cls):
        return NekumoDirList


class NekumoFile(NekumoEntry, File):
    pass


class NekumoDirList(NekumoEntryMixin, DirList):
    entry_class = NekumoEntry

    def __init__(self, path=None, *args, **kwargs):
        self.root_path = kwargs.pop('root_path', None)
        super().__init__(path, *args, **kwargs)

    def _get_iter(self):
        def cls(path):
            entry = self.get_entry_class()(path, root_path=self.root_path)
            return entry
        return deep_scandir(self.path, self.depth, cls=cls, filter=self._filter,
                            traverse_filter=self._traverse_filter, exceptions=self._get_catched_exceptions())

    @classmethod
    def get_node(cls, path, root_path):
        path = cls._get_path(path)
        return cls.get_cls(path)(path, root_path)


class FSConfig(GatewayConfig):
    uri = ParserInput('--fs-gateway')


class FSGateway(GatewayBase):
    config_class = FSConfig

    def get_root_path(self):
        return self.config.uri

    def get_absolute_path(self, relative_path):
        relative_path = relative_path.rstrip('/')
        return os.path.join(self.get_root_path(), relative_path)

    def get_entry(self, relative_path=''):
        path = self.get_absolute_path(relative_path)
        return NekumoEntry(path, root_path=path)
