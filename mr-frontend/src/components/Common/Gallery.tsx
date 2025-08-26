import { AlbumsContainer } from "@/styles/Album/albums.styles";
import { MediasContainer } from "@/styles/Media/media.styles";
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/album.css";
import "../../styles/global.css";
import TiltedCard from "./TiltedCard";

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

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => {
  const hasMediaItem = items.some(
    (item) => item.state?.serie || item.state?.anime || item.state?.movie,
  );

  const Container = hasMediaItem ? MediasContainer : AlbumsContainer;
  return (
    <Container>
      {items.map((item) => {
        const isSerie =
          item.state?.serie || item.state?.anime || item.state?.movie;
        const height = isSerie ? "750px" : "500px";
        const width = "500px";

        return (
          <Link key={item.id} to={item.linkTo} state={item.state}>
            <TiltedCard
              imageSrc={item.imageUrl || null}
              altText={item.title}
              captionText={item.title}
              containerHeight={height}
              containerWidth={width}
              imageHeight={height}
              imageWidth={width}
              rotateAmplitude={15}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            />
          </Link>
        );
      })}
    </Container>
  );
};

export default GalleryGrid;
