import os

import glob

import datetime
from flask import Blueprint
from flask import Response
from flask import current_app
from flask import redirect
from flask import render_template
from flask import request
from flask import send_file
from flask import send_from_directory
from flask import session
from future.moves import subprocess
from werkzeug.exceptions import NotFound
from werkzeug.http import parse_range_header

from nekumo.ifaces.angular_web import NEKUMO_ROOT
from nekumo.plugins.encode import FfmpegEncode

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
    elif 'gallery' in request.args:
        return render_template('gallery.html', entry=entry, debug=current_app.config['DEBUG'])
    else:
        return serve_file(entry)


@web_bp.route('/encode/<path:path>', methods=['GET'])
def encode(path):
    headers = request.headers
    entry = current_app.nekumo.get_entry(path)
    encode = request.args.get('encode', 'chromecast')
    if not entry.exists():
        raise NotFound
    ffmpeg_args = FfmpegEncode(entry.gateway_path)
    ffmpeg_args.set_encode(encode)
    b = parse_range_header(headers.get('Range'))

    if b and b.ranges[0][0]:
        ffmpeg_args.set_skip_initial_bytes(b.ranges[0][0])
    p = ffmpeg_args.popen(True)

    def generate():
        for row in iter(lambda: p.stdout.read(1024 * 8), ''):
            yield row
    return Response(generate(),
                    mimetype='video/mp4' if encode == 'chromecast' else ffmpeg_args.fmt,
                    headers={'Accept-Ranges': 'bytes'})


# @web_bp.route('/<path:path>', methods=['POST'])
@web_bp.route('/', methods=['POST'])
def path_api(path='/'):
    entry = current_app.nekumo.get_entry(path)
    return SimpleWebAPI.parse(request, entry)


# @web_bp.route('%s/static/<path:path>' % NEKUMO_ROOT)
def send_js(path):
    return send_from_directory(STATIC_DIRECTORY, path)
