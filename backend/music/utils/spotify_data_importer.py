# utils/spotify_importer.py

from spotipy import Spotify
from ..models import Artist, Album, Playlist, Song, Genre

def add_album_by_id(sp: Spotify, album_id: str):
    """
    Adds an album and its related artists and songs to your database.
    :param sp: spotipy.Spotify client instance.
    :param album_id: Spotify album ID.
    """
    # Get album details
    album_data = sp.album(album_id)

    if album_data:
        artist_instances = []

        for artist_info in album_data['artists']:
            artist_data = sp.artist(artist_info['id'])

            # Get or create the artist instance
            artist, _ = Artist.objects.update_or_create(
                spotify_id=artist_info['id'],
                defaults={
                    'name': artist_info['name'],
                    'image_url': artist_data['images'][0]['url'] if artist_data['images'] else '',
                    'popularity': artist_data.get('popularity', 0),
                    'followers': artist_data.get('followers', {}).get('total', 0),
                }
            )

            # Handle genres M2M properly
            genres = [Genre.objects.get_or_create(name=genre)[0] for genre in artist_data.get('genres', [])]
            artist.genres.set(genres)

            artist_instances.append(artist)

        # Create or update the album
        album, _ = Album.objects.update_or_create(
            spotify_id=album_data['id'],
            defaults={
                'title': album_data['name'],
                'cover_url': album_data['images'][0]['url'] if album_data['images'] else '',
                'artist': artist_instances[0],
            }
        )

        # Use the first artist’s genres for the album
        album.genres.set(artist_instances[0].genres.all())
        album.save()

        # Get tracks for this album
        add_album_tracks(sp, album)

        print(f"Imported album '{album.title}'")

def add_album_tracks(sp: Spotify, album: Album):
    """
    Adds tracks to an album.
    :param sp: spotipy.Spotify client instance.
    :param album: Album instance to which tracks will be added.
    """
    tracks = sp.album_tracks(album.spotify_id)
    for track in tracks['items']:
        Song.objects.update_or_create(
            spotify_id=track['id'],
            defaults={
                'title': track['name'],
                'album': album,
                'duration_seconds': track['duration_ms'] // 1000,
                'cover_url': album.cover_url,
            }
        )
    print(f"Added {len(tracks['items'])} tracks to album '{album.title}'.")

def add_playlist_by_id(sp: Spotify, playlist_id: str):
    playlist_data = sp.playlist(playlist_id)

    playlist, _ = Playlist.objects.update_or_create(
        spotify_id=playlist_data['id'],
        defaults={
            'title': playlist_data['name'],
            'description': playlist_data.get('description', ''),
            'cover_url': playlist_data['images'][0]['url'] if playlist_data['images'] else '',
        }
    )

    song_instances = []

    offset = 0
    limit = 100  # Spotify API limit for amount of tracks

    while True:
        tracks_response = sp.playlist_items(playlist_id, offset=offset, limit=limit)
        items = tracks_response['items']

        for item in items:
            track = item['track']
            if not track:
                continue

            duration = int(track['duration_ms'] / 1000)
            cover_url = track['album']['images'][0]['url'] if track['album']['images'] else ''

            song, _ = Song.objects.update_or_create(
                spotify_id=track['id'],
                defaults={
                    'title': track['name'],
                    'duration_seconds': duration,
                    'cover_url': cover_url,
                    'album': None
                }
            )

            # Handle artists
            artist_instances = []
            for artist_info in track['artists']:
                artist_data = sp.artist(artist_info['id'])
                artist, _ = Artist.objects.update_or_create(
                    spotify_id=artist_info['id'],
                    defaults={
                        'name': artist_info['name'],
                        'image_url': artist_data['images'][0]['url'] if artist_data['images'] else '',
                        'popularity': artist_data.get('popularity', 0),
                        'followers': artist_data.get('followers', {}).get('total', 0),
                    }
                )
                genres = [Genre.objects.get_or_create(name=g)[0] for g in artist_data.get('genres', [])]
                artist.genres.set(genres)
                artist_instances.append(artist)

            song.artists.set(artist_instances)
            song_instances.append(song)

        # Check if there's another page
        if tracks_response['next']:
            offset += limit
        else:
            break

    playlist.songs.set(song_instances)

    return playlist
