# app/tmdb_client.py
import requests
from django.conf import settings
from models import MediaItem, TMDbList


class TMDbClient:
    BASE_URL = "https://api.themoviedb.org/3"

    def __init__(self):
        self.api_key = settings.TMDB_API_KEY

    def fetch_list_items(self, list_id: int):
        url = f"{self.BASE_URL}/list/{list_id}"
        resp = requests.get(url, params={"api_key": self.api_key})
        resp.raise_for_status()
        return resp.json().get("items", [])

    def sync_list(self, tmdb_list: TMDbList):
        items = self.fetch_list_items(tmdb_list.tmdb_id)
        for item in items:
            tmdb_id = item["id"]
            title = item.get("title") or item.get("name")
            overview = item.get("overview", "")
            poster_path = item.get("poster_path")
            media_type = item.get("media_type") or tmdb_list.category

            MediaItem.objects.update_or_create(
                tmdb_id=tmdb_id,
                list=tmdb_list,
                defaults={
                    "title": title,
                    "overview": overview,
                    "poster_path": poster_path,
                    "media_type": media_type,
                    "release_date": item.get("release_date")
                    or item.get("first_air_date"),
                },
            )
