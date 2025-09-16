import { fetcher } from "@/api/service";
import { API_ROUTES } from "@/constants/ApiRoutes";
import {
  ReviewBox,
  ReviewContainer,
  ReviewInfo,
  ReviewSubtitle,
  ReviewTextSection,
  Titles,
  TitleSection,
} from "@/styles/common/Review.styles";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import type { SpotifyAlbumReview } from "../../types/spotify";
import BlurText from "../ui/BlurText";
import { CustomAuroraBackground } from "../ui/CustomAuroraBackground";
import { AlbumSummaries } from "./AlbumSummaries";
import SpotifyAlbumEmbed from "./SpotifyAlbumEmbed";

const AlbumReview: React.FC = () => {
  const location = useLocation();
  const album = location.state?.album;

  const { data: review } = useQuery<SpotifyAlbumReview[]>({
    queryKey: ["top-genres"],
    queryFn: async () =>
      fetcher<SpotifyAlbumReview[]>(API_ROUTES.reviews.albums(album.id)),
  });

  if (!album) {
    return <div>No album data found.</div>;
  }

  return (
    <>
      <CustomAuroraBackground imageUrl={album.cover_url} />

      <ReviewContainer>
        <ReviewInfo>
          <ReviewBox>
            <ReviewTextSection>
              <TitleSection>
                <Titles>
                  <BlurText
                    text={album.title}
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-5xl mb-8 underline"
                  />
                  <ReviewSubtitle>
                    <BlurText
                      text={album.genres
                        .map((g: { name: string }) => g.name)
                        .join(", ")}
                      delay={150}
                      animateBy="words"
                      direction="top"
                      className="text-3xl mb-8 bold"
                    />
                  </ReviewSubtitle>
                </Titles>
              </TitleSection>
            </ReviewTextSection>

            {review && review.length > 0 ? (
              <div>
                <ReviewTextSection>
                  {review[0].rating
                    ? `Rating: ${review[0].rating}/10`
                    : "No rating available."}
                </ReviewTextSection>
                <ReviewTextSection>
                  {review[0].content || "No description available."}
                </ReviewTextSection>
              </div>
            ) : (
              <div></div>
            )}
          </ReviewBox>
          <SpotifyAlbumEmbed
            albumId={album.spotify_id}
            albumName={album.title}
          />
        </ReviewInfo>
        <AlbumSummaries album={album} />
      </ReviewContainer>
    </>
  );
};

export default AlbumReview;
