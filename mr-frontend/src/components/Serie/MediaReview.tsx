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
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TiltedCard from "../Common/TiltedCard";
import Aurora, { AuroraBackground, AuroraBottom } from "../ui/Aurora";

const MediaReview: React.FC = () => {
  const location = useLocation();
  const mediaItem =
    location.state?.serie || location.state?.anime || location.state?.movie;
  const mediaType = location.state?.movie ? "Movie" : "TV";
  const [auroraColors, setAuroraColors] = useState<string[]>([]);
  const height = "750px";
  const width = "500px";

  if (!mediaItem) {
    return <div>No mediaItem data found.</div>;
  }

  useEffect(() => {
    if (mediaItem.poster_url) return;

    const fetchColors = async () => {
      try {
        const palette = await Vibrant.from(mediaItem.poster_url).getPalette();
        const selectedColors = [
          palette.Vibrant?.hex,
          palette.DarkMuted?.hex,
          palette.DarkVibrant?.hex,
        ].filter(Boolean) as string[];

        setAuroraColors(selectedColors);
      } catch (err) {
        console.error("Failed to extract colors", err);
        setAuroraColors(["#3A29FF", "#FF94B4", "#FF3232"]);
      }
    };
    fetchColors();
  }, [mediaItem]);

  console.log(mediaItem.production_companies);

  return (
    <>
      {auroraColors.length > 0 && (
        <>
          <AuroraBackground>
            <Aurora
              colorStops={auroraColors}
              blend={1}
              amplitude={1}
              speed={1}
            />
          </AuroraBackground>
          <AuroraBottom>
            <Aurora
              colorStops={auroraColors}
              blend={1}
              amplitude={0.5}
              speed={1}
            />
          </AuroraBottom>
        </>
      )}
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
                (company: ProductionCompany) => {
                  return <div>{"- " + company.name}</div>;
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
