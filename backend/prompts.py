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


class AlbumTrack(BaseModel):
    name: str = Field(description="Name of the track")
    reason: str = Field(description="Why this track stands out")


class AlbumGenre(BaseModel):
    name: str = Field(description="Name of the genre")
    reason: str = Field(description="Why this genre fits the album")


class AlbumAnalysis(BaseModel):
    album: str = Field(description="Name of the album")
    artist: str = Field(description="Name of the artist")
    description: str = Field(
        description="Summary of the musical and thematic style of the album"
    )
    genres: List[AlbumGenre] = Field(description="List of genres and why they fit")
    standout_tracks: List[AlbumTrack] = Field(
        description="Notable tracks from the album"
    )


class ArtistsRecommendationPrompt:
    parser = JsonOutputParser(pydantic_object=Artist_Recommendations)

    prompt_template = """
    Using the following artist information (Bio and Tags) and similar artists,
    describe the musical style of {artist}, explain how they incorporate each genre,
    and recommend 5 similar artists with a short explanation for each.

    Artist Info:
    {artist_info}

    Output the result strictly as JSON, following this format:
    {format_instructions}
    """

    prompt = PromptTemplate(
        input_variables=["artist", "artist_info"],
        template=prompt_template,
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )


class AlbumRecommendationPrompt:
    prompt_template = """
    Using the following album information (including description, tags, and tracklist),
    analyze the musical and thematic style of the album "{album}" by {artist}.
    Identify notable genres and explain why they apply, and highlight a few standout
    tracks with short explanations.

    {album_info}

    {format_instructions}
    """

    parser = JsonOutputParser(pydantic_object=AlbumAnalysis)

    prompt = PromptTemplate(
        input_variables=["artist", "album", "album_info"],
        template=prompt_template,
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
