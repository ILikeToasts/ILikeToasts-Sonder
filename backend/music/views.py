from django.http import HttpResponse
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from music.ollama_client import Ollama_client
from music.utils.data_importer import (
    add_album_by_id,
    add_playlist_by_id,
    add_track_by_id,
)

from .models import Album, Artist, MediaItem, Playlist, Review, Song
from .serializers import (
    AlbumDBSerializer,
    AlbumImportSerializer,
    AlbumSerializer,
    ArtistDBSerializer,
    ArtistSerializer,
    MediaItemSerializer,
    PlaylistDBSerializer,
    ReviewSerializer,
    SongDBSerializer,
    TrackImportSerializer,
    YTMediaItemSerializer,
)
from .spotify_client import SpotifyClient


def index(request):
    return HttpResponse("Hi")


class AlbumDetail(APIView):
    def get(self, request, album_id):
        client = SpotifyClient()
        try:
            album_data = client.get_album(album_id)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AlbumSerializer(album_data)
        return Response(serializer.data)


class ArtistDetail(APIView):
    def get(self, request, artist_id):
        client = SpotifyClient()
        try:
            artist_data = client.get_artist(artist_id)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ArtistSerializer(artist_data)
        return Response(serializer.data)


class AlbumListView(generics.ListAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumDBSerializer


class AlbumImportView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "album_id",
                openapi.IN_QUERY,
                description="Spotify Album ID",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            201: "Album imported successfully",
            400: "Invalid album_id",
            500: "Internal server error",
        },
    )
    def post(self, request):
        serializer = AlbumImportSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        album_id = serializer.validated_data["album_id"]

        try:
            client = SpotifyClient()
            sp = client.sp
            add_album_by_id(sp, album_id)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": f"Album '{album_id}' imported successfully!"},
            status=status.HTTP_201_CREATED,
        )


class TrackImportView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "track_id",
                openapi.IN_QUERY,
                description="Spotify track ID",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            201: "Track imported successfully",
            400: "Invalid track_id",
            500: "Internal server error",
        },
    )
    def post(self, request):
        serializer = TrackImportSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        track_id = serializer.validated_data["track_id"]

        try:
            client = SpotifyClient()
            sp = client.sp
            add_track_by_id(sp, track_id)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(
            {"message": f"Track '{track_id}' imported successfully"},
            status=status.HTTP_201_CREATED,
        )


class TracksListView(generics.ListAPIView):
    serializer_class = SongDBSerializer

    def get_queryset(self):
        return Song.objects.filter(album__isnull=True)


class ArtistListView(generics.ListAPIView):
    queryset = Artist.objects.filter(albums__isnull=False).distinct()
    serializer_class = ArtistDBSerializer


class PlaylistView(generics.ListAPIView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistDBSerializer


# TODO : Disable this functionnality for now
class PlaylistImport(APIView):
    def post(self, request, playlist_id):
        if not playlist_id:
            return Response(
                {"error": "Missing playlist_id"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            client = SpotifyClient()
            sp = client.sp
            add_playlist_by_id(sp, playlist_id)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": f"Playlist '{playlist_id}' imported successfully!"},
            status=status.HTTP_201_CREATED,
        )


class ReviewsByAlbumView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        album_id = self.kwargs.get("album_id")
        try:
            album = Album.objects.get(id=album_id)
        except Album.DoesNotExist:
            raise NotFound(detail="Album not found.")

        return Review.objects.filter(target_type="album", album=album)


class RecommendArtistsView(APIView):
    def get(self, request, artist_name):
        if not artist_name:
            return Response({"error": "Missing 'artist' parameter"}, status=400)

        try:
            client = Ollama_client()
            recommendations = client.generate_artists_recommendations(artist_name)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)


class RecommendAlbumsView(APIView):
    def get(self, request, album_name, artist_name):
        if not artist_name:
            return Response({"error": "Missing 'artist' parameter"}, status=400)

        try:
            client = Ollama_client()
            recommendations = client.generate_album_recommendations(
                artist_name, album_name
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)


class MediaItemListView(generics.ListAPIView):
    serializer_class = MediaItemSerializer

    def get_queryset(self):
        return MediaItem.objects.exclude(media_type="youtube")


class YTMediaItemListView(generics.ListAPIView):
    serializer_class = YTMediaItemSerializer

    def get_queryset(self):
        return MediaItem.objects.filter(media_type="youtube")
