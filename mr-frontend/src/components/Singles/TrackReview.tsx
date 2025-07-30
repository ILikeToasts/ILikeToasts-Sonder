import { useLocation } from "react-router-dom";
import SpotifyTrackEmbed from "./SpotifyTrackEmbed";
import { useEffect, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import Aurora, { AuroraBackground, AuroraBottom } from "../ui/Aurora";
import { ReviewContainer, ReviewInfo } from "@/styles/common/Review.styles";

const TrackReview: React.FC = () => {
  const location = useLocation();
  const track = location.state?.track;
  const [auroraColors, setAuroraColors] = useState<string[]>([]);

  if (!track) {
    return <div>No track data found.</div>;
  }

  useEffect(() => {
    if (!track?.cover_url) return;

    const fetchColors = async () => {
      try {
        const palette = await Vibrant.from(track.cover_url).getPalette();
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
  }, [track]);

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
          <SpotifyTrackEmbed spotifyTrackId={track.spotify_id} />
        </ReviewInfo>
      </ReviewContainer>
    </>
  );
};

export default TrackReview;
