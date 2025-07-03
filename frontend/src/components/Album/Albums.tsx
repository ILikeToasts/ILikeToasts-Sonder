import React, { useEffect, useState } from 'react';
import SpotifyAlbumEmbed from './SpotifyAlbumEmbed';
import '../../styles/album.css';
import '../../styles/global.css';
import { SpotifyAlbum } from '../../types/spotify';
  
const Albums: React.FC = () => {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/spotify/albums/');
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, []);
  return (
    <div>
        <div className="albumContainer">
            {albums.map((album) => (
            <SpotifyAlbumEmbed
                key={album.spotify_id}
                albumId={album.spotify_id}
            />
            ))}
        </div>
    </div>
  );
};

export default Albums;
