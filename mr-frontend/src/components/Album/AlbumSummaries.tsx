import {
  CarouselContainer,
  InformationSection,
  Secondbox,
} from "@/styles/common/Review.styles";
import type { SpotifyAlbum } from "@/types/spotify";
import { MusicIcon } from "lucide-react";
import Carousel from "../Common/Carousel";
import BlurText from "../ui/BlurText";

interface AlbumSummariesProps {
  album: SpotifyAlbum;
}

export const AlbumSummaries: React.FC<AlbumSummariesProps> = ({ album }) => {
  return (
    <InformationSection>
      <Secondbox>
        {album.wiki_summary != "No description available." ? (
          <CarouselContainer>
            <BlurText
              text="Album summary"
              delay={250}
              direction="top"
              className="text-4xl mb-8"
            />
            <Carousel
              baseWidth={600}
              autoplay={false}
              autoplayDelay={3000}
              pauseOnHover={true}
              loop={true}
              round={true}
              items={
                album.wiki_summary
                  ?.split(/\n\s*\n/)
                  .filter((p) => p.trim() !== "")
                  .map((paragraph, idx) => ({
                    id: idx,
                    title: `Summary (Part ${idx + 1})`,
                    description: paragraph.trim(),
                    icon: (
                      <MusicIcon className="w-5 h-5 text-muted-foreground" />
                    ),
                  })) || []
              }
            />
          </CarouselContainer>
        ) : (
          <></>
        )}

        <CarouselContainer>
          <BlurText
            text="Songs list"
            delay={300}
            direction="top"
            className="text-4xl mb-8 bold"
          />
          <Carousel
            baseWidth={600}
            autoplay={false}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={true}
            items={album.songs.map((song, idx) => ({
              id: idx,
              title: song.title,
              description: song.wiki_summary,
              icon: <MusicIcon className="w-5 h-5 text-muted-foreground" />,
            }))}
          />
        </CarouselContainer>
      </Secondbox>
    </InformationSection>
  );
};
