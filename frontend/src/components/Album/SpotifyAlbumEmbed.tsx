// SpotifyAlbumEmbed.tsx
import React from 'react';
import '../../styles/album.css';

interface SpotifyAlbumEmbedProps {
  albumId: string;
}

const SpotifyAlbumEmbed: React.FC<SpotifyAlbumEmbedProps> = ({ albumId }) => {
  return (
    <div className="album">
      <iframe
        className="rounded-lg"
        style={{ borderRadius: '12px' }}
        src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator`}
        width="100%"
        height="500"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyAlbumEmbed;
