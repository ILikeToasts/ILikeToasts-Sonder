import { useLocation } from "react-router-dom";
import SpotifyArtistEmbed from "./SpotiftyArtistEmbed";
import { CenteredContainer } from "../../styles/global.styles";
import {
  ReviewBox,
  ReviewContainer,
  ReviewSubtitle,
  ReviewTitle,
} from "../../styles/review.styles";

const ArtistReview: React.FC = () => {
  const location = useLocation();
  const artist = location.state?.artist;

  if (!artist) {
    return <div>No artist data found.</div>;
  }

  return (
    <CenteredContainer>
      <ReviewContainer>
        <SpotifyArtistEmbed artistId={artist.spotify_id} />
        <ReviewBox>
          <ReviewTitle className="raleway-bold">{artist.name}</ReviewTitle>
          <ReviewSubtitle>
            {artist.genres.map((g: { name: string }) => g.name).join(", ")}
          </ReviewSubtitle>
          <p className="raleway-light">Popularity: {artist.popularity}</p>
          <p className="raleway-light">Followers: {artist.followers}</p>
        </ReviewBox>
      </ReviewContainer>
    </CenteredContainer>
  );
};

export default ArtistReview;
