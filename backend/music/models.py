from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Artist(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    genres = models.ManyToManyField(Genre, related_name="artists")
    image_url = models.URLField(blank=True)
    popularity = models.IntegerField(default=0)
    followers = models.IntegerField(default=0)
    wiki_summary = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Album(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="albums")
    genres = models.ManyToManyField(Genre, related_name="albums")
    cover_url = models.URLField(blank=True)
    wiki_summary = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.artist.name}"


class Song(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name="songs", null=True, blank=True
    )
    artists = models.ManyToManyField(Artist, related_name="songs")
    duration_seconds = models.PositiveIntegerField()
    cover_url = models.URLField(blank=True)
    wiki_summary = models.TextField(blank=True)
    genres = models.ManyToManyField("Genre", related_name="songs", blank=True)
    bop = models.BooleanField(blank=True, default=False)

    def __str__(self):
        return self.title


class Playlist(models.Model):
    title = models.CharField(max_length=255)
    spotify_id = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    cover_url = models.URLField(blank=True)
    songs = models.ManyToManyField(Song, related_name="playlists")

    def __str__(self):
        return self.title


class Review(models.Model):
    REVIEW_TARGET_CHOICES = [
        ("album", "Album"),
        ("song", "Song"),
    ]

    target_type = models.CharField(max_length=5, choices=REVIEW_TARGET_CHOICES)
    album = models.ForeignKey(Album, null=True, blank=True, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, null=True, blank=True, on_delete=models.CASCADE)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.target_type == "album" and not self.album:
            raise ValidationError("Album review must be linked to an album.")
        if self.target_type == "song" and not self.song:
            raise ValidationError("Song review must be linked to a song.")

    def __str__(self):
        return f"{self.target_type.title()} Review ({self.rating}/10)"


class MediaItem(models.Model):
    MEDIA_TYPE_CHOICES = (
        ("image", "Image"),
        ("video", "Video"),
        ("youtube", "YouTube"),
    )

    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    category = models.CharField(max_length=100)

    file = models.FileField(upload_to="uploads/", blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    height = models.PositiveIntegerField(default=300)

    def __str__(self):
        return f"{self.media_type} - {self.category} - {self.url or self.file.name}"

    def clean(self):
        errors = {}

        if self.media_type in ["image", "video"]:
            if not self.file:
                errors["file"] = "File is required for images and videos."
            if self.url:
                errors["url"] = "Uploaded media should not have a URL."

        if self.media_type == "youtube":
            if not self.url:
                errors["url"] = "URL is required for YouTube media."
            if self.file:
                errors["file"] = "YouTube media should not have an uploaded file."

        if errors:
            raise ValidationError(errors)
