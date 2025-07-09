import { useLocation } from "react-router-dom";
import SpotifyAlbumEmbed from "./SpotifyAlbumEmbed";
import { CenteredContainer } from "../../styles/global.styles";
import {
  ReviewBox,
  ReviewContainer,
  ReviewSubtitle,
  ReviewTitle,
} from "../../styles/review.styles";

const AlbumReview: React.FC = () => {
  const location = useLocation();
  const album = location.state?.album;

  if (!album) {
    return <div>No album data found.</div>;
  }

  return (
    <CenteredContainer>
      <ReviewContainer className="reviewContainer">
        <SpotifyAlbumEmbed albumId={album.spotify_id} albumName={album.title} />
        <ReviewBox>
          <ReviewTitle className="raleway-bold">{album.title}</ReviewTitle>
          <ReviewSubtitle>
            {album.genres.map((g: { name: string }) => g.name).join(", ")}
          </ReviewSubtitle>
          <div className="raleway-light">
            <p>This is a placeholder for the album review content.</p>
            <p>More details about the album can be added here.</p>
          </div>
        </ReviewBox>
      </ReviewContainer>
    </CenteredContainer>
  );
};

export default AlbumReview;
