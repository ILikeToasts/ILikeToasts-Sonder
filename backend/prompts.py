from typing import List

from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field


class SimilarArtist(BaseModel):
    name: str = Field(description="Name of the Artist")
    reason: str = Field(description="Reson why this is a similar artist")


class Genres(BaseModel):
    name: str = Field(description="Name of the genre")
    reason: str = Field(description="Reason why the Artist fits into this genre")


class Artist_Recommendations(BaseModel):
    artist: str = Field(description="Name of the Artist")
    musical_style: str = Field(description="Musical style of the Artist")
    genres: List[Genres] = Field(description="Genres of the Artist")
    similar_artists: List[SimilarArtist]


class MusicRecommendationPrompt:
    prompt_template = """
    Using the following artist information (Bio and Tags) and similar artists,
    describe the musical style of {artist}, how they incorporate each genre and
    recommend 5 similar artists with a short explanation:
    {artist_info}
    \n{format_instructions}\n"
    """

    parser = JsonOutputParser(pydantic_object=Artist_Recommendations)

    prompt = PromptTemplate(
        input_variables=["artist", "artist_info"],
        template=prompt_template,
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
