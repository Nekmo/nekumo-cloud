from nekumo.utils.modules import create_get_class, create_get_gateways_modules

__all__ = ['fs']


get_gateways_modules = create_get_gateways_modules("nekumo.gateways.{}", __all__)


def get_gateways():
    from nekumo.gateways.base import GatewayBase
    get_gateway_class = create_get_class('Gateway', GatewayBase)
    return [get_gateway_class(module) for module in get_gateways_modules()]
