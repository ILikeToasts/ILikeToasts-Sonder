from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.integration
@patch("music.views.SpotifyClient")
def test_album_detail_view_success(mock_spotify_client_class):
    mock_instance = mock_spotify_client_class.return_value
    mock_instance.get_album.return_value = {
        "id": "album123",
        "name": "Test Album",
        "artists": ["Artist 1"],
        "genres": ["Rock"],
        "release_date": "2023-01-01",
        "tracks": ["Song 1", "Song 2"],
        "album_art": "http://example.com/art.jpg",
    }

    client = APIClient()
    url = reverse("album-detail", kwargs={"album_id": "album123"})
    response = client.get(url)

    assert response.status_code == 200
    assert response.data["id"] == "album123"


@pytest.mark.integration
@pytest.mark.django_db
class TestAlbumImportView:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @patch("music.views.SpotifyClient")
    @patch("music.views.add_album_by_id")
    def test_album_import_success(
        self, mock_add_album, mock_spotify_client, api_client
    ):
        mock_spotify_client.return_value.sp = "fake_sp_object"
        mock_add_album.return_value = None

        url = reverse("album-import") + "?album_id=album123"
        response = api_client.post(url)

        assert response.status_code == status.HTTP_201_CREATED
        assert "message" in response.data

    def test_album_import_missing_album_id(self, api_client):
        url = reverse("album-import")
        response = api_client.post(url)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "album_id" in response.data
        assert response.data["album_id"][0] == "This field is required."


@pytest.mark.integration
@pytest.mark.django_db
class TestTrackImportView:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @patch("music.views.SpotifyClient")
    @patch("music.views.add_track_by_id")
    def test_track_import_success(
        self, mock_add_track, mock_spotify_client, api_client
    ):
        mock_spotify_client.return_value.sp = "fake_sp_object"
        mock_add_track.return_value = None

        url = reverse("track-import") + "?track_id=track123"
        response = api_client.post(url)

        assert response.status_code == status.HTTP_201_CREATED
        assert "message" in response.data

    def test_track_import_missing_track_id(self, api_client):
        url = reverse("track-import")
        response = api_client.post(url)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "track_id" in response.data
        assert response.data["track_id"][0] == "This field is required."
