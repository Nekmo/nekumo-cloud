from nekumo import models
from nekumo.exceptions import MethodNotAvailable


class NekumoAPIClient(object):
    def __init__(self):
        pass

    def listener(self, event):
        raise NotImplementedError


class ModelAPI(object):
    actions = ['all', 'get', 'create', 'delete', 'update']

    def __init__(self, nekumo, model, data=None, action=None):
        self.nekumo = nekumo
        self.model = model
        self.action = action
        self.data = data

    def execute(self):
        fn = getattr(self, self.action)
        return fn()

    def get_model(self):
        return getattr(models, self.model)

    def queryset(self, session=None):
        session = session or self.nekumo.session_maker()
        return session.query(self.get_model())

    def all(self):
        return self.queryset().all()

    def update(self, data=None):
        data = data or self.data
        session = self.nekumo.session_maker()
        if data.get('id'):
            # Update
            instance = self.get(data['id'], session)
            instance.update(_session=session, **data)
        else:
            # Create
            instance = self.get_model()(_session=session, **data)
            session.add(instance)
        session.commit()

    def get(self, id=None, session=None):
        id = self.data.get('id') or id
        return self.queryset(session).get(id)

    def delete(self, id=None, session=None):
        session = session or self.nekumo.session_maker()
        item = self.get(id, session)
        session.delete(item)
        session.commit()



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
    methods = ['watch', 'unwatch', 'model']
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
        elif 'entries' in obj:
            entries = obj.pop('entries')
            return [self.nekumo.get_entry(x) for x in entries]

    def execute(self, event, options):
        # El argumento room define el usuario que recibirá el mensaje
        fn = self.execute_method if event in self.methods else self.execute_entry
        return fn(event, **options)

    def execute_method(self, event, **options):
        if self.entry_entries is None:
            return getattr(self, 'on_{}'.format(event))(**options)
        elif not isinstance(self.entry_entries, list):
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

    def on_unwatch(self, entry):
        entry.unwatch(self.client)

    def on_model(self, **kwargs):
        return ModelAPI(self.nekumo, **kwargs).execute()