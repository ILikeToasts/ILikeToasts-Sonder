import {
  ReviewBox,
  ReviewContainer,
  ReviewInfo,
  ReviewSubtitle,
  ReviewTitle,
  Titles,
  TitleSection,
} from "@/styles/common/Review.styles";
import React from "react";
import { useLocation } from "react-router-dom";
import { WebsiteLink } from "../Common/WebsiteLink";
import { CustomAuroraBackground } from "../ui/CustomAuroraBackground";
import { GameDescription } from "./GameDescription";

const GameReview: React.FC = () => {
  const location = useLocation();
  const game = location.state?.game;

  return (
    <>
      <CustomAuroraBackground imageUrl={game?.image} />

      <ReviewContainer>
        <ReviewInfo>
          <ReviewBox>
            <TitleSection>
              <Titles>
                <ReviewTitle>{game.name}</ReviewTitle>
                <ReviewSubtitle>
                  {game.genres.map((g: { name: string }) => g.name).join(", ")}
                </ReviewSubtitle>
                <ReviewSubtitle>Released: {game.release_date}</ReviewSubtitle>
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
  );
};

export default GameReview;
