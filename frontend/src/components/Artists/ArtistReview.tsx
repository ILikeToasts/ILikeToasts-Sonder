import { useLocation } from "react-router-dom";
import SpotifyArtistEmbed from "./SpotiftyArtistEmbed";

const ArtistReview: React.FC = () => {
  const location = useLocation();
  const artist = location.state?.artist;

  if (!artist) {
    return <div>No artist data found.</div>;
  }

  return (
    <div className="center-container">
      <div className="reviewContainer">
        <SpotifyArtistEmbed artistId={artist.spotify_id} />
        <div className="reviewBox">
          <h2 className="raleway-bold">{artist.name}</h2>
          <h3>
            {artist.genres.map((g: { name: string }) => g.name).join(", ")}
          </h3>
          <p className="raleway-light">Popularity: {artist.popularity}</p>
          <p className="raleway-light">Followers: {artist.followers}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtistReview;
