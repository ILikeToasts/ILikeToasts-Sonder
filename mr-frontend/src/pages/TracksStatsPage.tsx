import Carousel from "@/components/Common/Carousel";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { Card } from "@/components/ui/card";
import { ChartPieInteractive } from "@/components/ui/PieChart";
import { ChartRadar } from "@/components/ui/RadarChart";
import { FlexContainer } from "@/styles/common/Page.styles";
import { CenteredText } from "@/styles/global.styles";
import { CarouselContainer, MusicProfile } from "@/styles/Tracks/Tracks.styles";
import { MusicIcon } from "lucide-react";
import { useEffect, useState } from "react";

type GenreData = {
  name: string;
  value: number;
};

type ArtistData = {
  name: string;
  followers: number;
};

type FavoriteArtistData = {
  name: string;
  value: number;
};

export interface Genre {
  name: string;
  reason: string;
}

export interface MusicProfile {
  profile_summary: string;
  top_genres: Genre[];
}

export default function TracksStats() {
  const [musicProfile, setMusicProfile] = useState<MusicProfile | null>(null);
  const [tracksGenresData, setTracksGenresData] = useState<GenreData[]>([]);
  const [favoriteArtistsData, setFavoriteArtistsData] = useState<
    FavoriteArtistData[]
  >([]);
  const [topArtistsData, setTopArtistsData] = useState<ArtistData[]>([]);
  const [bottomArtistsData, setBottomArtistsData] = useState<ArtistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:8000/api/data/top-genres/",
      );
      const data = await response.json();
      setTracksGenresData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:8000/api/data/top-artists/",
      );
      const data = await response.json();
      setTopArtistsData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:8000/api/data/bottom-artists/",
      );
      const data = await response.json();
      setBottomArtistsData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:8000/api/data/favorite-artists/",
      );
      const data = await response.json();
      setFavoriteArtistsData(data);
    };
    fetchData();
  }, []);

  const generateMusicProifle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/profile/tracks/`,
      );
      const data = await response.json();
      setMusicProfile(data.MusicProfile as MusicProfile);
    } catch (err) {
      setError("Failed to fetch music profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexContainer>
      <ChartRadar
        title="Top Genres"
        description="Number of tracks per genre"
        footerText="Based on liked songs"
        data={tracksGenresData}
        labelKey="name"
        valueKey="value"
        color="var(--chart-4)"
      />

      <ChartPieInteractive
        id="most-popular-artists"
        title="Most Popular Artists"
        description="Top 10 artists based on Spotify followers"
        data={topArtistsData}
        labelKey="name"
        valueKey="followers"
      />

      <ChartPieInteractive
        id="bottom-artists"
        title="Least Popular Artists"
        description="Bottom 10 artists based on Spotify followers"
        data={bottomArtistsData}
        labelKey="name"
        valueKey="followers"
      />

      <ChartPieInteractive
        id="favorite-artists"
        title="Favorite Artists"
        description="Favorite artists based on liked singles"
        data={favoriteArtistsData}
        labelKey="name"
        valueKey="value"
      />

      <Card>
        <MusicProfile>
          {!musicProfile && !loading && (
            <Button onClick={generateMusicProifle}>Get Music Profile</Button>
          )}
          {loading && <ButtonLoading />}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {musicProfile && (
            <>
              <CenteredText>{musicProfile.profile_summary}</CenteredText>
            </>
          )}
        </MusicProfile>
      </Card>
      {musicProfile && (
        <Card>
          <CarouselContainer>
            <Carousel
              baseWidth={400}
              autoplay={false}
              autoplayDelay={3000}
              pauseOnHover={true}
              loop={true}
              round={true}
              items={musicProfile.top_genres.map((genre, idx) => ({
                id: idx,
                title: genre.name,
                description: genre.reason,
                icon: <MusicIcon className="w-5 h-5 text-muted-foreground" />,
              }))}
            />
          </CarouselContainer>
        </Card>
      )}
    </FlexContainer>
  );
}
