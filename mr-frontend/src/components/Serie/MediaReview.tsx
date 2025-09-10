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
import { ProductionCompanies } from "@/styles/Media/media.styles";
import type { ProductionCompany } from "@/types/tmdb";
import { useLocation } from "react-router-dom";
import TiltedCard from "../Common/TiltedCard";
import { CustomAuroraBackground } from "../ui/CustomAuroraBackground";

const MediaReview: React.FC = () => {
  const location = useLocation();
  const mediaItem =
    location.state?.serie || location.state?.anime || location.state?.movie;
  const mediaType = location.state?.movie ? "Movie" : "TV";
  const height = "750px";
  const width = "500px";

  if (!mediaItem) {
    return <div>No mediaItem data found.</div>;
  }

  return (
    <>
      <CustomAuroraBackground imageUrl={mediaItem?.poster_url} />
      <ReviewContainer>
        <ReviewInfo>
          <ReviewBox>
            <ReviewTextSection>
              <TitleSection>
                <Titles>
                  <ReviewTitle>{mediaItem.title}</ReviewTitle>
                  <ReviewSubtitle>
                    Released:{" "}
                    {mediaType === "Movie"
                      ? mediaItem.release_date
                      : mediaItem.first_air_date}
                  </ReviewSubtitle>
                  <ReviewSubtitle>
                    {mediaItem.genres
                      .map((g: { name: string }) => g.name)
                      .join(", ")}
                  </ReviewSubtitle>
                </Titles>
                <ArtistStats>
                  <p>Average rating: {mediaItem.vote_average}/10</p>
                  <p>Rating count: {mediaItem.vote_count}</p>
                  {mediaType === "Movie" ? (
                    <p>Runtime: {mediaItem.runtime} minutes</p>
                  ) : (
                    <p>Seasons count: {mediaItem.seasons}</p>
                  )}
                  {mediaType === "Movie" ? (
                    <></>
                  ) : (
                    <p>
                      Status:{" "}
                      {mediaItem.in_production ? "In production" : "Finished"}
                    </p>
                  )}
                </ArtistStats>
              </TitleSection>
            </ReviewTextSection>
            {mediaItem.overview}

            <ProductionCompanies>
              <div>Produced by : </div>
              {mediaItem.production_companies.map(
                (company: ProductionCompany, index: number) => {
                  return <div key={index}>{"- " + company.name}</div>;
                },
              )}
            </ProductionCompanies>
          </ReviewBox>
        </ReviewInfo>
        <TiltedCard
          imageSrc={mediaItem.poster_url || null}
          altText={mediaItem.title}
          containerHeight={height}
          containerWidth={width}
          imageHeight={height}
          imageWidth={width}
          rotateAmplitude={15}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={false}
        />
      </ReviewContainer>
    </>
  );
};

export default MediaReview;
