from django.urls import path

from .views import (
    AlbumDetail,
    AlbumImportView,
    AlbumListView,
    ArtistDetail,
    ArtistListView,
    PlaylistImport,
    PlaylistView,
    RecommendAlbumsView,
    RecommendArtistsView,
    ReviewsByAlbumView,
    TrackImportView,
    TracksListView,
)

urlpatterns = [
    path("spotify/albums/", AlbumListView.as_view(), name="album-list"),
    path("spotify/albums/<str:album_id>/", AlbumDetail.as_view(), name="album-detail"),
    path(
        "spotify/albums/import/<str:album_id>/",
        AlbumImportView.as_view(),
        name="album-import",
    ),
    path(
        "spotify/track/<str:track_id>",
        TrackImportView.as_view(),
        name="track-import",
    ),
    path("spotify/tracks/", TracksListView.as_view(), name="tracks-list"),
    path("spotify/artists/", ArtistListView.as_view(), name="artist-list"),
    path(
        "spotify/artists/<str:artist_id>/", ArtistDetail.as_view(), name="artist-detail"
    ),
    path("spotify/playlists/", PlaylistView.as_view(), name="playlist-list"),
    path(
        "spotify/playlists/import/<str:playlist_id>/",
        PlaylistImport.as_view(),
        name="playlist-import",
    ),
    path(
        "spotify/reviews/album/<int:album_id>/",
        ReviewsByAlbumView.as_view(),
        name="reviews-by-album",
    ),
    path(
        "recommend/<str:artist_name>",
        RecommendArtistsView.as_view(),
        name="recommend_artist",
    ),
    path(
        "recommend/<str:album_name>/<str:artist_name>",
        RecommendAlbumsView.as_view(),
        name="recommend_album",
    ),
]
