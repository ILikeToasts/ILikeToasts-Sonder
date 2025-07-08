from rest_framework import serializers

from .models import Album, Artist, Genre, Playlist, Song

class AlbumSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    artists = serializers.ListField(child=serializers.CharField())
    genres = serializers.ListField(child=serializers.CharField(), allow_empty=True)
    release_date = serializers.CharField()
    tracks = serializers.ListField(child=serializers.CharField())
    album_art = serializers.URLField(allow_null=True)

class ArtistSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    genres = serializers.ListField(child=serializers.CharField(), allow_empty=True)
    followers = serializers.IntegerField()
    popularity = serializers.IntegerField()
    images = serializers.ListField(
        allow_empty=True
    )

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']
class AlbumDBSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    class Meta:
        model = Album
        fields = ['id', 'spotify_id', 'title', 'artist', 'genres', 'cover_url']

class ArtistDBSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    class Meta:
        model = Artist
        fields = ['id', 'spotify_id', 'name', 'genres', 'image_url', 'popularity', 'followers']
class SongSerializer(serializers.ModelSerializer):
    artists = ArtistSerializer(many=True, read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'title', 'spotify_id', 'cover_url', 'duration_seconds', 'album', 'artists']

class PlaylistDBSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'title', 'spotify_id', 'description', 'cover_url', 'songs']

