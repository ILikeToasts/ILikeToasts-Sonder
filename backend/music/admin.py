from django.contrib import admin

from .models import (
    Album,
    Artist,
    Genre,
    MediaItem,
    Playlist,
    ProductionCompany,
    Review,
    Song,
    TMDbGenre,
    TMDbList,
    TMDbTVMediaItem,
)

# Register your models here.

admin.site.register(Genre)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(Review)
admin.site.register(Playlist)
admin.site.register(MediaItem)


@admin.register(TMDbList)
class TMDbListAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "last_synced")
    search_fields = ("name",)
    list_filter = ("category",)


@admin.register(TMDbGenre)
class TMDbGenreAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(ProductionCompany)
class ProductionCompanyAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(TMDbTVMediaItem)
class TMDbTVMediaItemAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "tmdb_list",
        "first_air_date",
        "seasons",
        "vote_average",
        "in_production",
    )
    search_fields = ("title", "original_name")
    list_filter = ("tmdb_list", "in_production", "genres")
    filter_horizontal = ("genres", "production_companies")
