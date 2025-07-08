import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Album from './pages/AlbumsPage';
import Games from './pages/GamesPage';
import Movies from './pages/MoviesPages';
import Artists from './pages/ArtistsPage';
import Pictures from './pages/PicturesPages';
import Series from './pages/SeriesPages';
import Trips from './pages/TripsPage';
import AlbumReview from './components/Album/AlbumReview';
import Header from './components/ui/AppHeader';
import ArtistReview from './components/Artists/ArtistReview';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/albums" element={<Album />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/games" element={<Games />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/pictures" element={<Pictures />} />
        <Route path="/series" element={<Series />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/albums/:album_id" element={<AlbumReview />} />
        <Route path="/artists/:artist_id" element={<ArtistReview />} />
      </Routes>
    </Router>
  );
}

export default App;
