import os
from thumbs import thumb
from thumbs.exceptions import ThumbNotAvailable

DEFAULT_FORMAT = 'jpeg'
MAX_DIMENSIONS = (350, 350)


class ThumbDoesNotExist(Exception):
    pass


def thumbs_dir(nekumo):
    d = os.path.join(nekumo.data_dir, 'thumbs')
    os.makedirs(d, exist_ok=True)
    return d


def thumb_path(nekumo, entry):
     return os.path.join(thumbs_dir(nekumo), '{}.{}'.format(entry.id, DEFAULT_FORMAT))


def get_thumb(nekumo, entry):
    path = thumb_path(nekumo, entry)
    if not os.path.exists(path):
        raise ThumbDoesNotExist
    return path


def create_thumb(nekumo, entry):
    path = thumb_path(nekumo, entry)
    if thumb(entry.gateway_path, path,
             dimensions={'width': MAX_DIMENSIONS[0], 'height': MAX_DIMENSIONS[1], 'resize': 'max'},
             tformat=DEFAULT_FORMAT) is not None:
        return path


def get_or_create_thumb(nekumo, entry):
    try:
        return get_thumb(nekumo, entry)
    except ThumbDoesNotExist:
        pass
    try:
        return create_thumb(nekumo, entry)
    except ThumbNotAvailable:
        return