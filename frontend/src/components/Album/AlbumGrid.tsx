import React from 'react';
import SpotifyAlbumEmbed from './SpotifyAlbumEmbed';

const albums = [
  { id: '3DQueEd1Ft9PHWgovDzPKh', name: 'Album 1' },
  { id: '1wNDOs0Zmqrm7dhgnneflC', name: 'Album 2' },
  { id: '3CCnGldVQ90c26aFATC1PW', name: 'Album 3' },
];

const AlbumGrid: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">My Album Reviews</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

export default AlbumGrid;
