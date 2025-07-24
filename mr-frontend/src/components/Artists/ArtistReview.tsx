import { useLocation } from "react-router-dom";
import SpotifyArtistEmbed from "./SpotiftyArtistEmbed";
import {
  ArtistInfo,
  ArtistStats,
  ReviewBox,
  ReviewSubtitle,
  ReviewTextSection,
  ReviewTitle,
  Titles,
  TitleSection,
} from "../../styles/review.styles";
import Aurora, { AuroraBackground, AuroraBottom } from "../ui/Aurora";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";
import { Recommendations } from "./Recommendations";
import { ArtistReviewContainer } from "@/styles/Artists/Artist_review.styles";

const ArtistReview: React.FC = () => {
  const location = useLocation();
  const artist = location.state?.artist;
  const [auroraColors, setAuroraColors] = useState<string[]>([]);

  if (!artist) {
    return <div>No artist data found.</div>;
  }

  useEffect(() => {
    if (!artist?.image_url) return;

    const fetchColors = async () => {
      try {
        const palette = await Vibrant.from(artist.image_url).getPalette();
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
  }, [artist]);

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

      <ArtistReviewContainer>
        <ArtistInfo>
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
        </ArtistInfo>
        <Recommendations artistName={artist.name}></Recommendations>
      </ArtistReviewContainer>
    </>
  );
};

export default ArtistReview;
