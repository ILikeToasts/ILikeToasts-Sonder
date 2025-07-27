import { useLocation } from "react-router-dom";
import SpotifyAlbumEmbed from "./SpotifyAlbumEmbed";
import { CenteredContainer } from "../../styles/global.styles";
import {
  ReviewBox,
  ReviewContainer,
  ReviewSubtitle,
  ReviewTextSection,
  ReviewTitle,
} from "../../styles/review.styles";
import type { SpotifyAlbumReview } from "../../types/spotify";
import { useEffect, useState } from "react";
import Aurora, { AuroraBackground } from "../ui/Aurora";
import { Vibrant } from "node-vibrant/browser";

const AlbumReview: React.FC = () => {
  const location = useLocation();
  const album = location.state?.album;
  const [review, setReview] = useState<SpotifyAlbumReview[]>([]);
  const [auroraColors, setAuroraColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchReview = async () => {
      const response = await fetch(
        "http://localhost:8000/api/spotify/reviews/album/" + album.id + "/",
      );
      const data = await response.json();
      setReview(data);
    };
    fetchReview();
  }, []);

  useEffect(() => {
    if (!album?.cover_url) return;

    const fetchColors = async () => {
      try {
        const palette = await Vibrant.from(album.cover_url).getPalette();
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
  }, [album]);

  if (!album) {
    return <div>No album data found.</div>;
  }

  return (
    <div className="space-y-4">
      <div style={{ position: "relative", overflow: "hidden" }}>
        {auroraColors.length > 0 && (
          <AuroraBackground>
            <Aurora
              colorStops={auroraColors}
              blend={0.6}
              amplitude={0.5}
              speed={1}
            />
          </AuroraBackground>
        )}
        <CenteredContainer>
          <ReviewContainer className="reviewContainer">
            <SpotifyAlbumEmbed
              albumId={album.spotify_id}
              albumName={album.title}
            />
            <ReviewBox>
              <ReviewTitle>{album.title}</ReviewTitle>
              <ReviewSubtitle>
                {album.genres.map((g: { name: string }) => g.name).join(", ")}
              </ReviewSubtitle>
              {review[0] ? (
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
          </ReviewContainer>
        </CenteredContainer>
      </div>
    </div>
  );
};

export default AlbumReview;
