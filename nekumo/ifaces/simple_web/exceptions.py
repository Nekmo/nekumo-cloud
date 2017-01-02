from nekumo.exceptions import NekumoException


class HttpMethodNotAllowed(NekumoException):
    def __init__(self, method=''):
        super(HttpMethodNotAllowed, self).__init__(
            'The {} method is not allowed.'.format(method), 405
        )