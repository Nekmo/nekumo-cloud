import os

from nekumo.conf.base import ParserInput
from nekumo.gateways.base import GatewayBase, GatewayConfig, NekumoDirListBase, NekumoFileBase, NekumoDirBase, \
    NekumoEntryBase
from os3.fs.directory import Dir, DirList
from os3.fs.entry import Entry
from os3.fs.file import File
from os3.utils.nodes import deep_scandir


class NekumoEntryMixin(object):
    features = [
        'local_storage',
    ]

    def has_feature(self, feature):
        return feature.lower() in self.features

    @classmethod
    def get_classes(cls):
        return {
            'Dir': FSNekumoDir,
            'File': FSNekumoFile,
        }


class FSNekumoEntry(NekumoEntryMixin, Entry, NekumoEntryBase):
    # def __new__(cls, *args, **kwargs):
    #     return super().__new__(__entry_class=FSNekumoEntry, *args, **kwargs)

    def __init__(self, path, **kwargs):
        self.root_path = kwargs.pop('root_path', None)
        super().__init__(path, **kwargs)

    @classmethod
    def get_node(cls, path, root_path):
        path = cls._get_path(path)
        return cls.get_cls(path)(path, root_path=root_path)

    def relative_path(self):
        return self.path.replace(self.root_path, '', 1)

FSNekumoEntry.entry_class = FSNekumoEntry


class FSNekumoDir(FSNekumoEntry, Dir, NekumoDirBase):
    def ls(self, depth=None, fail=False, **kwargs):
        return self.get_dir_list_class()(self.path, depth, fail, root_path=self.root_path, **kwargs)

    @classmethod
    def get_dir_list_class(cls):
        return FSNekumoDirList


class FSNekumoFile(FSNekumoEntry, File, NekumoFileBase):
    pass


class FSNekumoDirList(NekumoEntryMixin, DirList, NekumoDirListBase):
    entry_class = FSNekumoEntry
    __interfaces__ = ['name']
    __clone_params__ = ['path', 'depth', 'root_path']

    def __init__(self, path=None, *args, **kwargs):
        self.root_path = kwargs.pop('root_path', None)
        super().__init__(path, *args, **kwargs)

    def _get_iter(self):
        def cls(path):
            entry = self.get_entry_class()(path, root_path=self.root_path)
            return entry
        return deep_scandir(self.path, self.depth, cls=cls, filter=self._filter,
                            traverse_filter=self._traverse_filter, exceptions=self._get_catched_exceptions())

    def _prepare_next(self, elem):
        return self.get_entry_class().get_node(elem.path, self.root_path)

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
        return FSNekumoEntry(path, root_path=path)
