import os
import shutil
from uuid import uuid4

from nekumo.conf.base import ParserInput
from nekumo.gateways.base import GatewayBase, GatewayConfig, NekumoDirListBase, NekumoFileBase, NekumoDirBase, \
    NekumoEntryBase, NekumoLocalDownload
from os3.fs.directory import Dir, DirList
from os3.fs.entry import Entry
from os3.fs.file import File
from os3.utils.nodes import deep_scandir


XATTR_KEY = 'user.id'

def generate_id():
    return uuid4().hex.encode('utf-8')


def get_id(path):
    import xattr
    try:
        return xattr.getxattr(path, XATTR_KEY)
    except OSError:
        pass
    try:
        id = generate_id()
        xattr.setxattr(path, XATTR_KEY, id.encode('utf-8'))
        return id
    except:
        pass


class Response(dict):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_json(self):
        return self


class NekumoEntryMixin(object):
    # features = [
    #     'local_storage',
    # ]
    #
    # def has_feature(self, feature):
    #     return feature.lower() in self.features

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
        self.gateway = kwargs.pop('gateway')
        self.root = self.root_path
        self.gateway_path = path
        super().__init__(path, **kwargs)

    def rename(self, new_name=None, new_path=None):
        assert new_name or new_path
        if new_name:
            path = self.parent().sub(new_name).path
        else:
            path = self.gateway.get_entry(new_path).gateway_path
        os.rename(self.gateway_path, path)

    def delete(self):
        return self.remove()

    def move(self, target):
        super(FSNekumoEntry, self).move(self.gateway.get_entry(target).gateway_path)

    def copy(self, target, symlinks=False, ignore=None):
        super(FSNekumoEntry, self).copy(self.gateway.get_entry(target).gateway_path, symlinks, ignore)

    def download(self):
        return NekumoLocalDownload(self.gateway_path)

    def parent(self):
        path = os.path.split(self.path)[0].rstrip('/') + '/'
        if self.root and not path.startswith(self.root):
            return None
        return self.get_classes()['Dir'](path, gateway=self.gateway)

    def details(self):
        return Response(**self.values('name', 'size', 'type', 'mimetype', 'mtime', 'atime'))

    @property
    def root_path(self):
        # TODO: borrar?
        return self.gateway.get_root_path()

    @classmethod
    def get_node(cls, path, gateway):
        path = cls._get_path(path)
        return cls.get_cls(path)(path, gateway=gateway)

    @property
    def id(self):
        return get_id(self.gateway_path) or super(FSNekumoEntry, self).id

    def __repr__(self):
        return self.name

FSNekumoEntry.entry_class = FSNekumoEntry


class FSNekumoDir(FSNekumoEntry, Dir, NekumoDirBase):
    def list(self, depth=None, fail=False, **kwargs):
        return self.get_dir_list_class()(self.path, depth, fail, gateway=self.gateway, **kwargs)

    def delete(self):
        shutil.rmtree(self.gateway_path)

    @classmethod
    def get_dir_list_class(cls):
        return FSNekumoDirList


class FSNekumoFile(FSNekumoEntry, File, NekumoFileBase):
    pass


class FSNekumoDirList(NekumoEntryMixin, DirList, NekumoDirListBase):
    entry_class = FSNekumoEntry
    __interfaces__ = ['name']
    __clone_params__ = ['path', 'depth', 'gateway']

    def __init__(self, path=None, *args, **kwargs):
        self.gateway = kwargs.pop('gateway', None)
        super().__init__(path, *args, **kwargs)

    def _get_iter(self):
        def cls(path):
            entry = self.get_entry_class()(path, gateway=self.gateway)
            return entry
        return deep_scandir(self.path, self.depth, cls=cls, filter=self._filter,
                            traverse_filter=self._traverse_filter, exceptions=self._get_catched_exceptions())

    def _prepare_next(self, elem):
        return self.get_entry_class().get_node(elem.path, self.gateway)

    @classmethod
    def get_node(cls, path, gateway):
        path = cls._get_path(path)
        return cls.get_cls(path)(path, gateway=gateway)

    def to_json(self):
        def upd(entry):
            entry['type'] = entry['type'].name
            return entry
        return list(map(upd, self.values('name', 'size', 'type', 'mimetype', 'mtime', 'atime')))


class FSConfig(GatewayConfig):
    uri = ParserInput('--fs-gateway')
    scheme = 'file'

    @classmethod
    def validate_uri(cls, uri):
        return (not uri.scheme or uri.scheme == cls.scheme) and os.path.exists(uri.path)


class FSGateway(GatewayBase):
    config_class = FSConfig

    def get_root_path(self):
        return self.config.uri

    def get_absolute_path(self, relative_path):
        relative_path = relative_path.rstrip('/')
        return os.path.join(self.get_root_path(), relative_path)

    def get_entry(self, relative_path=''):
        relative_path = relative_path.lstrip('/')
        path = self.get_absolute_path(relative_path)
        # TODO: Lo que debería pasar es el gateway, para poder sacar información adicional.
        # Además de la ruta real en disco, necesito tener una definión de cómo empezarán
        # las urls en el front. Por ejemplo, /, o /_media/foo/
        return FSNekumoEntry(path, gateway=self)
