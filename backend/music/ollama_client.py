import os

from langchain_core.runnables import RunnableSequence
from langchain_ollama import ChatOllama

from music.utils.retrievers import LastFMRetriever
from prompts import MusicRecommendationPrompt


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

    def generate_recommendations(self, artist_name: str):
        lastfm_key = os.getenv("LASTFM_API_KEY")
        lastfm_retriever = LastFMRetriever(lastfm_key)

        doc = lastfm_retriever.invoke(artist_name)
        artist_info = doc[0].page_content

        chain: RunnableSequence = (
            MusicRecommendationPrompt.prompt
            | self.llm
            | MusicRecommendationPrompt.parser
        )

        response = chain.invoke({"artist": artist_name, "artist_info": artist_info})

        print(response)

        return response
