import pytest
from django.core.exceptions import ValidationError

from music.models import Album, Artist, Genre, MediaItem, Playlist, Review, Song


@pytest.mark.unit
@pytest.mark.django_db
class TestGenre:
    def test_str(self):
        genre = Genre.objects.create(name="Rock")
        assert str(genre) == "Rock"


@pytest.mark.unit
@pytest.mark.django_db
class TestArtist:
    def test_create_and_str(self):
        genre = Genre.objects.create(name="Pop")
        artist = Artist.objects.create(spotify_id="artist123", name="Artist Name")
        artist.genres.add(genre)
        assert str(artist) == "Artist Name"
        assert genre in artist.genres.all()


@pytest.mark.unit
@pytest.mark.django_db
class TestAlbum:
    def test_create_and_str(self):
        artist = Artist.objects.create(spotify_id="artist123", name="Artist")
        genre = Genre.objects.create(name="Pop")
        album = Album.objects.create(
            spotify_id="album123", title="Album Title", artist=artist
        )
        album.genres.add(genre)
        expected_str = f"{album.title} - {artist.name}"
        assert str(album) == expected_str
        assert genre in album.genres.all()


@pytest.mark.unit
@pytest.mark.django_db
class TestSong:
    def test_create_and_str(self):
        artist = Artist.objects.create(spotify_id="artist1", name="Artist One")
        album = Album.objects.create(
            spotify_id="album1", title="Album One", artist=artist
        )
        song = Song.objects.create(
            spotify_id="song1", title="Song One", album=album, duration_seconds=200
        )
        song.artists.add(artist)
        assert str(song) == "Song One"
        assert artist in song.artists.all()
        # genres is optional and blank by default
        assert song.genres.count() == 0


@pytest.mark.unit
@pytest.mark.django_db
class TestPlaylist:
    def test_create_and_str(self):
        playlist = Playlist.objects.create(
            title="My Playlist", spotify_id="playlist123"
        )
        assert str(playlist) == "My Playlist"

    def test_add_songs(self):
        artist = Artist.objects.create(spotify_id="artist1", name="Artist One")
        album = Album.objects.create(
            spotify_id="album1", title="Album One", artist=artist
        )
        song = Song.objects.create(
            spotify_id="song1", title="Song One", album=album, duration_seconds=200
        )
        playlist = Playlist.objects.create(
            title="My Playlist", spotify_id="playlist123"
        )
        playlist.songs.add(song)
        assert song in playlist.songs.all()


@pytest.mark.unit
@pytest.mark.django_db
class TestReview:
    def test_album_review_valid(self):
        artist = Artist.objects.create(spotify_id="artist1", name="Artist One")
        album = Album.objects.create(
            spotify_id="album1", title="Album One", artist=artist
        )
        review = Review(
            target_type="album", album=album, rating=8, content="Great album!"
        )
        review.clean()  # Should not raise
        review.save()
        assert str(review) == "Album Review (8/10)"

    def test_album_review_without_album_raises(self):
        review = Review(target_type="album", rating=7, content="Missing album")
        with pytest.raises(ValidationError) as excinfo:
            review.clean()
        assert "Album review must be linked to an album." in str(excinfo.value)

    def test_song_review_valid(self):
        artist = Artist.objects.create(spotify_id="artist1", name="Artist One")
        album = Album.objects.create(
            spotify_id="album1", title="Album One", artist=artist
        )
        song = Song.objects.create(
            spotify_id="song1", title="Song One", album=album, duration_seconds=180
        )
        review = Review(
            target_type="song", song=song, rating=9, content="Awesome song!"
        )
        review.clean()  # Should not raise
        review.save()
        assert str(review) == "Song Review (9/10)"

    def test_song_review_without_song_raises(self):
        review = Review(target_type="song", rating=5, content="Missing song")
        with pytest.raises(ValidationError) as excinfo:
            review.clean()
        assert "Song review must be linked to a song." in str(excinfo.value)

    def test_rating_bounds(self):
        artist = Artist.objects.create(spotify_id="artist1", name="Artist One")
        album = Album.objects.create(
            spotify_id="album1", title="Album One", artist=artist
        )

        with pytest.raises(ValidationError):
            review = Review(
                target_type="album", album=album, rating=0, content="Too low"
            )
            review.full_clean()

        with pytest.raises(ValidationError):
            review = Review(
                target_type="album", album=album, rating=11, content="Too high"
            )
            review.full_clean()


@pytest.mark.unit
@pytest.mark.django_db
class TestMediaItem:
    def test_image_file_required(self):
        media = MediaItem(media_type="image", category="cover")
        with pytest.raises(ValidationError) as excinfo:
            media.clean()
        assert "File is required for images and videos." in str(excinfo.value)

    def test_video_file_required(self):
        media = MediaItem(media_type="video", category="trailer")
        with pytest.raises(ValidationError) as excinfo:
            media.clean()
        assert "File is required for images and videos." in str(excinfo.value)

    def test_youtube_url_required(self):
        media = MediaItem(media_type="youtube", category="clip")
        with pytest.raises(ValidationError) as excinfo:
            media.clean()
        assert "URL is required for YouTube media." in str(excinfo.value)

    def test_youtube_file_not_allowed(self, tmp_path):
        f = tmp_path / "video.mp4"
        f.write_text("dummy data")
        media = MediaItem(media_type="youtube", category="clip", file=f)
        with pytest.raises(ValidationError) as excinfo:
            media.clean()
        assert "YouTube media should not have an uploaded file." in str(excinfo.value)

    def test_image_url_not_allowed(self):
        media = MediaItem(
            media_type="image",
            category="cover",
            url="http://example.com/image.jpg",
            file=None,
        )
        with pytest.raises(ValidationError) as excinfo:
            media.clean()
        assert "Uploaded media should not have a URL." in str(excinfo.value)

    def test_valid_image(self, tmp_path):
        f = tmp_path / "image.jpg"
        f.write_text("dummy data")
        media = MediaItem(media_type="image", category="cover", file=f)
        # Should not raise
        media.clean()

    def test_valid_youtube(self):
        media = MediaItem(
            media_type="youtube", category="clip", url="http://youtube.com/abc"
        )
        media.clean()  # no exception
