from urllib.parse import urlparse

from nekumo.utils.modules import create_get_class, create_get_gateways_modules

__all__ = ['fs']


get_gateways_modules = create_get_gateways_modules("nekumo.gateways.{}", __all__)


def get_gateway_classes():
    """Obtener las clases gateway
    """
    from nekumo.gateways.base import GatewayBase
    get_gateway_class = create_get_class('Gateway', GatewayBase)
    return [get_gateway_class(module) for module in get_gateways_modules()]


def get_gateway_class_by_uri(uri):
    """Obtener la clase de Gateway a utilizar según su URI
    """
    uri = urlparse(uri)
    for gateway_class in get_gateway_classes():
        if gateway_class.config_class.validate_uri(uri):
            return gateway_class
