import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/album.css';
import '../../styles/global.css';

export interface GalleryItem {
  id: string | number;
  title: string;
  imageUrl?: string;
  linkTo: string;
  state?: any;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => {
  return (
    <div className="albumContainer">
      {items.map((item) => (
        <Link key={item.id} to={item.linkTo} state={item.state}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="album"
          />
        </Link>
      ))}
    </div>
  );
};

export default GalleryGrid;
