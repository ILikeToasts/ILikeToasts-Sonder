import React from "react";
import "../../styles/album.css";

interface SpotifyTrackerEmbedProps {
  spotifyTrackId: string;
}

const SpotifyTrackEmbed: React.FC<SpotifyTrackerEmbedProps> = ({
  spotifyTrackId,
}) => {
  return (
    <div className="spotifyAlbumembed">
      <iframe
        data-testid="embed-iframe"
        style={{ borderRadius: "12px" }}
        src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator`}
        width="600"
        height="600"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyTrackEmbed;
