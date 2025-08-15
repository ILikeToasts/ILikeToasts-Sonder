from langchain_core.runnables import RunnableSequence
from langchain_ollama import ChatOllama

from llm.prompts import (
    AlbumRecommendationPrompt,
    ArtistsRecommendationPrompt,
    UserAlbumProfilePrompt,
    UserMusicProfilePrompt,
)
from music.models import Song
from music.utils.retrievers import LastFMRetriever


def chunk_albums(albums, size=10):
    for i in range(0, len(albums), size):
        yield albums[i : i + size]


class Ollama_client:
    OLLAMA_URL = "http://host.docker.internal:11434"
    OLLAMA_MODEL = "gemma3"
    OLLAMA_TEMPERATURE = 0.7

    def __init__(self):
        self.llm = ChatOllama(
            model=self.OLLAMA_MODEL,
            temperature=self.OLLAMA_TEMPERATURE,
            base_url=self.OLLAMA_URL,
        )

    def generate_artists_recommendations(self, artist_name: str):
        lastfm_retriever = LastFMRetriever()

        doc = lastfm_retriever.get_artist_info(artist_name)
        artist_info = doc.page_content

        chain: RunnableSequence = (
            ArtistsRecommendationPrompt.prompt
            | self.llm
            | ArtistsRecommendationPrompt.parser
        )

        response = chain.invoke({"artist": artist_name, "artist_info": artist_info})

        return response

    def generate_album_recommendations(self, artist_name: str, album_name: str):
        lastfm_retriever = LastFMRetriever()

        doc = lastfm_retriever.get_album_info(artist_name, album_name)
        album_info = doc.page_content

        chain: RunnableSequence = (
            AlbumRecommendationPrompt.prompt
            | self.llm
            | AlbumRecommendationPrompt.parser
        )

        response = chain.invoke(
            {"artist": artist_name, "album": album_name, "album_info": album_info}
        )

        return response

    def generate_user_music_profile(self, songs: list["Song"]):
        songs_info = "\n".join(
            [
                f"{i+1}. Song: '{song.title}'\n"
                f"   Artist(s): {', '.join(artist.name for artist in song.artists.all())}\n"
                f"   Album: {song.album.title if song.album else 'N/A'}\n"
                f"   Genres: {', '.join(g.name for g in song.genres.all())}\n"
                f"   Summary: {song.wiki_summary or 'No summary available.'}"
                for i, song in enumerate(songs)
            ]
        )

        chain = UserMusicProfilePrompt.prompt | self.llm | UserMusicProfilePrompt.parser
        return chain.invoke({"songs_info": songs_info})

    def _format_album_list(self, albums):
        """Format albums into a string for the LLM."""
        return "\n".join(
            [
                f"{i+1}. Album: '{album.title}'\n"
                f"   Artist: {album.artist.name}\n"
                f"   Genres: {', '.join(g.name for g in album.genres.all())}\n"
                f"   Summary: {album.wiki_summary or 'No summary available.'}"
                for i, album in enumerate(albums)
            ]
        )

    def generate_user_album_profile(self, albums):
        batch_summaries = []

        # Summarize albums in batches
        for batch in chunk_albums(albums, size=10):
            albums_info = self._format_album_list(batch)
            chain = (
                UserAlbumProfilePrompt.prompt | self.llm | UserAlbumProfilePrompt.parser
            )
            batch_summary = chain.invoke({"albums_info": albums_info})
            batch_summaries.append(batch_summary["profile_summary"])

        # Merge all batch summaries into a final summary
        merged_info = "\n".join(
            f"Batch {i+1} summary: {summary}"
            for i, summary in enumerate(batch_summaries)
        )

        final_prompt = f"""
        You are given several summaries of a user's favorite albums in batches:

        {merged_info}

        Using all of these summaries, create ONE final comprehensive profile that
        captures the overall album taste, including top genres, favorite artists,
        and standout albums. Return it in the required JSON format.

        {UserAlbumProfilePrompt.parser.get_format_instructions()}
        """

        chain = self.llm | UserAlbumProfilePrompt.parser

        return chain.invoke(final_prompt)
