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
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Aurora, { AuroraBackground, AuroraBottom } from "../ui/Aurora";
import SpotifyTrackEmbed from "./SpotifyTrackEmbed";

const TrackReview: React.FC = () => {
  const location = useLocation();
  const single = location.state?.single;
  const [auroraColors, setAuroraColors] = useState<string[]>([]);

  if (!single) {
    return <div>No single data found.</div>;
  }

  useEffect(() => {
    if (!single?.cover_url) return;

    const fetchColors = async () => {
      try {
        const palette = await Vibrant.from(single.cover_url).getPalette();
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
  }, [single]);

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
