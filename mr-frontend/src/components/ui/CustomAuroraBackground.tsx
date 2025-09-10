import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";
import Aurora, { AuroraBackground, AuroraBottom } from "./Aurora";

interface CustomAuroraBackgroundProps {
  imageUrl: string;
}

export const CustomAuroraBackground: React.FC<CustomAuroraBackgroundProps> = ({
  imageUrl,
}) => {
  const [auroraColors, setAuroraColors] = useState<string[]>([]);

  useEffect(() => {
    if (!imageUrl) return;

    const fetchColors = async () => {
      try {
        const palette = await Vibrant.from(imageUrl).getPalette();
        const selectedColors = [
          palette.Vibrant?.hex,
          palette.DarkMuted?.hex,
          palette.DarkVibrant?.hex,
        ].filter(Boolean) as string[];

        setAuroraColors(selectedColors);
      } catch (err) {
        console.error("Failed to extract colors", err);
        setAuroraColors(["#3A29FF", "#FF94B4", "#FF3232"]);
      }
    };
    fetchColors();
  }, [imageUrl]);

  return (
    <>
      <AuroraBackground>
        <Aurora colorStops={auroraColors} blend={1} amplitude={1} speed={1} />
      </AuroraBackground>
      <AuroraBottom>
        <Aurora colorStops={auroraColors} blend={1} amplitude={0.5} speed={1} />
      </AuroraBottom>
    </>
  );
};
