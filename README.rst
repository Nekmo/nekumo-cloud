############
Nekumo Cloud
############

Nekumo allows you to work with your files anywhere. Using Nekumo is very easy: run it in a directory and share
your files with the world.

.. code-block::

    $ nekumo /directory/to/serve
    Welcome to Nekumo Cloud! Your personal cloud. Serving:
      /directory/to/serve/ (FS)
    Interfaces on use:
      http://0.0.0.0:7080 (AngularWeb)

=================================  =================================  =========================
.. image:: imgs/detail-view.png    .. image:: imgs/grid-view.png      .. image:: imgs/media.png
.. image:: imgs/image-preview.png  .. image:: imgs/video-preview.png
=================================  =================================  =========================


Install
=======

.. code-block::

    $ pip install nekumo


Features
========

- Open, move, copy and delete files.
- Thumbnails for your files without opening them.
- Preview files (audio, video, image).
- Send videos to Chromecast.
- Changes are displayed in real time (Websockets) including changes made by external programs.
- Modern Angular Material responsive web interface.


Future features
---------------

- Tests.
- Users and permissions.
- Openstack Gateway.
- Search.
- Upload files.
- Download multiple files.
- Text and sourcecode editor.
