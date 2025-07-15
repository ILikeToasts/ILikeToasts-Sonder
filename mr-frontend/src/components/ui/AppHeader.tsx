import { Link } from "react-router-dom";
import "../../styles/header.css";
import { ModeToggle } from "../Common/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const Header: React.FC = () => {
  return (
    <div className="sidebar">
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 rounded border">
          Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/albums">Albums</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/artists">Artists</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/games">Games</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/movies">Movies</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/pictures">Pictures</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/series">Series</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/trips">Trips</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
