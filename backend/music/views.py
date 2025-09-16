from django.db.models import Count, Q
from django.http import HttpResponse
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from music.clients.ollama_client import Ollama_client
from music.clients.spotify_client import SpotifyClient
from music.clients.steam_client import SteamClient
from music.clients.tmdb_client import TMDbClient
from music.utils.data_importer import (
    add_album_by_id,
    add_playlist_by_id,
    add_track_by_id,
)

from .models import (
    Album,
    Artist,
    GameGenre,
    Genre,
    MediaItem,
    Playlist,
    Review,
    Song,
    SteamGame,
    TMDbGenre,
    TMDbMovieMediaItem,
    TMDbTVMediaItem,
)
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
    SteamGameSerializer,
    SteamGamesImportSerializer,
    TMDbListImportSerializer,
    TMDbMovieMediaItemSerializer,
    TMDbTVMediaItemSerializer,
    TrackImportSerializer,
    YTMediaItemSerializer,
)


def index(request):
    return HttpResponse("Hi")


class ItemPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = "limit"
    max_page_size = 100


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
    pagination_class = ItemPagination
    serializer_class = AlbumDBSerializer

    def get_queryset(self):
        queryset = Album.objects.all()

        # Filter by selected category
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset


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
            ),
            openapi.Parameter(
                "bop",
                openapi.IN_QUERY,
                description="Considered a bop",
                type=openapi.TYPE_BOOLEAN,
                default=True,
                required=True,
            ),
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
        bop = serializer.validated_data.get("bop", False)

        try:
            client = SpotifyClient()
            sp = client.sp
            add_track_by_id(sp, track_id, bop)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(
            {"message": f"Track '{track_id}' imported successfully"},
            status=status.HTTP_201_CREATED,
        )


class TracksListView(generics.ListAPIView):
    pagination_class = ItemPagination
    serializer_class = SongDBSerializer

    def get_queryset(self):
        queryset = Song.objects.filter(Q(bop=True) | Q(album__isnull=True))
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset


class ArtistListView(generics.ListAPIView):
    pagination_class = ItemPagination
    serializer_class = ArtistDBSerializer

    def get_queryset(self):
        queryset = Artist.objects.filter(albums__isnull=False).distinct()

        # Filter by selected category
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset


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


class AlbumMusicProfileView(APIView):
    def get(self, request):

        try:
            client = Ollama_client()
            albums = Album.objects.all()
            musicProfile = client.generate_user_album_profile(albums)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"MusicProfile": musicProfile}, status=status.HTTP_200_OK)


class TracksMusicProfileView(APIView):
    def get(self, request):

        try:
            client = Ollama_client()
            tracks = Song.objects.filter(bop=True)
            musicProfile = client.generate_user_music_profile(tracks)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"MusicProfile": musicProfile}, status=status.HTTP_200_OK)


class MediaItemPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "limit"
    max_page_size = 100


class MediaItemListView(generics.ListAPIView):
    serializer_class = MediaItemSerializer
    pagination_class = MediaItemPagination

    def get_queryset(self):
        qs = MediaItem.objects.exclude(media_type="youtube")

        # Filter by selected category
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class YTMediaItemsCategoriesView(APIView):
    def get(self, request):
        categories = (
            MediaItem.objects.filter(media_type="youtube")
            .values_list("category", flat=True)
            .distinct()
        )
        return Response(list(categories))


class YTMediaItemListView(generics.ListAPIView):
    serializer_class = YTMediaItemSerializer
    pagination_class = MediaItemPagination

    def get_queryset(self):
        qs = MediaItem.objects.filter(media_type="youtube")

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class AlbumGenresView(APIView):
    def get(self, request):
        genres = (
            Genre.objects.filter(albums__isnull=False)
            .values_list("name", flat=True)
            .distinct()
        )
        return Response(list(genres))


class ArtistsGenresView(APIView):
    def get(self, request):
        genres = (
            Genre.objects.filter(artists__isnull=False)
            .values_list("name", flat=True)
            .distinct()
        )
        return Response(list(genres))


class SinglesGenresView(APIView):
    def get(self, request):
        singles_qs = Song.objects.filter(Q(bop=True) | Q(album__isnull=True))

        # Get all genres linked to these singles
        genres_qs = Genre.objects.filter(songs__in=singles_qs).distinct()

        # Return genre names
        genres = list(genres_qs.values_list("name", flat=True))
        return Response(genres)


class MovieGenresView(APIView):
    def get(self, request):
        genre_qs = TMDbGenre.objects.filter(
            movie_items__tmdb_list__category="Movie"
        ).distinct()

        genres = list(genre_qs.values_list("name", flat=True))
        return Response(genres)


class TVSerieGenresView(APIView):
    def get(self, request):
        genre_qs = TMDbGenre.objects.filter(
            tv_items__tmdb_list__category="tv"
        ).distinct()

        genres = list(genre_qs.values_list("name", flat=True))
        return Response(genres)


class AnimeGenresView(APIView):
    def get(self, request):
        genre_qs = TMDbGenre.objects.filter(
            tv_items__tmdb_list__category="Anime"
        ).distinct()

        genres = list(genre_qs.values_list("name", flat=True))
        return Response(genres)


class MediaItemCategoriesView(APIView):
    def get(self, request):
        categories = (
            MediaItem.objects.exclude(media_type="youtube")
            .values_list("category", flat=True)
            .distinct()
        )
        return Response(list(categories))


class TopGenresView(APIView):
    def get(self, request):
        genres = (
            Genre.objects.filter(songs__bop=True)
            .annotate(count=Count("songs", distinct=True))
            .order_by("-count")[:10]
        )

        data = [{"name": genre.name, "value": genre.count} for genre in genres]
        return Response(data)


class FavoriteArtistsView(APIView):
    def get(self, request):
        artists = (
            Artist.objects.filter(songs__bop=True)
            .annotate(count=Count("songs", distinct=True))
            .order_by("-count")[:10]
        )

        data = [{"name": artist.name, "value": artist.count} for artist in artists]
        return Response(data)


class BottomArtistsView(APIView):
    def get(self, request):
        bottom_artists = Artist.objects.order_by("popularity")[:10]

        def serialize(artist):
            return {
                "name": artist.name,
                "followers": artist.followers,
            }

        data = [serialize(artist) for artist in bottom_artists]

        return Response(data)


class TopArtistsView(APIView):
    def get(self, request):
        top_artists = Artist.objects.order_by("-popularity")[:10]

        def serialize(artist):
            return {
                "name": artist.name,
                "followers": artist.followers,
            }

        data = [serialize(artist) for artist in top_artists]

        return Response(data)


class TMDbImportListView(APIView):
    CATEGORY_CHOICES = ["Movie", "TVShow", "Anime"]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "list_id",
                openapi.IN_QUERY,
                description="TMDB list ID",
                type=openapi.TYPE_STRING,
                required=True,
            ),
            openapi.Parameter(
                "category",
                openapi.IN_QUERY,
                description="Category: Movie, TVShow, or Anime",
                type=openapi.TYPE_STRING,
                required=True,
                enum=CATEGORY_CHOICES,
            ),
        ],
        responses={
            201: "List imported successfully",
            400: "Invalid list_id",
            500: "Internal server error",
        },
    )
    def post(self, request):
        serializer = TMDbListImportSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        list_id = serializer.validated_data["list_id"]
        category = serializer.validated_data["category"]

        try:
            client = TMDbClient()
            client.fetch_list(list_id, category)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": f"List '{list_id}' imported successfully!"},
            status=status.HTTP_201_CREATED,
        )


class AnimeListView(generics.ListAPIView):
    serializer_class = TMDbTVMediaItemSerializer
    pagination_class = ItemPagination

    def get_queryset(self):
        queryset = TMDbTVMediaItem.objects.filter(tmdb_list__category="Anime")

        # Filter by selected category
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset


class TVShowListView(generics.ListAPIView):
    serializer_class = TMDbTVMediaItemSerializer
    pagination_class = ItemPagination

    def get_queryset(self):
        queryset = TMDbTVMediaItem.objects.filter(tmdb_list__category="tv")

        # Filter by selected category
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset


class MovieListView(generics.ListAPIView):
    serializer_class = TMDbMovieMediaItemSerializer
    pagination_class = ItemPagination

    def get_queryset(self):
        queryset = TMDbMovieMediaItem.objects.filter(tmdb_list__category="Movie")

        # Filter by selected category
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset


class SteamGameImportListView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "steam_id",
                openapi.IN_QUERY,
                description="User steam ID",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            201: "Games imported successfully",
            400: "Invalid steam user id",
            500: "Internal server error",
        },
    )
    def post(self, request):
        serializer = SteamGamesImportSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        steam_id = serializer.validated_data["steam_id"]

        try:
            client = SteamClient()
            client.fetch_steam_user_games(steam_id)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": f"Games from user '{steam_id}' imported successfully!"},
            status=status.HTTP_201_CREATED,
        )


class SteamListView(generics.ListAPIView):
    serializer_class = SteamGameSerializer
    pagination_class = ItemPagination

    def get_queryset(self):
        queryset = SteamGame.objects.all()

        # Filter by selected category
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset


class SteamGamesGenresView(APIView):
    def get(self, request):
        genre_qs = GameGenre.objects.all().distinct()

        genres = list(genre_qs.values_list("name", flat=True))
        return Response(genres)
