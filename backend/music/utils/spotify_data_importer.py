# utils/spotify_importer.py

from spotipy import Spotify
from ..models import Artist, Album, Song, Genre

def add_album_by_id(sp: Spotify, album_id: str):
    """
    Adds an album and its related artists and songs to your database.
    :param sp: spotipy.Spotify client instance.
    :param album_id: Spotify album ID.
    """
    # Get album details
    album_data = sp.album(album_id)

    if album_data :
        # Get or create all artists for this album
        artist_instances = []
        for artist_data in album_data['artists']:
            artist, _ = Artist.objects.update_or_create(
                spotify_id=artist_data['id'],
                defaults={
                    'name': artist_data['name'],
                    'image_url': '',  # You may want to get artist images separately
                }
            )
            artist_instances.append(artist)

        # Create or update album
        album, _ = Album.objects.update_or_create(
            spotify_id=album_data['id'],
            defaults={
                'title': album_data['name'],
                'cover_url': album_data['images'][0]['url'] if album_data['images'] else '',
                'artist': artist_instances[0],  # Use the first artist as primary
            }
        )
        
        # Add genres from main artist
        add_album_genres_from_artist(sp, album, artist_instances)

        # Get tracks for this album
        add_album_tracks(sp, album)

        print(f"Imported album '{album.title}'")


def add_album_genres_from_artist(sp: Spotify, album: Album, artist_instances: list[Artist]):
    """
    Adds genres to an album from the first artist mentionned.
    :param sp: spotipy.Spotify client instance.
    :param album: Album instance to which tracks will be added.
    :param artist_instances: List of Artist instances related to the album.
    """
    artist_data = sp.artist(artist_instances[0].spotify_id)
    for genre_name in artist_data.get('genres', []):
        genre, _ = Genre.objects.get_or_create(name=genre_name)
        album.genres.add(genre)
        artist_instances[0].genres.add(genre)
    album.save()
    artist_instances[0].save()

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