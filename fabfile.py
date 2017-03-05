from fabric.context_managers import lcd
from fabric.operations import local


REPO = 'pypi'


def devenv():
    with lcd('nekumo/ifaces/angular_web/static'):
        local('jspm install')


def build():
    with lcd('nekumo/ifaces/angular_web'):
        local('gulp')


def bumpversion(part='patch'):
    local('bumpversion {}'.format(part))


def pypi():
    local('python setup.py register -r "{}"'.format(REPO))
    local('python setup.py sdist upload -r "{}"'.format(REPO))


def push():
    local('git push')
    local('git push --tags')


def release(part='patch'):
    build()
    bumpversion(part)
    push()
    pypi()
