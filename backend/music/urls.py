from django.urls import path
from .views import AlbumDetail

urlpatterns = [
    path('spotify/albums/<str:album_id>/', AlbumDetail.as_view(), name='album-detail'),
]