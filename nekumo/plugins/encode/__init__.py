from subprocess import Popen, PIPE


class FfmpegEncode(list):
    binary = 'ffmpeg'

    def __init__(self, input_url=None, start_bytes=None):
        super(FfmpegEncode, self).__init__()
        self.append(self.binary)
        if start_bytes:
            self.set_skip_initial_bytes(start_bytes)
        if input_url:
            self.set_input_url(input_url)

    def set_skip_initial_bytes(self, b):
        self.extend(['-skip_initial_bytes', '{}'.format(b)])
        return self

    def set_input_url(self, url):
        self.extend(['-i', url])
        return self

    def set_codec(self, stream_specifier, codec):
        self.extend(['-c:{}'.format(stream_specifier), codec])
        return self

    def set_fmt(self, value='matroska'):
        self.extend(['-f', value])
        return self

    def set_output_stdout(self):
        self.append('-')
        return self

    def popen(self, to_stdout):
        return Popen(self, stdout=PIPE if to_stdout else None)
