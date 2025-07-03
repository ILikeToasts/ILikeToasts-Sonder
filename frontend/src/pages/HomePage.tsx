import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li><Link to="/album">Album</Link></li>
          <li><Link to="/games">Games</Link></li>
        </ul>
      </nav>
    </div>
  );
}