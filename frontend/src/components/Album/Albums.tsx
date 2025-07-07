import React, { useEffect, useState } from 'react';
import { SpotifyAlbum } from '../../types/spotify';
import GalleryGrid, { GalleryItem } from '../Common/Gallery';

const Albums: React.FC = () => {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch('http://localhost:8000/api/spotify/albums/');
      const data = await response.json();
      setAlbums(data);
    };
    fetchAlbums();
  }, []);

  const albumItems: GalleryItem[] = albums.map((album) => ({
    id: album.id,
    title: album.title,
    imageUrl: album.cover_url,
    linkTo: `/albums/${album.spotify_id}`,
    state: { album },
  }));

  return <GalleryGrid items={albumItems} />;
};

export default Albums;
