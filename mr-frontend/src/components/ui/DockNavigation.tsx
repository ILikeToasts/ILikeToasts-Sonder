import { useNavigate, useLocation } from "react-router-dom";
import {
  Album,
  Film,
  Gamepad2,
  Image,
  Map,
  Tv,
  Users,
  Disc3,
  BookOpenText,
} from "lucide-react";
import Dock from "./Dock";

export default function DockNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    { path: "/", label: "Home", icon: <BookOpenText size={20} /> },
    { path: "/albums", label: "Albums", icon: <Album size={20} /> },
    { path: "/artists", label: "Artists", icon: <Users size={20} /> },
    { path: "/tracks", label: "tracks", icon: <Disc3 size={20} /> },
    { path: "/games", label: "Games", icon: <Gamepad2 size={20} /> },
    { path: "/movies", label: "Movies", icon: <Film size={20} /> },
    { path: "/pictures", label: "Pictures", icon: <Image size={20} /> },
    { path: "/series", label: "Series", icon: <Tv size={20} /> },
    { path: "/trips", label: "Trips", icon: <Map size={20} /> },
  ];

  const items = dockItems.map((item) => ({
    icon: item.icon,
    label: item.label,
    onClick: () => navigate(item.path),
    className:
      location.pathname === item.path ? "border-white" : "border-transparent",
  }));

  return (
    <Dock
      items={items}
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50"
    />
  );
}
