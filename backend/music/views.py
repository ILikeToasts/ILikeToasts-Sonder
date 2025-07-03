from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .spotify_client import SpotifyClient
from .serializers import AlbumSerializer, ArtistSerializer

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