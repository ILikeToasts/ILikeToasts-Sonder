import React, { useEffect, useState } from 'react';
import GalleryGrid, { GalleryItem } from '../Common/Gallery';
import { SpotifyArtist } from '../../types/spotify';

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

  const artistItems: GalleryItem[] = artists.map((artist) => ({
    id: artist.id,
    title: artist.name,
    imageUrl: artist.image_url,
    linkTo: `/albums/${artist.spotify_id}`,
    state: { artist },
  }));

  return <GalleryGrid items={artistItems} />;
};

export default Artists;
