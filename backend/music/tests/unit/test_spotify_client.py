from unittest.mock import patch

import pytest

from music.spotify_client import SpotifyClient


@pytest.mark.unit
@patch("music.spotify_client.spotipy.Spotify")
def test_get_album(mock_spotify_class):
    mock_spotify = mock_spotify_class.return_value
    mock_spotify.album.return_value = {
        "id": "album123",
        "name": "Test Album",
        "artists": [{"name": "Artist 1"}],
        "genres": ["Rock"],
        "release_date": "2023-01-01",
        "tracks": {"items": [{"name": "Song 1"}, {"name": "Song 2"}]},
        "images": [{"url": "http://example.com/art.jpg"}],
    }

    client = SpotifyClient()
    album_data = client.get_album("album123")

    assert album_data["id"] == "album123"
    assert album_data["name"] == "Test Album"
    assert album_data["artists"] == ["Artist 1"]
    assert album_data["genres"] == ["Rock"]
    assert album_data["tracks"] == ["Song 1", "Song 2"]
    assert album_data["album_art"] == "http://example.com/art.jpg"


@pytest.mark.unit
@patch("music.spotify_client.spotipy.Spotify")
def test_get_artist(mock_spotify_class):
    mock_spotify = mock_spotify_class.return_value
    mock_spotify.artist.return_value = {
        "id": "artist123",
        "name": "Test Artist",
        "genres": ["Rock", "Pop"],
        "followers": {"total": 1000},
        "popularity": 50,
        "images": [{"url": "http://example.com/art.jpg"}],
    }

    client = SpotifyClient()
    artist_data = client.get_artist("artist123")

    assert artist_data["id"] == "artist123"
    assert artist_data["name"] == "Test Artist"
    assert artist_data["genres"] == ["Rock", "Pop"]
    assert artist_data["followers"] == 1000
    assert artist_data["popularity"] == 50
