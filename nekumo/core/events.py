


class GatewayEvent(object):
    def __init__(self, gateway, method):
        self.gateway = gateway
        self.method = method


class GatewayUpdateEvent(GatewayEvent):
    def __init__(self, gateway, entry, action, **data):
        super().__init__(gateway, 'update')
        self.entry = entry
        self.action = action
        self.data = data
