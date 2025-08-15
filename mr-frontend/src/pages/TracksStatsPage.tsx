import { ChartPieInteractive } from "@/components/ui/PieChart";
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

export default function TracksStats() {
  const [tracksGenresData, setTracksGenresData] = useState<GenreData[]>([]);
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

  return (
    <FlexContainer>
      <ChartPieInteractive
        id="top-genres"
        title="Top Genres"
        description="Top 10 genres from favorite songs"
        data={tracksGenresData}
        labelKey="name"
        valueKey="value"
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
        id="bottom-genres"
        title="Least Popular Artists"
        description="Bottom 10 artists based on Spotify followers"
        data={bottomArtistsData}
        labelKey="name"
        valueKey="followers"
      />
    </FlexContainer>
  );
}
