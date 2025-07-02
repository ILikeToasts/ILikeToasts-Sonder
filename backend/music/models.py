from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Artist(models.Model):
    name = models.CharField(max_length=255)
    genres = models.ManyToManyField(Genre, related_name='artists')
    image_url = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums')
    genres = models.ManyToManyField(Genre, related_name='albums')
    cover_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.artist.name}"

class Song(models.Model):
    title = models.CharField(max_length=255)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='songs')
    duration_seconds = models.PositiveIntegerField()
    cover_url = models.URLField(blank=True)

    def __str__(self):
        return self.title

class Review(models.Model):
    REVIEW_TARGET_CHOICES = [
        ('album', 'Album'),
        ('song', 'Song'),
    ]

    target_type = models.CharField(max_length=5, choices=REVIEW_TARGET_CHOICES)
    album = models.ForeignKey(Album, null=True, blank=True, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, null=True, blank=True, on_delete=models.CASCADE)
    rating = models.IntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.target_type == 'album' and not self.album:
            raise ValidationError("Album review must be linked to an album.")
        if self.target_type == 'song' and not self.song:
            raise ValidationError("Song review must be linked to a song.")

    def __str__(self):
        return f"{self.target_type.title()} Review ({self.rating}/10)"
