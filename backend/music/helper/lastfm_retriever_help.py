def extract_tracks(raw_tracks_field) -> tuple[list[str], str]:
    # raw_tracks_field can be a list or a dict or something invalid
    tracks_data = raw_tracks_field

    # Handle dict or list or weird edge case
    if isinstance(tracks_data, dict):
        tracks = [tracks_data]
    elif isinstance(tracks_data, list):
        tracks = tracks_data
    else:
        tracks = []

    track_names = [
        track.get("name", "Unknown Track")
        for track in tracks
        if isinstance(track, dict) and "name" in track
    ]
    track_list = (
        "\n".join([f"- {name}" for name in track_names]) or "No tracks available."
    )

    return track_names, track_list
