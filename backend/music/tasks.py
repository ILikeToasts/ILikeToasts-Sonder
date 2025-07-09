from celery import shared_task

from .models import Artist, Genre
from .spotify_client import SpotifyClient


@shared_task
def update_artist_data():
    sp = SpotifyClient().sp
    artists = Artist.objects.all()

    for artist in artists:
        try:
            artist_data = sp.artist(artist.spotify_id)
            artist.name = artist_data["name"]
            artist.image_url = (
                artist_data["images"][0]["url"] if artist_data["images"] else ""
            )
            artist.popularity = artist_data.get("popularity", 0)
            artist.followers = artist_data.get("followers", {}).get("total", 0)

            # Update genres
            artist.genres.clear()
            for genre_name in artist_data.get("genres", []):
                genre, _ = Genre.objects.get_or_create(name=genre_name)
                artist.genres.add(genre)

            artist.save()
            print(f"Updated artist: {artist.name}")

        except Exception as e:
            print(f"Error updating artist {artist.name}: {e}")
