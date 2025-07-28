import os
from typing import List

import requests
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from pydantic import PrivateAttr

URL = "http://ws.audioscrobbler.com/2.0/"


class LastFMRetriever(BaseRetriever):
    _api_key: str = PrivateAttr()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._api_key = os.getenv("LASTFM_API_KEY")

    def _get_relevant_documents(self, artist_name: str) -> List[Document]:

        # Prepare similar artists request
        similar_params = {
            "method": "artist.getsimilar",
            "artist": artist_name,
            "api_key": self._api_key,
            "format": "json",
            "limit": 5,
        }

        # Prepare artist bio request
        bio_params = {
            "method": "artist.getinfo",
            "artist": artist_name,
            "api_key": self._api_key,
            "format": "json",
        }

        try:
            # Fetch similar artists
            similar_resp = requests.get(URL, params=similar_params)
            similar_resp.raise_for_status()
            similar_data = similar_resp.json()
            similar_artists = similar_data.get("similarartists", {}).get("artist", [])
            similar_names = [a.get("name", "Unknown") for a in similar_artists]
            similar_str = ", ".join(similar_names) if similar_names else "None found"

            # Fetch artist bio & tags
            bio_tags_resp = requests.get(URL, params=bio_params)
            bio_tags_resp.raise_for_status()
            bio_tags_data = bio_tags_resp.json()
            bio_content = (
                bio_tags_data.get("artist", {})
                .get("bio", {})
                .get("summary", "No bio available.")
            )
            tags_content = (
                bio_tags_data.get("artist", {}).get("tags", {}).get("tag", {})
            )

            # Clean bio
            if bio_content and "<a" in bio_content:
                bio_content = bio_content.split("<a")[0].strip()

            # Clean tags
            tag_names = [tag["name"] for tag in tags_content]

            # Combine results
            full_content = (
                f"Artist: {artist_name}\n\n"
                f"Bio: {bio_content}\n\n"
                f"Similar Artists: {similar_str}\n\n"
                f"Tags: {tag_names}\n\n"
            )

            return [
                Document(
                    page_content=full_content,
                    metadata={
                        "artist": artist_name,
                        "bio": bio_content,
                        "similar_artists": similar_names,
                        "tags": tag_names,
                    },
                )
            ]

        except Exception as e:
            print(f"Last.fm API error: {e}")
            return [
                Document(
                    page_content="Error retrieving artist info.",
                    metadata={"artist": artist_name},
                )
            ]

    # TODO: Fetch the album's wiki from lastfm page.
    def get_album_info(self, artist_name: str, album_name: str) -> Document:
        params = {
            "method": "album.getinfo",
            "artist": artist_name,
            "album": album_name,
            "api_key": self._api_key,
            "format": "json",
        }

        try:
            resp = requests.get(URL, params=params)
            resp.raise_for_status()
            album_data = resp.json()

            album = album_data.get("album", {})
            tags_data = album.get("tags", {}).get("tag", [])
            tags = [tag["name"] for tag in tags_data if "name" in tag]
            wiki = album.get("wiki", {}).get("summary", "No description available.")
            tracks = album.get("tracks", {}).get("track", [])
            track_names = [track["name"] for track in tracks if "name" in track]

            # Clean wiki
            if wiki and "<a" in wiki:
                wiki = wiki.split("<a")[0].strip()

            track_list = (
                "\n".join([f"- {track['name']}" for track in tracks])
                if isinstance(tracks, list)
                else "No tracks available."
            )

            full_content = (
                f"Album: {album.get('name', album_name)}\n"
                f"Artist: {artist_name}\n\n"
                f"Description: {wiki}\n\n"
                f"Tags: {tags}\n\n"
                f"Tracks:\n{track_list}\n"
            )

            return Document(
                page_content=full_content,
                metadata={
                    "album": album_name,
                    "artist": artist_name,
                    "Description": wiki,
                    "Tags": tags,
                    "Tracks": track_names,
                },
            )

        except Exception as e:
            print(f"Error retrieving album info: {e}")
            return Document(
                page_content="Error retrieving album info.",
                metadata={"album": album_name, "artist": artist_name},
            )

    def get_artist_info(self, artist_name: str) -> Document:
        # Prepare similar artists request
        similar_params = {
            "method": "artist.getsimilar",
            "artist": artist_name,
            "api_key": self._api_key,
            "format": "json",
            "limit": 5,
        }

        # Prepare artist bio request
        bio_params = {
            "method": "artist.getinfo",
            "artist": artist_name,
            "api_key": self._api_key,
            "format": "json",
        }

        try:
            # Fetch similar artists
            similar_resp = requests.get(URL, params=similar_params)
            similar_resp.raise_for_status()
            similar_data = similar_resp.json()
            similar_artists = similar_data.get("similarartists", {}).get("artist", [])
            similar_names = [a.get("name", "Unknown") for a in similar_artists]
            similar_str = ", ".join(similar_names) if similar_names else "None found"

            # Fetch artist bio & tags
            bio_tags_resp = requests.get(URL, params=bio_params)
            bio_tags_resp.raise_for_status()
            bio_tags_data = bio_tags_resp.json()
            bio_content = (
                bio_tags_data.get("artist", {})
                .get("bio", {})
                .get("summary", "No bio available.")
            )
            tags_content = (
                bio_tags_data.get("artist", {}).get("tags", {}).get("tag", {})
            )

            # Clean bio
            if bio_content and "<a" in bio_content:
                bio_content = bio_content.split("<a")[0].strip()

            # Clean tags
            tag_names = [tag["name"] for tag in tags_content]

            # Combine results
            full_content = (
                f"Artist: {artist_name}\n\n"
                f"Bio: {bio_content}\n\n"
                f"Similar Artists: {similar_str}\n\n"
                f"Tags: {tag_names}\n\n"
            )

            return Document(
                page_content=full_content,
                metadata={
                    "artist": artist_name,
                    "bio": bio_content,
                    "similar_artists": similar_names,
                    "tags": tag_names,
                },
            )

        except Exception as e:
            print(f"Last.fm API error: {e}")
            return Document(
                page_content="Error retrieving artist info.",
                metadata={"artist": artist_name},
            )

    def get_track_info(self, artist_name: str, track_name: str) -> Document:
        # TODO : Maybe use this to help llm
        """similar_params = {
            "method": "track.getsimilar",
            "track": track_name,
            "artist": artist_name,
            "api_key": self._api_key,
            "format": "json",
            "limit": 5,
        }"""

        # Prepare artist bio request
        info_params = {
            "method": "track.getinfo",
            "track": track_name,
            "artist": artist_name,
            "api_key": self._api_key,
            "format": "json",
        }

        try:
            # Fetch artist bio
            bio_tags_resp = requests.get(URL, params=info_params)
            bio_tags_resp.raise_for_status()
            bio_tags_data = bio_tags_resp.json()
            bio_content = (
                bio_tags_data.get("track", {})
                .get("wiki", {})
                .get("summary", "No bio available.")
            )

            # Clean bio
            if bio_content and "<a" in bio_content:
                bio_content = bio_content.split("<a")[0].strip()

            # Combine results
            full_content = (
                f"Artist: {artist_name}\n\n"
                f"Track: {track_name}\n\n"
                f"Bio: {bio_content}\n\n"
            )

            return Document(
                page_content=full_content,
                metadata={
                    "artist": artist_name,
                    "track": track_name,
                    "bio": bio_content,
                },
            )

        except Exception as e:
            print(f"Last.fm API error: {e}")
            return Document(
                page_content="Error retrieving track info.",
                metadata={"track": track_name},
            )
