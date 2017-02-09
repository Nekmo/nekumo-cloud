from nekumo.exceptions import MethodNotAvailable


class NekumoAPI(object):
    def __init__(self, entry):
        self.entry = entry

    def execute(self, method, **kwargs):
        if not self.entry.has_method(method):
            raise MethodNotAvailable(method)
        return getattr(self.entry, method)(**kwargs)


class NekumoListAPI(object):
    def __init__(self, entries):
        self.entries = entries

    def execute(self, method, **kwargs):
        return getattr(self, method)(**kwargs)

    def move(self, target):
        for entry in self.entries:
            entry.move(target)
        return {'method': 'move'}

    def copy(self, target):
        for entry in self.entries:
            entry.copy(target)
        return {'method': 'copy'}

    def download(self):
        raise NotImplementedError

    def delete(self):
        for entry in self.entries:
            entry.delete()
        return {'method': 'delete'}