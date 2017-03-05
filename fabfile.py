import os

import requests
from fabric.context_managers import lcd
from fabric.operations import local

# Github:
OWNER = 'nekmo'
REPOSITORY = 'nekumo-cloud'

REPO = 'pypi'
GITHUB_TOKEN_FILE = '~/.config/github_token.txt'

GITHUB_TOKEN = open(os.path.expanduser(GITHUB_TOKEN_FILE))
GITHUB_URL = 'https://api.github.com/repos/{owner}/{repository}/releases?access_token={token}'


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


# def github_release():
#     version = local('git describe --tags', capture=True)
#     requests.get(
#         GITHUB_URL.format(owner=OWNER, repository=REPOSITORY, token=GITHUB_TOKEN),
#         json={
#             "tag_name": version, "target_commitish": "master", "name": version,
#             "body": "Release of version {}".format(version),
#             "draft": False, "prerelease": False
#         }
#     )


def release(part='patch'):
    build()
    bumpversion(part)
    push()
    pypi()
