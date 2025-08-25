# app/tmdb_client.py
from datetime import datetime

import requests
from django.conf import settings

from music.models import ProductionCompany, TMDbGenre, TMDbList, TMDbTVMediaItem


class TMDbClient:
    BASE_URL = "https://api.themoviedb.org/3"

    def __init__(self):
        self.api_key = settings.TMDB_API_KEY

    def fetch_list_items(self, list_id):
        """
        Fetch items from a TMDb list
        """
        url = f"{self.BASE_URL}/list/{list_id}"
        resp = requests.get(url, params={"api_key": self.api_key})
        resp.raise_for_status()
        return resp.json().get("items", [])

    def fetch_tv_details(self, tv_id):
        """
        Fetch detailed TV info including genres and production companies
        """
        url = f"{self.BASE_URL}/tv/{tv_id}"
        params = {"api_key": self.api_key}
        resp = requests.get(url, params=params)
        resp.raise_for_status()
        return resp.json()

    def sync_tv_item(self, tmdb_list, tv_data):
        """
        Create or update a TMDbTVMediaItem from TV show data
        """
        # Genres
        genre_objs = []
        for genre in tv_data.get("genres", []):
            genre_obj, _ = TMDbGenre.objects.get_or_create(name=genre["name"])
            genre_objs.append(genre_obj)

        # Production companies
        company_objs = []
        for company in tv_data.get("production_companies", []):
            company_obj, _ = ProductionCompany.objects.get_or_create(
                name=company["name"]
            )
            company_objs.append(company_obj)

        # Episode runtime: take first value if exists
        episode_run_time = tv_data.get("episode_run_time", [])
        episode_run_time_val = episode_run_time[0] if episode_run_time else None

        # Origin country: store as comma-separated string
        origin_country = ",".join(tv_data.get("origin_country", []))

        # Convert first_air_date string to date
        first_air_date_str = tv_data.get("first_air_date")
        first_air_date = (
            datetime.strptime(first_air_date_str, "%Y-%m-%d").date()
            if first_air_date_str
            else None
        )

        tv_item, created = TMDbTVMediaItem.objects.update_or_create(
            tmdb_id=tv_data["id"],
            tmdb_list=tmdb_list,
            defaults={
                "title": tv_data.get("name"),
                "original_name": tv_data.get("original_name", ""),
                "episode_run_time": episode_run_time_val,
                "first_air_date": first_air_date,
                "in_production": tv_data.get("in_production", False),
                "origin_country": origin_country,
                "original_language": tv_data.get("original_language", ""),
                "overview": tv_data.get("overview", ""),
                "poster_path": tv_data.get("poster_path"),
                "seasons": len(tv_data.get("seasons", [])),
                "vote_average": tv_data.get("vote_average", 0),
                "vote_count": tv_data.get("vote_count", 0),
            },
        )

        # Set relations
        tv_item.genres.set(genre_objs)
        tv_item.production_companies.set(company_objs)

        return tv_item

    def fetch_list(self, list_id: str, category: str):
        """
        Fetch a TMDb list and create/update items
        """

        # Get or create TMDbList
        tmdb_list, _ = TMDbList.objects.get_or_create(
            tmdb_id=list_id, defaults={"name": f"List {list_id}", "category": category}
        )

        items = self.fetch_list_items(list_id)

        for item in items:
            if category == "Anime" or category == "TVShow":
                # Fetch full details
                tv_data = self.fetch_tv_details(item["id"])
                self.sync_tv_item(tmdb_list, tv_data)
            else:
                # TODO: implement movies
                pass
