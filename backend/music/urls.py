from django.urls import path

from .views import AlbumDetail, AlbumImportView, AlbumListView, ArtistDetail

urlpatterns = [
    path('spotify/albums/<str:album_id>/', AlbumDetail.as_view(), name='album-detail'),
    path('spotify/artists/<str:artist_id>/', ArtistDetail.as_view(), name='artist-detail'),
    path('spotify/albums/', AlbumListView.as_view(), name='album-list'),
    path('spotify/albums/import/<str:album_id>/', AlbumImportView.as_view(), name='album-import'),
]