import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AlbumReview from "./components/Album/AlbumReview";
import ArtistReview from "./components/Artists/ArtistReview";
import { ThemeProvider } from "./components/Common/theme-provider";
import GameReview from "./components/Games/GameReview";
import MediaReview from "./components/Serie/MediaReview";
import TrackReview from "./components/Singles/TrackReview";
import Layout from "./layouts/Layout";
import Album from "./pages/AlbumsPage";
import Animes from "./pages/AnimesPage";
import Artists from "./pages/ArtistsPage";
import Games from "./pages/GamesPage";
import Home from "./pages/HomePage";
import Movies from "./pages/MoviesPages";
import Pictures from "./pages/PicturesPages";
import Series from "./pages/SeriesPages";
import Singles from "./pages/SinglesPage";
import TracksStats from "./pages/TracksStatsPage";
import YotubeReco from "./pages/YoutubeRecoPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/albums" element={<Album />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/singles" element={<Singles />} />
              <Route path="/games" element={<Games />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/pictures" element={<Pictures />} />
              <Route path="/series" element={<Series />} />
              <Route path="/animes" element={<Animes />} />
              <Route path="/youtubeReco" element={<YotubeReco />} />
              <Route path="/albums/:album_id" element={<AlbumReview />} />
              <Route path="/artists/:artist_id" element={<ArtistReview />} />
              <Route path="/singles/:single_id" element={<TrackReview />} />
              <Route path="/singles/stats" element={<TracksStats />} />
              <Route path="/series/:serie_id" element={<MediaReview />} />
              <Route path="/animes/:anime_id" element={<MediaReview />} />
              <Route path="/movies/:movie_id" element={<MediaReview />} />
              <Route path="/games/:appID" element={<GameReview />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
