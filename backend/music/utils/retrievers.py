from typing import List

import requests
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from pydantic import PrivateAttr


class LastFMRetriever(BaseRetriever):
    _api_key: str = PrivateAttr()

    def __init__(self, lastfm_api_key: str, **kwargs):
        super().__init__(**kwargs)
        self._api_key = lastfm_api_key

    def _get_relevant_documents(self, artist_name: str) -> List[Document]:
        similar_url = "http://ws.audioscrobbler.com/2.0/"
        bio_url = "http://ws.audioscrobbler.com/2.0/"

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
            similar_resp = requests.get(similar_url, params=similar_params)
            similar_resp.raise_for_status()
            similar_data = similar_resp.json()
            similar_artists = similar_data.get("similarartists", {}).get("artist", [])
            similar_names = [a.get("name", "Unknown") for a in similar_artists]
            similar_str = ", ".join(similar_names) if similar_names else "None found"

            # Fetch artist bio & tags
            bio_tags_resp = requests.get(bio_url, params=bio_params)
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
                Document(page_content=full_content, metadata={"artist": artist_name})
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
    def get_album_wiki(album_name):
        return ""
