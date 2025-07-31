import { AuroraBackground } from "@/components/ui/Aurora";
import LightRays from "@/components/ui/LightRays";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ReviewSubtitle } from "@/styles/common/Review.styles";
import {
  TitleContainer,
  ContainerLeft,
  ContainerRight,
} from "@/styles/Home/home.styles";

export default function HomePage() {
  return (
    <>
      <AuroraBackground>
        <LightRays
          raysOrigin="top-center"
          raysColor="#daabfa"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={2.5}
          fadeDistance={1.8}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </AuroraBackground>

      <TitleContainer>
        Sonder
        <ReviewSubtitle>"[son-der]"</ReviewSubtitle>
      </TitleContainer>

      <ContainerLeft>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={50}
          blurStrength={15}
        >
          noun. the realization that each random passerby is living a life as
          vivid and complex as your own
        </ScrollReveal>
      </ContainerLeft>

      <ContainerRight>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={50}
          blurStrength={15}
        >
          populated with their own ambitions, friends, routines, worries and
          inherited craziness
        </ScrollReveal>
      </ContainerRight>
    </>
  );
}
