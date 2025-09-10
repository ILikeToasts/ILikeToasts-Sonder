import { fetcher } from "@/api/service";
import Carousel from "@/components/Common/Carousel";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { Card } from "@/components/ui/card";
import { ChartPieInteractive } from "@/components/ui/PieChart";
import { ChartRadar } from "@/components/ui/RadarChart";
import { API_ROUTES } from "@/constants/ApiRoutes";
import { FlexContainer } from "@/styles/common/Page.styles";
import { CenteredText } from "@/styles/global.styles";
import { CarouselContainer, MusicProfile } from "@/styles/Tracks/Tracks.styles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MusicIcon } from "lucide-react";

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
  const { data: topGenres } = useQuery<GenreData[]>({
    queryKey: ["top-genres"],
    queryFn: async () => fetcher<GenreData[]>(API_ROUTES.stats.topGenres),
  });

  const { data: topArtists } = useQuery<ArtistData[]>({
    queryKey: ["top-artists"],
    queryFn: async () => fetcher<ArtistData[]>(API_ROUTES.stats.topArtists),
  });

  const { data: bottomArtists } = useQuery<ArtistData[]>({
    queryKey: ["bottom-artists"],
    queryFn: async () => fetcher<ArtistData[]>(API_ROUTES.stats.bottomArtists),
  });

  const { data: favoriteArtists } = useQuery<FavoriteArtistData[]>({
    queryKey: ["favorite-artists"],
    queryFn: async () =>
      fetcher<FavoriteArtistData[]>(API_ROUTES.stats.favoriteArtists),
  });

  const {
    data: musicProfile,
    isPending,
    isError,
    error,
    mutate,
  } = useMutation<MusicProfile, Error, void>({
    mutationFn: async (): Promise<MusicProfile> => {
      const res = await fetch(API_ROUTES.llm.musicProfile);
      if (!res.ok) throw new Error("Failed to fetch music profile");
      const data = await res.json();
      return data.MusicProfile as MusicProfile;
    },
  });

  return (
    <FlexContainer>
      <ChartRadar
        title="Top Genres"
        description="Number of tracks per genre"
        footerText="Based on liked songs"
        data={topGenres ?? []}
        labelKey="name"
        valueKey="value"
        color="var(--chart-4)"
      />

      <ChartPieInteractive
        id="most-popular-artists"
        title="Most Popular Artists"
        description="Top 10 artists based on Spotify followers"
        data={topArtists ?? []}
        labelKey="name"
        valueKey="followers"
      />

      <ChartPieInteractive
        id="bottom-artists"
        title="Least Popular Artists"
        description="Bottom 10 artists based on Spotify followers"
        data={bottomArtists ?? []}
        labelKey="name"
        valueKey="followers"
      />

      <ChartPieInteractive
        id="favorite-artists"
        title="Favorite Artists"
        description="Favorite artists based on liked singles"
        data={favoriteArtists ?? []}
        labelKey="name"
        valueKey="value"
      />

      <Card>
        <MusicProfile>
          {!musicProfile && !isPending && (
            <Button onClick={() => mutate()}>Get Music Profile</Button>
          )}

          {isPending && <ButtonLoading />}

          {isError && <p style={{ color: "red" }}>{error?.message}</p>}

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
