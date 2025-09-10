import {
  ArtistStats,
  ReviewBox,
  ReviewContainer,
  ReviewInfo,
  ReviewSubtitle,
  ReviewTextSection,
  ReviewTitle,
  Titles,
  TitleSection,
} from "@/styles/common/Review.styles";
import { useLocation } from "react-router-dom";
import { CustomAuroraBackground } from "../ui/CustomAuroraBackground";
import { Recommendations } from "./Recommendations";
import SpotifyArtistEmbed from "./SpotiftyArtistEmbed";

const ArtistReview: React.FC = () => {
  const location = useLocation();
  const artist = location.state?.artist;
  if (!artist) {
    return <div>No artist data found.</div>;
  }

  return (
    <>
      <CustomAuroraBackground imageUrl={artist.image_url} />

      <ReviewContainer>
        <ReviewInfo>
          <ReviewBox>
            <ReviewTextSection>
              <TitleSection>
                <Titles>
                  <ReviewTitle className="raleway-bold">
                    {artist.name}
                  </ReviewTitle>
                  <ReviewSubtitle>
                    {artist.genres
                      .map((g: { name: string }) => g.name)
                      .join(", ")}
                  </ReviewSubtitle>
                </Titles>

                <ArtistStats>
                  <p>Popularity: {artist.popularity}</p>
                  <p>Followers: {artist.followers}</p>
                </ArtistStats>
              </TitleSection>
            </ReviewTextSection>
          </ReviewBox>
          <SpotifyArtistEmbed artistId={artist.spotify_id} />
        </ReviewInfo>
        <Recommendations artistName={artist.name} />
      </ReviewContainer>
    </>
  );
};

export default ArtistReview;
