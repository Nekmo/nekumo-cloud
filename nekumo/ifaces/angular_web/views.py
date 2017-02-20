import mimetypes
import os

import re
import time
from flask import Blueprint
from flask import Response
from flask import current_app
from flask import redirect
from flask import render_template
from flask import request
from flask import send_file
from flask import send_from_directory, abort
from flask import session
from future.moves import subprocess
from werkzeug.exceptions import NotFound
from werkzeug.http import parse_range_header

from nekumo.ifaces.angular_web import NEKUMO_ROOT
from nekumo.plugins.encode import FfmpegEncode
from nekumo.plugins.thumbs import get_or_create_thumb

STATIC_DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

web_bp = Blueprint('core', __name__, template_folder='templates')


# @app.after_request
# def after_request(response):
#     response.headers.add('Accept-Ranges', 'bytes')
#     return response


def send_file_partial(path):
    """
        Simple wrapper around send_file which handles HTTP 206 Partial Content
        (byte ranges)
        TODO: handle all send_file args, mirror send_file's error handling
        (if it has any)

        https://gist.github.com/lizhiwei/7885684
    """
    range_header = request.headers.get('Range', None)
    if not range_header: return send_file(path)

    size = os.path.getsize(path)
    byte1, byte2 = 0, None

    m = re.search('(\d+)-(\d*)', range_header)
    g = m.groups()

    if g[0]: byte1 = int(g[0])
    if g[1]: byte2 = int(g[1])

    length = size - byte1
    if byte2 is not None:
        length = byte2 - byte1

    with open(path, 'rb') as f:
        f.seek(byte1)
        data = f.read(length)

    rv = Response(data,
                  206,
                  mimetype=mimetypes.guess_type(path)[0],
                  direct_passthrough=True)
    rv.headers.add('Content-Range', 'bytes {0}-{1}/{2}'.format(byte1, byte1 + length - 1, size))

    return rv


def serve_file(entry):
    download = entry.download()
    if download.download_method() == 'local_path':
        return send_file_partial(download.local_path)


@web_bp.context_processor
def inject_user():
    return dict(debug=current_app.nekumo.debug)


@web_bp.route('/slow', methods=['GET'])
def slow():
    time.sleep(100)
    return 'foo'


@web_bp.route('/<path:path>', methods=['GET'])
@web_bp.route('/', methods=['GET'])
def index(path='/'):
    entry = current_app.nekumo.get_entry(path)
    if not entry.exists():
        raise NotFound
    if entry.is_dir() and not path.endswith('/'):
        return redirect(path + '/')
    elif 'media' in request.args:
        return render_template('media.html', entry=entry)
    if entry.is_dir() or 'preview' in request.args:
        entry = entry if entry.is_dir() else entry.parent()
        entries = entry.ls().sort('name')
        # return render_template('list.html', entry=entry, entries=entries, debug=current_app.config['DEBUG'])
        return render_template('fileManager.html', entry=entry, entries=entries)
    else:
        return serve_file(entry)


@web_bp.route('/.nekumo/thumb/<path:path>', methods=['GET'])
def thumb(path):
    entry = current_app.nekumo.get_entry(path)
    path = get_or_create_thumb(current_app.nekumo, entry)
    if path is None:
        abort(404)
    return send_file(path)


@web_bp.route('/.nekumo/encode/<path:path>', methods=['GET'])
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
