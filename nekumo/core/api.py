from nekumo.exceptions import MethodNotAvailable


class NekumoAPIClient(object):
    def __init__(self):
        pass

    def listener(self, event):
        raise NotImplementedError


class NekumoEntryAPI(object):
    def __init__(self, entry):
        self.entry = entry

    def execute(self, method, **kwargs):
        if not self.entry.has_method(method):
            raise MethodNotAvailable(method)
        return getattr(self.entry, method)(**kwargs)


class NekumoEntriesAPI(object):
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


class NekumoAPI(object):
    # Methods not implemented in entries
    methods = ['watch']
    entry_api_class = NekumoEntryAPI
    entries_api_class = NekumoEntriesAPI

    def __init__(self, entry_entries, nekumo, client=None):
        self.nekumo = nekumo
        self.entry_entries = self.get_entry_entries(entry_entries)
        self.client = client

    def get_entry_entries(self, obj):
        if 'entry' in obj:
            iface_path = obj.pop('entry')
            return self.nekumo.get_entry(iface_path)
        else:
            entries = obj.pop('entries')
            return [self.nekumo.get_entry(x) for x in entries]

    def execute(self, event, options):
        # El argumento room define el usuario que recibirá el mensaje
        fn = self.execute_method if event in self.methods else self.execute_entry
        return fn(event, **options)

    def execute_method(self, event, **options):
        if not isinstance(self.entry_entries, list):
            return getattr(self, 'on_{}'.format(event))(self.entry_entries, **options)
        else:
            for entry in self.entry_entries:
                getattr(self, 'on_{}'.format(event))(entry, **options)
            # TODO: multiple results

    def execute_entry(self, event, **options):
        if not isinstance(self.entry_entries, list):
            data = self.entry_api_class(self.entry_entries).execute(event, **options or {})
            data = data.to_json() if data else {'method': event}
        else:
            data = self.entries_api_class(self.entry_entries).execute(event, **options or {})
        # self.emit(event, data, args[0])
        return data

    def on_watch(self, entry):
        entry.watch(self.client)
