from django.urls import path

from .views import (
    AlbumDetail,
    AlbumGenresView,
    AlbumImportView,
    AlbumListView,
    AlbumMusicProfileView,
    AnimeGenresView,
    AnimeListView,
    ArtistDetail,
    ArtistListView,
    ArtistsGenresView,
    BottomArtistsView,
    FavoriteArtistsView,
    MediaItemCategoriesView,
    MediaItemListView,
    MovieGenresView,
    MovieListView,
    PlaylistImport,
    PlaylistView,
    RecommendAlbumsView,
    RecommendArtistsView,
    ReviewsByAlbumView,
    SinglesGenresView,
    SteamGameImportListView,
    SteamGamesGenresView,
    SteamListView,
    TMDbImportListView,
    TopArtistsView,
    TopGenresView,
    TrackImportView,
    TracksListView,
    TracksMusicProfileView,
    TVSerieGenresView,
    TVShowListView,
    YTMediaItemListView,
    YTMediaItemsCategoriesView,
)

urlpatterns = [
    # Spotify Albums
    path("spotify/albums/list/", AlbumListView.as_view(), name="album-list"),
    path("spotify/albums/<str:album_id>/", AlbumDetail.as_view(), name="album-detail"),
    path(
        "spotify/albums/import",
        AlbumImportView.as_view(),
        name="album-import",
    ),
    path("albums/list-genres/", AlbumGenresView.as_view(), name="album-genres"),
    # Spotify Singles
    path(
        "spotify/track/import",
        TrackImportView.as_view(),
        name="track-import",
    ),
    path("spotify/singles/list/", TracksListView.as_view(), name="singles-list"),
    path("singles/list-genres/", SinglesGenresView.as_view(), name="singles-genres"),
    # Spotify Artists
    path("spotify/artists/list/", ArtistListView.as_view(), name="artist-list"),
    path(
        "spotify/artists/<str:artist_id>/", ArtistDetail.as_view(), name="artist-detail"
    ),
    path("artists/list-genres/", ArtistsGenresView.as_view(), name="artists-genres"),
    # Spotify Playlists
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
    # Recommendations
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
    # Media Items (Picutures, videos, youtube)
    path("media-items/", MediaItemListView.as_view(), name="media-items"),
    path("yt-media-items/", YTMediaItemListView.as_view(), name="media-item-list"),
    path(
        "media-items/categories/",
        MediaItemCategoriesView.as_view(),
        name="yt-media-item-categories",
    ),
    path(
        "yt-media-items/categories/",
        YTMediaItemsCategoriesView.as_view(),
        name="media-item-categories",
    ),
    # Statistics / Data
    path("data/top-genres/", TopGenresView.as_view(), name="top-genres"),
    path(
        "data/favorite-artists/", FavoriteArtistsView.as_view(), name="favorite-artists"
    ),
    path("data/top-artists/", TopArtistsView.as_view(), name="top-artists"),
    path("data/bottom-artists/", BottomArtistsView.as_view(), name="bottom-artists"),
    # TMDB
    path("tmdb/list/import/", TMDbImportListView.as_view(), name="tmdb-list-import"),
    path("tmdb/list/animes/", AnimeListView.as_view(), name="anime-list"),
    path("tmdb/list/series/", TVShowListView.as_view(), name="series-list"),
    path("tmdb/list/movies/", MovieListView.as_view(), name="movie-list"),
    # TMDB Genres
    path(
        "tmdb/list/movies-genres/", MovieGenresView.as_view(), name="movie-list-genres"
    ),
    path(
        "tmdb/list/animes-genres/", AnimeGenresView.as_view(), name="animes-list-genres"
    ),
    path(
        "tmdb/list/series-genres/",
        TVSerieGenresView.as_view(),
        name="series-list-genres",
    ),
    # Steam
    path("steam/games/import/", SteamGameImportListView.as_view(), name="steam-games"),
    path("steam/games/list/", SteamListView.as_view(), name="games"),
    path(
        "steam/games/list-genres/", SteamGamesGenresView.as_view(), name="games-genres"
    ),
]
