from typing import List

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


class TopGenre(BaseModel):
    name: str
    reason: str


class FavoriteArtist(BaseModel):
    name: str
    reason: str


class FavoriteSong(BaseModel):
    name: str
    artist: str
    reason: str


class FavoriteAlbum(BaseModel):
    name: str
    artist: str
    reason: str


class UserMusicProfile(BaseModel):
    profile_summary: str = Field(
        description="A paragraph describing the user's overall music taste,"
        "including mood, energy, and notable trends"
    )
    top_genres: List[TopGenre]
    standout_songs: List[FavoriteSong]


class UserAlbumProfile(BaseModel):
    profile_summary: str = Field(
        description="A paragraph describing the user's overall album taste,"
        " including common themes, genres, and style"
    )
    top_genres: List[TopGenre]
