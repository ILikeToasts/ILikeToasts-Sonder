import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AlbumReview from "./components/Album/AlbumReview";
import ArtistReview from "./components/Artists/ArtistReview";
import { ThemeProvider } from "./components/Common/theme-provider";
import Animes from "./components/Serie/Anime";
import TrackReview from "./components/Singles/TrackReview";
import Layout from "./layouts/Layout";
import Album from "./pages/AlbumsPage";
import Artists from "./pages/ArtistsPage";
import Games from "./pages/GamesPage";
import Home from "./pages/HomePage";
import Movies from "./pages/MoviesPages";
import Pictures from "./pages/PicturesPages";
import Series from "./pages/SeriesPages";
import Singles from "./pages/SinglesPage";
import TracksStats from "./pages/TracksStatsPage";
import Trips from "./pages/TripsPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<Album />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/tracks" element={<Singles />} />
            <Route path="/games" element={<Games />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/pictures" element={<Pictures />} />
            <Route path="/series" element={<Series />} />
            <Route path="/animes" element={<Animes />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/albums/:album_id" element={<AlbumReview />} />
            <Route path="/artists/:artist_id" element={<ArtistReview />} />
            <Route path="/tracks/:track_id" element={<TrackReview />} />
            <Route path="/tracks/stats" element={<TracksStats />} />
            <Route path="/series/:serie_id" element={<TrackReview />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
