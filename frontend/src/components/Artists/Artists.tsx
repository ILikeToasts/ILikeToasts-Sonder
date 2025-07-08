import React, { useEffect, useState } from 'react';
import { SpotifyArtist } from '../../types/spotify';
import FilterableGalleryPage from '../Common/FilteredGalleryPage';

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await fetch('http://localhost:8000/api/spotify/artists/');
      const data = await response.json();
      setArtists(data);
    };
    fetchArtists();
  }, []);

  return (
    <FilterableGalleryPage
      items={artists}
      extractGenres={(artist) => artist.genres.map(g => g.name)}
      mapToGalleryItem={(artist) => ({
        id: artist.id,
        title: artist.name,
        imageUrl: artist.image_url,
        linkTo: `/artists/${artist.spotify_id}`,
        state: { artist },
      })}
    />
  );
};

export default Artists;
