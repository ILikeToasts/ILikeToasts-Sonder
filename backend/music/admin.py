from django.contrib import admin
from .models import Genre, Artist, Album, Playlist, Song, Review
# Register your models here.

admin.site.register(Genre)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(Review)
admin.site.register(Playlist)