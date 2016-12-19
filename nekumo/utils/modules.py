import importlib


def create_get_class(class_name, class_base):
    def get_class(gateway_module):
        if hasattr(gateway_module, class_name):
            return getattr(gateway_module, class_name)
        for key, value in vars(gateway_module).items():
            if key.endswith(class_name) and issubclass(value, class_base):
                return value
    return get_class


def create_get_gateways_modules(module_pattern, modules):
    def get_gateways_modules():
        return [importlib.import_module(module_pattern.format(module)) for module in modules]
    return get_gateways_modules


def create_get_classess(get_class, get_gateways_modules):
    def get_classes():
        return [get_class(module) for module in get_gateways_modules()]
    return get_classes
