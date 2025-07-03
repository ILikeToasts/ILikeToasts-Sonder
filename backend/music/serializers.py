from rest_framework import serializers

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
