import { useLocation } from 'react-router-dom';
import SpotifyAlbumEmbed from './SpotifyAlbumEmbed';

const AlbumReview: React.FC = () => {
  const location = useLocation();
  const album = location.state?.album;

  if (!album) {
    return <div>No album data found.</div>;
  }

  return (
    <div className='center-container'>
      <div className="reviewContainer">
        <SpotifyAlbumEmbed
          albumId={album.spotify_id}
          albumName={album.title}
        />
        <div className='reviewBox'>
          <h2 className='raleway-bold'>Album Review</h2>
          <div className='raleway-light'>
            <p>This is a placeholder for the album review content.</p>
            <p>More details about the album can be added here.</p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default AlbumReview;
