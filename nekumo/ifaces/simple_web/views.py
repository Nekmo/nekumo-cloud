import os
from flask import Blueprint
from flask import current_app
from flask import redirect
from flask import render_template
from flask import request
from flask import send_file
from flask import send_from_directory
from werkzeug.exceptions import NotFound

from nekumo.ifaces.simple_web import NEKUMO_ROOT
from nekumo.ifaces.simple_web.api import SimpleWebAPI

STATIC_DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

web_bp = Blueprint('core', __name__, template_folder='templates')


def serve_file(entry):
    download = entry.download()
    if download.download_method() == 'local_path':
        return send_file(download.local_path)


@web_bp.route('/<path:path>', methods=['GET'])
@web_bp.route('/', methods=['GET'])
def index(path='/'):
    entry = current_app.nekumo.get_entry(path)
    if not entry.exists():
        raise NotFound
    if entry.is_dir() and not path.endswith('/'):
        return redirect(path + '/')
    if entry.is_dir():
        entries = entry.ls().sort('name')
        return render_template('list.html', entry=entry, entries=entries, debug=current_app.config['DEBUG'])
    else:
        return serve_file(entry)


@web_bp.route('/<path:path>', methods=['POST'])
@web_bp.route('/', methods=['POST'])
def path_api(path='/'):
    entry = current_app.nekumo.get_entry(path)
    return SimpleWebAPI.parse(request, entry)


@web_bp.route('%s/static/<path:path>' % NEKUMO_ROOT)
def send_js(path):
    return send_from_directory(STATIC_DIRECTORY, path)
