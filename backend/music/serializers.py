from rest_framework import serializers

from .models import (
    Album,
    Artist,
    GameDeveloper,
    GameGenre,
    GamePublisher,
    Genre,
    MediaItem,
    Playlist,
    ProductionCompany,
    Review,
    Song,
    SteamGame,
    TMDbGenre,
    TMDbMovieMediaItem,
    TMDbTVMediaItem,
)

CATEGORY_CHOICES = [
    ("Movie", "Movie"),
    ("TVShow", "TVShow"),
    ("Anime", "Anime"),
]


class AlbumSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    artists = serializers.ListField(child=serializers.CharField())
    genres = serializers.ListField(child=serializers.CharField(), allow_empty=True)
    release_date = serializers.CharField()
    tracks = serializers.ListField(child=serializers.CharField())
    album_art = serializers.URLField(allow_null=True)


class AlbumImportSerializer(serializers.Serializer):
    album_id = serializers.CharField(max_length=100)


class TrackImportSerializer(serializers.Serializer):
    track_id = serializers.CharField(max_length=100)
    bop = serializers.BooleanField(default=True)


class PlaylistImportSerializer(serializers.Serializer):
    playlist_id = serializers.CharField(max_length=100)


class ArtistSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    genres = serializers.ListField(child=serializers.CharField(), allow_empty=True)
    followers = serializers.IntegerField()
    popularity = serializers.IntegerField()
    images = serializers.ListField(allow_empty=True)


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


class SongDBSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Song
        fields = ["id", "title", "wiki_summary", "genres", "cover_url", "spotify_id"]


class AlbumDBSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    songs = SongDBSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = [
            "id",
            "spotify_id",
            "title",
            "artist",
            "genres",
            "cover_url",
            "wiki_summary",
            "songs",
        ]


class ArtistDBSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = [
            "id",
            "spotify_id",
            "name",
            "genres",
            "image_url",
            "popularity",
            "followers",
            "wiki_summary",
        ]


class PlaylistDBSerializer(serializers.ModelSerializer):
    songs = SongDBSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ["id", "title", "spotify_id", "description", "cover_url", "songs"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "target_type",
            "album",
            "song",
            "rating",
            "content",
            "created_at",
        ]


class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = ["id", "file", "url", "height", "media_type", "category"]

    file = serializers.SerializerMethodField()

    def get_file(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.file.url)


class YTMediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = ["id", "url", "height", "media_type", "category"]

    def get_file(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.file.url)


class TMDbListImportSerializer(serializers.Serializer):
    list_id = serializers.CharField(max_length=100)
    category = serializers.ChoiceField(choices=CATEGORY_CHOICES)


class TMDbGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TMDbGenre
        fields = ["name"]


class ProductionCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionCompany
        fields = ["name"]


class TMDbTVMediaItemSerializer(serializers.ModelSerializer):
    genres = TMDbGenreSerializer(many=True, read_only=True)
    production_companies = ProductionCompanySerializer(many=True, read_only=True)
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = TMDbTVMediaItem
        fields = [
            "id",
            "title",
            "episode_run_time",
            "first_air_date",
            "in_production",
            "origin_country",
            "original_language",
            "original_name",
            "overview",
            "poster_url",
            "seasons",
            "vote_average",
            "vote_count",
            "last_synced",
            "genres",
            "production_companies",
        ]

    def get_poster_url(self, obj):
        return obj.poster_url()


class TMDbMovieMediaItemSerializer(serializers.ModelSerializer):
    genres = TMDbGenreSerializer(many=True, read_only=True)
    production_companies = ProductionCompanySerializer(many=True, read_only=True)
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = TMDbMovieMediaItem
        fields = [
            "id",
            "title",
            "runtime",
            "release_date",
            "origin_country",
            "original_language",
            "original_name",
            "overview",
            "poster_url",
            "vote_average",
            "vote_count",
            "last_synced",
            "genres",
            "production_companies",
        ]

    def get_poster_url(self, obj):
        return obj.poster_url()


class SteamGamesImportSerializer(serializers.Serializer):
    steam_id = serializers.CharField(max_length=100)


class GameDevelopperSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameDeveloper
        fields = ["name"]


class GamePublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamePublisher
        fields = ["name"]


class GameGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameGenre
        fields = ["name"]


class SteamGameSerializer(serializers.Serializer):
    developpers = GameDevelopperSerializer(many=True, read_only=True)
    publishers = GamePublisherSerializer(many=True, read_only=True)
    genres = GameGenreSerializer(many=True, read_only=True)

    class Meta:
        model = SteamGame
        fields = [
            "name",
            "appID",
            "description",
            "website",
            "developers",
            "publishers",
            "genres",
            "release_date",
            "image",
        ]
