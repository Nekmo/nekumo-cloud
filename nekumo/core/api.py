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

    def move(self, target):
        raise NotImplementedError

    def copy(self, target):
        raise NotImplementedError

    def download(self):
        raise NotImplementedError

    def delete(self):
        raise NotImplementedError
