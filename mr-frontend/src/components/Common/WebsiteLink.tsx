export const WebsiteLink: React.FC<{ url: string }> = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      {url}
    </a>
  );
};
