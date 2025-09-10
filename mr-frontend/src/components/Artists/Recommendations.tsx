import { Button } from "../ui/button";
import { ButtonLoading } from "../ui/ButtonLoading";

import { API_ROUTES } from "@/constants/ApiRoutes";
import {
  ArtistTitle,
  InformationSection,
  MusicalStyle,
  RecommendationSection,
  Secondbox,
  Title,
} from "@/styles/common/Review.styles";
import { CenteredText } from "@/styles/global.styles";
import { useMutation } from "@tanstack/react-query";
import { MusicIcon } from "lucide-react";
import Carousel from "../Common/Carousel";

interface ArtistRecommendationProps {
  artistName: string;
}

export interface SimilarArtist {
  name: string;
  reason: string;
}

export interface Genre {
  name: string;
  reason: string;
}

export interface ArtistRecommendations {
  artist: string;
  musical_style: string;
  genres: Genre[];
  similar_artists: SimilarArtist[];
}

export const Recommendations: React.FC<ArtistRecommendationProps> = ({
  artistName,
}) => {
  const recommendationsMutation = useMutation<
    ArtistRecommendations,
    Error,
    string
  >({
    mutationFn: async (artistName) => {
      const res = await fetch(API_ROUTES.llm.artistRecommendations(artistName));
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      return data.recommendations as ArtistRecommendations;
    },
  });

  const recommendations = recommendationsMutation.data;
  const loading = recommendationsMutation.isPending;

  return (
    <RecommendationSection>
      {!recommendations && !loading && (
        <Button
          onClick={() => recommendationsMutation.mutate(artistName)}
          disabled={recommendationsMutation.isPending}
        >
          {recommendationsMutation.isPending
            ? "Loading..."
            : "Get Recommendations"}
        </Button>
      )}
      {loading && <ButtonLoading />}

      {recommendations && (
        <InformationSection>
          <MusicalStyle>
            <ArtistTitle>{artistName} Musical Style</ArtistTitle>
            <CenteredText>{recommendations.musical_style}</CenteredText>
          </MusicalStyle>
          <Secondbox>
            <div>
              <Title>Genres</Title>
              <Carousel
                baseWidth={400}
                autoplay={false}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={true}
                items={recommendations.genres.map((genre, idx) => ({
                  id: idx,
                  title: genre.name,
                  description: genre.reason,
                  icon: <MusicIcon className="w-5 h-5 text-muted-foreground" />,
                }))}
              />
            </div>
            <div>
              <Title>Similar Artists</Title>
              <Carousel
                baseWidth={400}
                autoplay={false}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={true}
                items={recommendations.similar_artists.map((genre, idx) => ({
                  id: idx,
                  title: genre.name,
                  description: genre.reason,
                  icon: <MusicIcon className="w-5 h-5 text-muted-foreground" />,
                }))}
              />
            </div>
          </Secondbox>
        </InformationSection>
      )}
    </RecommendationSection>
  );
};
