# utils/spotify_importer.py

from spotipy import Spotify

from ..models import Album, Artist, Genre, Playlist, Song
from .retrievers import LastFMRetriever


def add_album_by_id(sp: Spotify, album_id: str):
    """
    Adds an album and its related artists and songs to your database.
    :param sp: spotipy.Spotify client instance.
    :param album_id: Spotify album ID.
    """
    # Get album details
    album_data = sp.album(album_id)
    lastfm_retriever = LastFMRetriever()
    if album_data:
        artist_instances = []

        for artist_info in album_data["artists"]:
            artist_data = sp.artist(artist_info["id"])
            lastfm_artist_data = lastfm_retriever.get_artist_info(artist_info["name"])

            # Get or create the artist instance
            artist, _ = Artist.objects.update_or_create(
                spotify_id=artist_info["id"],
                defaults={
                    "name": artist_info["name"],
                    "image_url": (
                        artist_data["images"][0]["url"] if artist_data["images"] else ""
                    ),
                    "popularity": artist_data.get("popularity", 0),
                    "followers": artist_data.get("followers", {}).get("total", 0),
                    "wiki_summary": lastfm_artist_data.metadata[
                        "bio"
                    ],  # Comes from lastfm api
                },
            )

            # set the genres with lastfm tags
            lastfm_tags = lastfm_artist_data.metadata["tags"]
            genre_objs = [
                Genre.objects.get_or_create(name=tag)[0] for tag in lastfm_tags
            ]
            artist.genres.set(genre_objs)

            artist_instances.append(artist)

        # Set the artist to the first artist
        current_artist = artist_instances[0]

        # Create or update the album
        album, _ = Album.objects.update_or_create(
            spotify_id=album_data["id"],
            defaults={
                "title": album_data["name"],
                "cover_url": (
                    album_data["images"][0]["url"] if album_data["images"] else ""
                ),
                "artist": current_artist,
            },
        )

        # Get the album's summary from lastfm
        lastfm_album_data = lastfm_retriever.get_album_info(
            current_artist.name, album.title
        )
        album.wiki_summary = lastfm_album_data.metadata["Description"]
        album.save()

        # Get tracks for this album
        add_album_tracks(sp, lastfm_retriever, album, current_artist.name)

        print(f"Imported album '{album.title}'")


def add_album_tracks(
    sp: Spotify, lastfm_retriever: LastFMRetriever, album: Album, artist_name: str
):
    """
    Adds tracks to an album.
    :param sp: spotipy.Spotify client instance.
    :param album: Album instance to which tracks will be added.
    """
    tracks = sp.album_tracks(album.spotify_id)

    for track in tracks["items"]:
        db_track, _ = Song.objects.update_or_create(
            spotify_id=track["id"],
            defaults={
                "title": track["name"],
                "album": album,
                "duration_seconds": track["duration_ms"] // 1000,
                "cover_url": album.cover_url,
            },
        )
        lastfm_track_data = lastfm_retriever.get_track_info(artist_name, db_track.title)
        db_track.wiki_summary = lastfm_track_data.metadata["bio"]
        db_track.save()

    print(f"Added {len(tracks['items'])} tracks to album '{album.title}'.")


def add_playlist_by_id(sp: Spotify, playlist_id: str):
    playlist_data = sp.playlist(playlist_id)

    playlist, _ = Playlist.objects.update_or_create(
        spotify_id=playlist_data["id"],
        defaults={
            "title": playlist_data["name"],
            "description": playlist_data.get("description", ""),
            "cover_url": (
                playlist_data["images"][0]["url"] if playlist_data["images"] else ""
            ),
        },
    )

    song_instances = []

    offset = 0
    limit = 100  # Spotify API limit for amount of tracks

    while True:
        tracks_response = sp.playlist_items(playlist_id, offset=offset, limit=limit)
        items = tracks_response["items"]

        for item in items:
            track = item["track"]
            if not track:
                continue

            duration = int(track["duration_ms"] / 1000)
            cover_url = (
                track["album"]["images"][0]["url"] if track["album"]["images"] else ""
            )

            song, _ = Song.objects.update_or_create(
                spotify_id=track["id"],
                defaults={
                    "title": track["name"],
                    "duration_seconds": duration,
                    "cover_url": cover_url,
                    "album": None,
                },
            )

            # Handle artists
            artist_instances = []
            for artist_info in track["artists"]:
                artist_data = sp.artist(artist_info["id"])
                artist, _ = Artist.objects.update_or_create(
                    spotify_id=artist_info["id"],
                    defaults={
                        "name": artist_info["name"],
                        "image_url": (
                            artist_data["images"][0]["url"]
                            if artist_data["images"]
                            else ""
                        ),
                        "popularity": artist_data.get("popularity", 0),
                        "followers": artist_data.get("followers", {}).get("total", 0),
                    },
                )
                genres = [
                    Genre.objects.get_or_create(name=g)[0]
                    for g in artist_data.get("genres", [])
                ]
                artist.genres.set(genres)
                artist_instances.append(artist)

            song.artists.set(artist_instances)
            song_instances.append(song)

        # Check if there's another page
        if tracks_response["next"]:
            offset += limit
        else:
            break

    playlist.songs.set(song_instances)

    return playlist
