from nekumo.utils.modules import create_get_class, create_get_gateways_modules

__all__ = ['simple_web']


get_ifaces_modules = create_get_gateways_modules("nekumo.ifaces.{}", __all__)


def get_ifaces():
    from nekumo.ifaces.base import IfaceBase
    get_gateway_class = create_get_class('Iface', IfaceBase)
    return [get_gateway_class(module) for module in get_ifaces_modules()]
