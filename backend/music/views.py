from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics

from .models import Album, Artist
from music.utils.spotify_data_importer import add_album_by_id
from .spotify_client import SpotifyClient
from .serializers import AlbumSerializer, ArtistDBSerializer, ArtistSerializer, AlbumDBSerializer

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

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

    def post(self, request, album_id):
        if not album_id:
            return Response({"error": "album_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = SpotifyClient()
            sp = client.sp
            add_album_by_id(sp, album_id)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": f"Album '{album_id}' imported successfully!"}, status=status.HTTP_201_CREATED)
    
class ArtistListView(generics.ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistDBSerializer