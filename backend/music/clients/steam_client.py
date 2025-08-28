from django.conf import settings


class SteamClient:
    def __init__(self):
        self.api_key = settings.STEAM_API_KEY
