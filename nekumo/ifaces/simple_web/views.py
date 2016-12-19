import os
from flask import Blueprint
from flask import current_app
from flask import render_template
from flask import send_from_directory

from nekumo.ifaces.simple_web import NEKUMO_ROOT

STATIC_DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

web_bp = Blueprint('core', __name__, template_folder='templates')


@web_bp.route('/<path:path>')
@web_bp.route('/')
def index(path='/'):
    entry = current_app.nekumo.get_entry(path)
    if entry.is_dir():
        entries = entry.ls().sort('name')
    else:
        entries = []
    template = 'list.html' if entry.is_dir() else 'file.html'
    return render_template(template, entry=entry, entries=entries,
                           debug=current_app.config['DEBUG'])


@web_bp.route('%s/static/<path:path>' % NEKUMO_ROOT)
def send_js(path):
    return send_from_directory(STATIC_DIRECTORY, path)
