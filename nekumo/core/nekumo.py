from nekumo.gateways.fs import FSGateway


class Nekumo(object):
    gateways = None
    ifaces = None

    def __init__(self):
        pass

    def get_gateway_by_path(self, relative_path=''):
        return self.gateways[0].get_entry(relative_path)

    def get_entry(self, relative_path=''):
        return self.get_gateway_by_path(relative_path)
