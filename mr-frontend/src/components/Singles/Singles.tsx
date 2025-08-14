import React, { useEffect, useState } from "react";
import type { SpotifyTrack } from "../../types/spotify";
import FilterableGalleryPage from "../Common/FilteredGalleryPage";

const Tracks: React.FC = () => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const response = await fetch("http://localhost:8000/api/spotify/tracks/");
      const data = await response.json();
      setTracks(data);
      console.log(data);
    };
    fetchTracks();
  }, []);

  return (
    <FilterableGalleryPage
      items={tracks}
      extractGenres={(track) => track.genres?.map((g) => g.name) ?? []}
      mapToGalleryItem={(track) => ({
        id: track.id,
        title: track.title,
        imageUrl: track.cover_url,
        linkTo: `/tracks/${track.spotify_id}`,
        state: { track },
      })}
    />
  );
};

export default Tracks;
