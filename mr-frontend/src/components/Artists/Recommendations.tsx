import { useState } from "react";
import { Button } from "../ui/Button";
import { RecommendationSection } from "@/styles/review.styles";
import { ButtonLoading } from "../ui/ButtonLoading";
import {
  ArtistTitle,
  InformationSection,
  MusicalStyle,
  Secondbox,
  Title,
} from "@/styles/Artists/Artist_review.styles";
import { CenteredText } from "@/styles/global.styles";
import Carousel from "../Common/Carousel";
import { MusicIcon } from "lucide-react";

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
  const [recommendations, setRecommendations] =
    useState<ArtistRecommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/api/recommend/${artistName}`,
      );
      const data = await response.json();
      setRecommendations(data.recommendations as ArtistRecommendations);
    } catch (err) {
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecommendationSection>
      {!recommendations && !loading && (
        <Button onClick={fetchRecommendations}>Get Recommendations</Button>
      )}
      {loading && <ButtonLoading />}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
