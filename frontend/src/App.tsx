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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album" element={<Album />} />
        <Route path="/artist" element={<Artists />} />
        <Route path="/games" element={<Games />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/pictures" element={<Pictures />} />
        <Route path="/series" element={<Series />} />
        <Route path="/trips" element={<Trips />} />
      </Routes>
    </Router>
  );
}

export default App;
