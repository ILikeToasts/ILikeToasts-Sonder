import requests
from django.conf import settings

from music.models import GameDeveloper, GameGenre, GamePublisher, SteamGame


def _get_or_create_genres(genre_list):
    genre_objs = []
    for genre in genre_list:
        print(genre)
        genre_obj, _ = GameGenre.objects.get_or_create(name=genre.get("description"))
        genre_objs.append(genre_obj)
    return genre_objs


def _get_or_create_developers(developer_list):
    developer_objs = []
    for dev in developer_list:
        dev_obj, _ = GameDeveloper.objects.get_or_create(name=dev)
        developer_objs.append(dev_obj)
    return developer_objs


def _get_or_create_publishers(publisher_list):
    publisher_objs = []
    for publisher in publisher_list:
        publisher_obj, _ = GamePublisher.objects.get_or_create(name=publisher)
        publisher_objs.append(publisher_obj)
    return publisher_objs


class SteamClient:
    def __init__(self):
        self.api_key = settings.STEAM_API_KEY
        self.STEAM_USER_BASE_URL = "http://api.steampowered.com/ISteamUser/"
        self.STEAM_USER_STATS_BASE_URL = "http://api.steampowered.com/ISteamUserStats/"
        self.PLAYER_SERVICE_BASE_URL = "http://api.steampowered.com/IPlayerService/"

    def get_user_profile(self, profile_id: str):
        url = f"{self.STEAM_USER_BASE_URL}/GetPlayerSummaries/v0002/"
        try:
            resp = requests.get(
                url, params={"key": self.api_key, "steamids": profile_id}
            )
            return resp.json()
        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            return None

    def get_user_achievements(self, profile_id: str, app_id):
        url = f"{self.STEAM_USER_STATS_BASE_URL}/GetPlayerAchievements/v0001/"
        try:
            resp = requests.get(
                url,
                params={"key": self.api_key, "steamid": profile_id, "app_id": app_id},
            )
            return resp.json()
        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            return None

    def get_recently_player_games(self, profile_id: str):
        url = f"{self.PLAYER_SERVICE_BASE_URL}/GetRecentlyPlayedGames/v0001/"
        try:
            resp = requests.get(
                url, params={"key": self.api_key, "steamid": profile_id}
            )
            return resp.json()
        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            return None

    def fetch_steam_user_games(self, profile_id: str):
        url = f"{self.PLAYER_SERVICE_BASE_URL}/GetOwnedGames/v0001/"
        try:
            resp = requests.get(
                url, params={"key": self.api_key, "steamid": profile_id}
            )
            data = resp.json()
            games = data.get("response", []).get("games", [])
            self.get_owner_games_data(games)

        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            return None

    def get_owner_games_data(self, games):
        URL = "https://store.steampowered.com/api/appdetails/"
        MINIMUM_PLAYTIME = 100 * 60
        # Create or update game objects
        for game in games:
            if game["playtime_forever"] >= MINIMUM_PLAYTIME:
                resp = requests.get(
                    URL, params={"appids": game["appid"], "l": "english"}
                )

                game_data = resp.json()[str(game["appid"])]["data"]

                # Common fields

                genre_objs = _get_or_create_genres(game_data.get("genres", []))
                developers_objs = _get_or_create_developers(
                    game_data.get("developers", [])
                )
                publishers_objs = _get_or_create_publishers(
                    game_data.get("publishers", [])
                )

                game, created = SteamGame.objects.update_or_create(
                    name=game_data.get("name"),
                    appID=game_data.get("steam_appid", ""),
                    description=game_data.get("detailed_description", ""),
                    website=game_data["website"],
                    release_date=game_data.get("release_date", "").get("date", ""),
                    image=game_data.get("header_image", ""),
                )

                # Set Relations
                game.developers.set(developers_objs)
                game.publishers.set(publishers_objs)
                game.genres.set(genre_objs)
