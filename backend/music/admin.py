from django.contrib import admin

from .models import Album, Artist, Genre, Playlist, Review, Song

# Register your models here.

admin.site.register(Genre)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(Review)
admin.site.register(Playlist)
