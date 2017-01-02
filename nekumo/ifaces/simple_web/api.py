from flask import render_template

from nekumo.core.api import NekumoAPI
from nekumo.exceptions import NekumoException
from nekumo.ifaces.simple_web.exceptions import HttpMethodNotAllowed


class SimpleWebAPI(NekumoAPI):
    @classmethod
    def parse(cls, request, entry):
        error = None
        try:
            cls.deserialize(request, entry)
        except NekumoException as e:
            error = e
        return cls.serialize(request, entry, error)

    @classmethod
    def deserialize(cls, request, entry):
        form = request.form.to_dict()
        api_method = form.pop('method')
        if request.method == 'POST':
            return cls(entry).execute(api_method, **form)
        raise HttpMethodNotAllowed(request.method)

    @classmethod
    def serialize(cls, request, entry, error=None):
        return render_template('execute.html', method=request.form['method'], entries=[entry], error=error)
