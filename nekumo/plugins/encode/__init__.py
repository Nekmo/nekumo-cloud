from subprocess import Popen, PIPE
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

class FfmpegEncode(list):
    binary = 'ffmpeg'
    fmt = None

    def __init__(self, input_url=None, start_bytes=None):
        super(FfmpegEncode, self).__init__()
        self.append(self.binary)
        if start_bytes:
            self.set_skip_initial_bytes(start_bytes)
        if input_url:
            self.set_input_url(input_url)

    def set_encode(self, type):
        if type == 'chromecast':
            self.set_codec('v', 'h264')
            self.set_fmt('matroska')

    def set_skip_initial_bytes(self, b):
        self.insert(1, '-skip_initial_bytes')
        self.insert(2, '{}'.format(b))
        self.set_codec('a', 'copy')
        return self

    def set_input_url(self, url):
        self.extend(['-i', url])
        return self

    def set_codec(self, stream_specifier, codec):
        self.extend(['-c:{}'.format(stream_specifier), codec])
        return self

    def set_fmt(self, value='matroska'):
        self.extend(['-f', value])
        self.fmt = {'matroska': 'video/x-matroska'}.get(value)
        return self

    def set_output_stdout(self):
        self.append('-')
        return self

    def popen(self, to_stdout):
        self.set_output_stdout()
        return Popen(self, stdout=PIPE if to_stdout else None)
