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


@web_bp.route('/encode.mp4', methods=['GET'])
def encode():

    headers = request.headers

    # headers = {'Range': 'bytes=18284544-'}
    def generate():
        # p = subprocess.Popen('ffmpeg -i /tmp/input.mkv -c:v libvpx -b:v 1M -f webm -', shell=True,
        # p = subprocess.Popen('ffmpeg -i /tmp/input.mkv -c:v h264 -f mp4 -movflags +faststart -movflags
        # frag_keyframe+empty_moov -', shell=True,
        # p = subprocess.Popen('ffmpeg -i /tmp/input.mkv -c:v h264 -f mp4 -movflags frag_keyframe+empty_moov -',
        # shell=True,

        cmd = ['ffmpeg',
               '-i', '/home/nekmo/simpsons.avi',
               '-c:v', 'h264',
               # '-c:a', 'aac',
               '-f', 'matroska', '-']
        b = parse_range_header(headers.get('Range'))
        print(headers, b)
        if b and b.ranges[0][0]:
            # cmd = [cmd[0]] + ['-skip_initial_bytes', str(max(0, b.ranges[0][0]))] + cmd[1:]
            # cmd = cmd[:3] + ['-ss', '00:23:00'] + cmd[3:]
            cmd = [
                'ffmpeg',
                # '-ss', '00:02:00',
                '-skip_initial_bytes', '{}'.format(b.ranges[0][0]),
                '-i', '/home/nekmo/simpsons.avi',
                # '-ss', '00:00:10',
                '-c:v', 'h264',
                '-c:a', 'copy',
                '-f', 'matroska',
                '-strict', 'experimental',  # Parece que ya no es necesario
                '-'
            ]
        print(cmd)
        # stdin = open('/home/nekmo/simpsons.avi', 'rb')
        # stdin.seek(max(0, b.ranges[0][0]))
        p = subprocess.Popen(cmd,
                             # stdin=stdin,
                             stdout=subprocess.PIPE)
        for row in iter(lambda: p.stdout.read(1024 * 8), ''):
            # print('sending... {}'.format(datetime.datetime.now()))
            yield row
    # def generate():
    #     for row in reversed(glob.glob1('/tmp/', 'output*.mp4')):
    #         yield open(os.path.join('/tmp', row), 'rb').read()
    # return Response(generate(), mimetype='video/webm')
    return Response(generate(), mimetype='video/mp4', headers={'Accept-Ranges': 'bytes'})



# @web_bp.route('/<path:path>', methods=['POST'])
@web_bp.route('/', methods=['POST'])
def path_api(path='/'):
    entry = current_app.nekumo.get_entry(path)
    return SimpleWebAPI.parse(request, entry)


# @web_bp.route('%s/static/<path:path>' % NEKUMO_ROOT)
def send_js(path):
    return send_from_directory(STATIC_DIRECTORY, path)


"""
import pychromecast

chromecasts = pychromecast.get_chromecasts()

cast = chromecasts[0]
cast.quit_app()

mc = cast.media_controller

mc.play_media('http://192.168.88.11:7080/encode.mp4', 'video/mp4', stream_type='LIVE')
# mc.play_media('http://192.168.88.11:8000/example2.mp4', 'video/mp4')

mc.update_status(); mc.status

Range: bytes=0-  # Al hacer una petición con seek
Range: bytes=18284544-  # Otra petición con seek

.seek() funciona, pero sólo al comienzo. Hace una nueva petición
"""