export interface Game {
  appID: number;
  name: string;
  image: string;
  description: string;
  website: string;
  developers: Developer[];
  publishers: Publisher[];
  genres: GameGenre[];
  release_date: string;
}

export interface GameGenre {
  name: string;
}

export interface Developer {
  name: string;
}

export interface Publisher {
  name: string;
}
