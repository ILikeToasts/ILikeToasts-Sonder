import { ChartPieInteractive } from "@/components/ui/PieChart";
import { ChartRadar } from "@/components/ui/RadarChart";
import { FlexContainer } from "@/styles/common/Page.styles";
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

export default function TracksStats() {
  const [tracksGenresData, setTracksGenresData] = useState<GenreData[]>([]);
  const [favoriteArtistsData, setFavoriteArtistsData] = useState<
    FavoriteArtistData[]
  >([]);
  const [topArtistsData, setTopArtistsData] = useState<ArtistData[]>([]);
  const [bottomArtistsData, setBottomArtistsData] = useState<ArtistData[]>([]);

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
    </FlexContainer>
  );
}
