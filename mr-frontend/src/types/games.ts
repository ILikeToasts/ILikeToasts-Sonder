export interface Game {
  appID: number;
  name: string;
  image: string;
  description: string;
  website: string;
  developers: string[];
  publishers: string[];
  genres: GameGenre[];
  release_date: string;
}

export interface GameGenre {
  name: string;
}
