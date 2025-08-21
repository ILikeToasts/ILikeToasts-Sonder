from django.urls import path

from .views import (
    AlbumDetail,
    AlbumImportView,
    AlbumListView,
    AlbumMusicProfileView,
    ArtistDetail,
    ArtistListView,
    BottomArtistsView,
    FavoriteArtistsView,
    MediaItemCategoriesView,
    MediaItemListView,
    PlaylistImport,
    PlaylistView,
    RecommendAlbumsView,
    RecommendArtistsView,
    ReviewsByAlbumView,
    TopArtistsView,
    TopGenresView,
    TrackImportView,
    TracksListView,
    TracksMusicProfileView,
    YTMediaItemListView,
)

urlpatterns = [
    path("spotify/albums/", AlbumListView.as_view(), name="album-list"),
    path("spotify/albums/<str:album_id>/", AlbumDetail.as_view(), name="album-detail"),
    path(
        "spotify/albums/import",
        AlbumImportView.as_view(),
        name="album-import",
    ),
    path(
        "spotify/track/import",
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
    path(
        "user/profile/albums/",
        AlbumMusicProfileView.as_view(),
        name="Album-user-profile",
    ),
    path(
        "user/profile/tracks/",
        TracksMusicProfileView.as_view(),
        name="Album-user-profile",
    ),
    path(
        "media-items/categories/",
        MediaItemCategoriesView.as_view(),
        name="media-item-categories",
    ),
    path("media-items/", MediaItemListView.as_view(), name="media-items"),
    path("yt-media-items/", YTMediaItemListView.as_view(), name="media-item-list"),
    path("data/top-genres/", TopGenresView.as_view(), name="top-genres"),
    path(
        "data/favorite-artists/", FavoriteArtistsView.as_view(), name="favorite-artists"
    ),
    path("data/top-artists/", TopArtistsView.as_view(), name="top-artists"),
    path("data/bottom-artists/", BottomArtistsView.as_view(), name="bottom-artists"),
]
