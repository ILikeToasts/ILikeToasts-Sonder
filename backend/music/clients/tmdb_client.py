# app/tmdb_client.py
from datetime import datetime

import requests
from django.conf import settings

from music.models import (
    ProductionCompany,
    TMDbGenre,
    TMDbList,
    TMDbMovieMediaItem,
    TMDbTVMediaItem,
)


class TMDbClient:
    BASE_URL = "https://api.themoviedb.org/3"

    def __init__(self):
        self.api_key = settings.TMDB_API_KEY

    def _get_or_create_genres(genre_list):
        genre_objs = []
        for genre in genre_list:
            genre_obj, _ = TMDbGenre.objects.get_or_create(name=genre["name"])
            genre_objs.append(genre_obj)
        return genre_objs

    def _get_or_create_companies(company_list):
        company_objs = []
        for company in company_list:
            company_obj, _ = ProductionCompany.objects.get_or_create(
                name=company["name"]
            )
            company_objs.append(company_obj)
        return company_objs

    def fetch_list_items(self, list_id):
        """
        Fetch items from a TMDb list
        """
        url = f"{self.BASE_URL}/list/{list_id}"
        resp = requests.get(url, params={"api_key": self.api_key})
        resp.raise_for_status()
        return resp.json().get("items", [])

    def fetch_media_details(self, media_id, media_type):
        """
        Fetch detailed TV info including genres and production companies
        """
        if media_type == "tv":
            url = f"{self.BASE_URL}/tv/{media_id}"
        else:
            url = f"{self.BASE_URL}/movie/{media_id}"

        params = {"api_key": self.api_key}
        resp = requests.get(url, params=params)
        resp.raise_for_status()
        return resp.json()

    def sync_media_item(self, tmdb_list, media_data, media_type: str):
        """
        Generic create/update function for TV or Movie items.
        media_type: 'tv' or 'movie'
        """
        # Common fields
        genre_objs = self._get_or_create_genres(media_data.get("genres", []))
        company_objs = self._get_or_create_companies(
            media_data.get("production_companies", [])
        )
        origin_country = ",".join(
            media_data.get("origin_country", [])
            or media_data.get("production_countries", [])
        )
        overview = media_data.get("overview", "")
        poster_path = media_data.get("poster_path")
        original_language = media_data.get("original_language", "")
        vote_average = media_data.get("vote_average", 0)
        vote_count = media_data.get("vote_count", 0)

        if media_type == "tv":
            first_air_date_str = media_data.get("first_air_date")
            first_air_date = (
                datetime.strptime(first_air_date_str, "%Y-%m-%d").date()
                if first_air_date_str
                else None
            )
            episode_run_time_val = media_data.get("episode_run_time", [])
            episode_run_time_val = (
                episode_run_time_val[0] if episode_run_time_val else None
            )

            item, created = TMDbTVMediaItem.objects.update_or_create(
                tmdb_id=media_data["id"],
                tmdb_list=tmdb_list,
                defaults={
                    "title": media_data.get("name"),
                    "original_name": media_data.get("original_name", ""),
                    "episode_run_time": episode_run_time_val,
                    "first_air_date": first_air_date,
                    "in_production": media_data.get("in_production", False),
                    "origin_country": origin_country,
                    "original_language": original_language,
                    "overview": overview,
                    "poster_path": poster_path,
                    "seasons": len(media_data.get("seasons", [])),
                    "vote_average": vote_average,
                    "vote_count": vote_count,
                },
            )

        else:
            release_date_str = media_data.get("release_date")
            release_date = (
                datetime.strptime(release_date_str, "%Y-%m-%d").date()
                if release_date_str
                else None
            )

            item, created = TMDbMovieMediaItem.objects.update_or_create(
                tmdb_id=media_data["id"],
                tmdb_list=tmdb_list,
                defaults={
                    "title": media_data.get("title"),
                    "original_name": media_data.get("original_title", ""),
                    "runtime": media_data.get("runtime"),
                    "release_date": release_date,
                    "origin_country": origin_country,
                    "original_language": original_language,
                    "overview": overview,
                    "poster_path": poster_path,
                    "vote_average": vote_average,
                    "vote_count": vote_count,
                },
            )

        # Set relations
        item.genres.set(genre_objs)
        item.production_companies.set(company_objs)

        return item

    def fetch_list(self, list_id: str, category: str):
        """
        Fetch a TMDb list and create/update items
        """

        # Get or create TMDbList
        tmdb_list, _ = TMDbList.objects.get_or_create(
            tmdb_id=list_id, defaults={"name": f"List {list_id}", "category": category}
        )

        items = self.fetch_list_items(list_id)

        if category == "Anime" or category == "TVShow":
            media_type = "tv"
        else:
            media_type = "movie"

        for item in items:
            data = self.fetch_media_details(item["id"], media_type)
            self.sync_media_item(tmdb_list, data, media_type)
