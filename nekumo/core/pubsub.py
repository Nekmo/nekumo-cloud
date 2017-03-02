

class Listener(object):
    def __init__(self, function=None, recursive=False, client=None):
        """
        :param function: Function to execute
        :param recursive: listen subpath changes
        :param client: Client is required for remove listener
        """
        self.recursive = recursive
        self.function = function
        self.client = client

    def fire(self, event):
        if self.function:
            self.function(event)
        else:
            raise NotImplementedError('Function or override fire is required!')


class Event(object):
    def __init__(self, path, action):
        self.path = path
        self.action = action


class ListenersList(list):
    def __init__(self, node):
        super(ListenersList, self).__init__()
        self.node = node
        self._recursive = []

    def update_cache(self):
        self._recursive = list(filter(lambda x: x.recursive, self))

    def fire(self, event, all_listeners=True):
        listeners = self if all_listeners else self._recursive
        for listener in listeners:
            listener.fire(event)
        return listeners

    def clear(self):
        response = super(ListenersList, self).clear()
        self.update_cache()
        return response

    def append(self, p_object):
        response = super(ListenersList, self).append(p_object)
        self.update_cache()
        return response

    def extend(self, t):
        response = super(ListenersList, self).extend(t)
        self.update_cache()
        return response

    def insert(self, x, y):
        response = super(ListenersList, self).insert(x, y)
        self.update_cache()
        return response

    def pop(self, index=None):
        response = super(ListenersList, self).pop(index)
        self.update_cache()
        return response

    def remove(self, value):
        response = super(ListenersList, self).remove(value)
        self.update_cache()
        return response


class PubSubNode(dict):
    splitter = '/'

    def __init__(self, parent=None, name=''):
        super().__init__()
        self.parent = parent
        self.name = name
        self.listeners = ListenersList(self)
        self.path = self.get_path()

    def get_path(self):
        if self.parent is None:
            return ''
        return self.splitter.join((self.parent.path, self.name))

    def split_node(self, node):
        node = node.strip(self.splitter)
        return node.split(self.splitter)

    def get_subnode(self, node_path, create=False, callback=None):
        """Obtener de un path el nodo final. Si create está especificado,
        se crearán nodos que no existen para alcanzar el final
        :param node_path: Ruta al nodo a obtener. Por ejemplo, /foo/bar/spam
        :param create: Booleano. Si deben crearse nodos en caso de no existir.
        :param callback: Ejecutar una función por cada nodo obtenido.
        """
        pubsub_node = self
        for subnode in self.split_node(node_path):
            # subnode puede ser '' cuando se está suscribiendo a la raíz. En tal caso, no crearemos un nuevo
            # subnodo ni intentaremos acceder al mismo.
            if not create and subnode and subnode not in pubsub_node:
                raise KeyError('Subnode {} not exists for {}.'.format(subnode, node_path))
            elif create and subnode and subnode not in pubsub_node:
                pubsub_node[subnode] = PubSubNode(pubsub_node, subnode)
            if subnode:
                pubsub_node = pubsub_node[subnode]
            if callback is not None:
                callback(pubsub_node, node_path)
        return pubsub_node

    def register(self, node_path, listener):
        """Registrar un listener para un node_path
        :param node_path: Ruta al nodo a obtener. Por ejemplo, /foo/bar/spam
        :param listener: Listener a ejecutar en caso de fire event.
        :return:
        """
        pubsub_node = self.get_subnode(node_path, True)
        pubsub_node.listeners.append(listener)

    def unregister(self, node_path, client):
        pubsub_node = self.get_subnode(node_path, True)
        for listener in tuple(pubsub_node.listeners):
            if listener.client == client:
                pubsub_node.listeners.remove(client)

    def fire(self, node_path, event):
        # TODO: threading
        fired = []

        def fire_each(pubsub_node, node):
            fired.extend(pubsub_node.listeners.fire(event, pubsub_node.path.strip('/') == node.strip('/')))
        try:
            self.get_subnode(node_path, callback=fire_each)
        except KeyError:
            pass
        return fired

    def __str__(self):
        return '<PubSubNode {}>'.format(self.path or '(root)')
