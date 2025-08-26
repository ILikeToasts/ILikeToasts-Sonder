export interface TVShowGenre {
  name: string;
}

export interface ProductionCompany {
  name: string;
}

export interface TVShow {
  id: number;
  title: string;
  episode_run_time: number;
  first_air_date: string;
  in_production: boolean;
  origin_country: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_url: string;
  seasons: number;
  vote_average: number;
  vote_count: number;
  last_synced: string;
  genres: TVShowGenre[];
  production_companies: ProductionCompany[];
}

export interface Movie {
  id: number;
  title: string;
  runtime: number;
  release_date: string;
  origin_country: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_url: string;
  vote_average: number;
  vote_count: number;
  last_synced: string;
  genres: TVShowGenre[];
  production_companies: ProductionCompany[];
}
