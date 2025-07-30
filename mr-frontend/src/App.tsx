import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Singles from "./pages/SinglesPage";
import Home from "./pages/HomePage";
import Album from "./pages/AlbumsPage";
import Games from "./pages/GamesPage";
import Movies from "./pages/MoviesPages";
import Artists from "./pages/ArtistsPage";
import Pictures from "./pages/PicturesPages";
import Series from "./pages/SeriesPages";
import Trips from "./pages/TripsPage";
import AlbumReview from "./components/Album/AlbumReview";
import ArtistReview from "./components/Artists/ArtistReview";
import { ThemeProvider } from "./components/Common/theme-provider";
import Layout from "./layouts/Layout";

function App() {
  return (
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
            <Route path="/trips" element={<Trips />} />
            <Route path="/albums/:album_id" element={<AlbumReview />} />
            <Route path="/artists/:artist_id" element={<ArtistReview />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
