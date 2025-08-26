import os

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


class SpotifyClient:
    def __init__(self):
        self.client_id = os.getenv("SPOTIFY_CLIENT_ID")
        self.client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        self.auth_manager = SpotifyClientCredentials(
            client_id=self.client_id, client_secret=self.client_secret
        )
        self.sp = spotipy.Spotify(auth_manager=self.auth_manager)

    def get_album(self, album_id):
        album = self.sp.album(album_id)
        return {
            "id": album["id"],
            "name": album["name"],
            "artists": [artist["name"] for artist in album["artists"]],
            "genres": album.get("genres", []),
            "release_date": album["release_date"],
            "tracks": [track["name"] for track in album["tracks"]["items"]],
            "album_art": album["images"][0]["url"] if album["images"] else None,
        }

    def get_artist(self, artist_id):
        artist = self.sp.artist(artist_id)
        return {
            "id": artist["id"],
            "name": artist["name"],
            "genres": artist.get("genres", []),
            "followers": artist["followers"]["total"],
            "popularity": artist["popularity"],
            "images": [image["url"] for image in artist.get("images", [])],
        }
