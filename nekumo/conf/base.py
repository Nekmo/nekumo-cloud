from collections import OrderedDict

import six


def get_fields(attrs):
    return filter(lambda x: isinstance(x, Input), attrs)


class Input(object):
    default = None
    # TODO: usar append para argparse:
    # https://docs.python.org/3/library/argparse.html

    def __init__(self, default=None):
        if self.default is None:
            self.default = default


class ParserInput(object):
    def __init__(self, argument):
        self.argument = argument

    def parser_argument(self, parser):
        return parser.add_argument(self.argument, action='append')

    def parse(self, args):
        pass


class MetaConfig(type):
    def __new__(mcs, name, bases, attrs, **kwargs):
        mcs._fields = mcs.get_fields(attrs)
        attrs.update({key: value.default for key, value in mcs._fields.items()})
        return super().__new__(mcs, name, bases, attrs, **kwargs)

    @classmethod
    def __prepare__(mcs, name, bases):
         return OrderedDict()

    @classmethod
    def get_fields(cls, attrs=None):
        attrs = attrs or {key: getattr(cls, key) for key in dir(cls)}
        return OrderedDict([(key, input) for key, input in attrs.items() if isinstance(input, Input)])


class ConfigBase(six.with_metaclass(MetaConfig)):
    def __init__(self):
        pass


class Config(ConfigBase):
    def __init__(self, debug=None):
        if debug is not None:
            self.debug = debug
        super(Config, self).__init__()
