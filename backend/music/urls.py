from django.urls import path
from .views import AlbumDetail, ArtistDetail

urlpatterns = [
    path('spotify/albums/<str:album_id>/', AlbumDetail.as_view(), name='album-detail'),
    path('spotify/artists/<str:artist_id>/', ArtistDetail.as_view(), name='artist-detail'),
]