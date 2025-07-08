// SpotifyAlbumEmbed.tsx
import React from "react";
import "../../styles/album.css";

interface SpotifyArtistEmbedProps {
  artistId: string;
  albumName?: string;
}

const SpotifyArtistEmbed: React.FC<SpotifyArtistEmbedProps> = ({
  artistId,
}) => {
  return (
    <div className="spotifyAlbumEmbed">
      <iframe
        className="rounded-lg"
        style={{ borderRadius: "12px" }}
        src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator`}
        width="100%"
        height="600"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyArtistEmbed;
