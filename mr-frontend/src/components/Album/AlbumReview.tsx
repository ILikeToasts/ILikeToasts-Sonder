import { useLocation } from "react-router-dom";
import SpotifyAlbumEmbed from "./SpotifyAlbumEmbed";
import { CenteredContainer } from "../../styles/global.styles";
import {
  ReviewBox,
  ReviewContainer,
  ReviewSubtitle,
  ReviewText,
  ReviewTitle,
} from "../../styles/review.styles";
import type { SpotifyAlbumReview } from "../../types/spotify";
import { useEffect, useState } from "react";

const AlbumReview: React.FC = () => {
  const location = useLocation();
  const album = location.state?.album;
  const [review, setReview] = useState<SpotifyAlbumReview[]>([]);

  useEffect(() => {
    const fetchReview = async () => {
      const response = await fetch(
        "http://localhost:8000/api/spotify/reviews/album/" + album.id + "/",
      );
      const data = await response.json();
      setReview(data);
      console.log(data);
    };
    fetchReview();
  }, []);

  if (!album) {
    return <div>No album data found.</div>;
  }

  return (
    <CenteredContainer>
      <ReviewContainer className="reviewContainer">
        <SpotifyAlbumEmbed albumId={album.spotify_id} albumName={album.title} />
        <ReviewBox>
          <ReviewTitle>{album.title}</ReviewTitle>
          <ReviewSubtitle>
            {album.genres.map((g: { name: string }) => g.name).join(", ")}
          </ReviewSubtitle>
          {review[0] ? (
            <div>
              <ReviewText>
                {review[0].rating
                  ? `Rating: ${review[0].rating}/10`
                  : "No rating available."}
              </ReviewText>
              <ReviewText>
                {review[0].content || "No description available."}
              </ReviewText>
            </div>
          ) : (
            <div></div>
          )}
        </ReviewBox>
      </ReviewContainer>
    </CenteredContainer>
  );
};

export default AlbumReview;
