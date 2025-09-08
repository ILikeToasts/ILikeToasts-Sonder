import DOMPurify from "dompurify";

interface GameDescriptionProps {
  description: string;
}

export const GameDescription: React.FC<GameDescriptionProps> = ({
  description,
}) => {
  const cleanDescription = DOMPurify.sanitize(description);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanDescription }}
    />
  );
};
