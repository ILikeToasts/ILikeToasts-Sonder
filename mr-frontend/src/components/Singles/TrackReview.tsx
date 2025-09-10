import {
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
import SpotifyTrackEmbed from "./SpotifyTrackEmbed";

const TrackReview: React.FC = () => {
  const location = useLocation();
  const single = location.state?.single;

  if (!single) {
    return <div>No single data found.</div>;
  }

  return (
    <>
      <CustomAuroraBackground imageUrl={single?.cover_url} />
      <ReviewContainer>
        <ReviewInfo>
          <ReviewBox>
            <ReviewTextSection>
              <TitleSection>
                <Titles>
                  <ReviewTitle>{single.title}</ReviewTitle>
                  <ReviewSubtitle>
                    {single.genres
                      .map((g: { name: string }) => g.name)
                      .join(", ")}
                  </ReviewSubtitle>
                </Titles>
              </TitleSection>
            </ReviewTextSection>
          </ReviewBox>
          <SpotifyTrackEmbed spotifyTrackId={single.spotify_id} />
        </ReviewInfo>
      </ReviewContainer>
    </>
  );
};

export default TrackReview;
