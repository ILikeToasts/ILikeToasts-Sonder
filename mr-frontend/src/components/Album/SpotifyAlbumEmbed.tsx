import React from "react";
import "../../styles/album.css";

interface SpotifyAlbumEmbedProps {
  albumId: string;
  albumName?: string;
}

const SpotifyAlbumEmbed: React.FC<SpotifyAlbumEmbedProps> = ({ albumId }) => {
  return (
    <div className="spotifyAlbumEmbed">
      <iframe
        className="rounded-lg"
        style={{ borderRadius: "12px" }}
        src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator`}
        width="600"
        height="600"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyAlbumEmbed;
