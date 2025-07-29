from langchain_core.runnables import RunnableSequence
from langchain_ollama import ChatOllama

from music.utils.retrievers import LastFMRetriever
from prompts import AlbumRecommendationPrompt, ArtistsRecommendationPrompt


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
