from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from llm.models import (
    AlbumAnalysis,
    Artist_Recommendations,
    UserAlbumProfile,
    UserMusicProfile,
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


class UserMusicProfilePrompt:
    prompt_template = """
    You are an expert music critic and cultural analyst.
    Using the following list of highly enjoyed songs
    (with titles, artists, genres, and summaries),
    create a detailed profile of the user's musical taste.

    Look for patterns in genres, recurring artists, song moods,
    tempo, energy, lyrical themes,
    and any notable contrasts. Identify the top genres and artists
    that best represent the user's taste.

    Then, write a short, engaging paragraph summarizing the user's overall music style,
    as if you were describing it to a friend.

    SONG LIST:
    {songs_info}

    {format_instructions}
    """

    parser = JsonOutputParser(pydantic_object=UserMusicProfile)

    prompt = PromptTemplate(
        input_variables=["songs_info"],
        template=prompt_template,
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )


class UserAlbumProfilePrompt:
    prompt_template = """
    You are an expert music critic and cultural analyst.
    Using the following list of albums (with titles, artists, genres, and summaries),
    create a detailed profile of the user's album preferences.

    Look for patterns in genres, recurring artists, thematic concepts,
    production styles, and emotional tone. Identify the top genres and artists,
    and pick a few standout albums that best represent the user's taste.

    Then, write a short, engaging paragraph summarizing the user's overall album style,
    as if you were describing it to a friend.

    IMPORTANT: Consider all albums listed below equally
    when forming the profile, not just the last few.

    ALBUM LIST:
    {albums_info}

    {format_instructions}
    """

    parser = JsonOutputParser(pydantic_object=UserAlbumProfile)

    prompt = PromptTemplate(
        input_variables=["albums_info"],
        template=prompt_template,
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
