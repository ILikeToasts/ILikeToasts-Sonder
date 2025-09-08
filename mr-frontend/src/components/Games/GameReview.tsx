import {
  ReviewBox,
  ReviewContainer,
  ReviewInfo,
  ReviewSubtitle,
  ReviewTitle,
  Titles,
  TitleSection,
} from "@/styles/common/Review.styles";
import { Vibrant } from "node-vibrant/browser";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WebsiteLink } from "../Common/WebsiteLink";
import Aurora, { AuroraBackground, AuroraBottom } from "../ui/Aurora";
import { GameDescription } from "./GameDescription";

const GameReview: React.FC = () => {
  const location = useLocation();
  const game = location.state?.game;
  const [auroraColors, setAuroraColors] = useState<string[]>([]);
  const height = "215px";
  const width = "460px";

  useEffect(() => {
    if (!game?.image) return;

    const fetchColors = async () => {
      try {
        const palette = await Vibrant.from(game.image).getPalette();
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
  }, [game]);

  console.log(game);

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

          <ReviewContainer>
            <ReviewInfo>
              <ReviewBox>
                <TitleSection>
                  <Titles>
                    <ReviewTitle>{game.name}</ReviewTitle>
                    <ReviewSubtitle>
                      {game.genres
                        .map((g: { name: string }) => g.name)
                        .join(", ")}
                    </ReviewSubtitle>
                    <ReviewSubtitle>
                      Released: {game.release_date}
                    </ReviewSubtitle>
                    <ReviewSubtitle>
                      Developers:
                      {game.developers
                        .map((g: { name: string }) => g.name)
                        .join(", ")}
                    </ReviewSubtitle>
                    <ReviewSubtitle>
                      Publishers:
                      {game.publishers
                        .map((g: { name: string }) => g.name)
                        .join(", ")}
                    </ReviewSubtitle>
                    <ReviewSubtitle>
                      <WebsiteLink url={game.website} />
                    </ReviewSubtitle>
                    <ReviewSubtitle>Steam App ID: {game.appID}</ReviewSubtitle>
                  </Titles>
                </TitleSection>
                <GameDescription description={game.description} />
              </ReviewBox>
            </ReviewInfo>
          </ReviewContainer>
        </>
      )}
    </>
  );
};

export default GameReview;
