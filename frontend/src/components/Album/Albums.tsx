import React from 'react';
import SpotifyAlbumEmbed from './SpotifyAlbumEmbed';
import '../../styles/album.css';
import '../../styles/global.css';

const albums = [
  { id: '3DQueEd1Ft9PHWgovDzPKh', name: 'Album 1' },
  { id: '1wNDOs0Zmqrm7dhgnneflC', name: 'Album 2' },
  { id: '3CCnGldVQ90c26aFATC1PW', name: 'Album 3' },
];

const Albums: React.FC = () => {
  return (
    <div>
        <div className="albumContainer">
            {albums.map((album) => (
            <SpotifyAlbumEmbed
                key={album.id}
                albumId={album.id}
                albumName={album.name}
            />
            ))}
        </div>
    </div>
  );
};

export default Albums;
