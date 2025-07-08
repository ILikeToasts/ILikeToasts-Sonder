import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Twirl as Hamburger } from "hamburger-react";
import "../../styles/header.css";

const Header: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="sidebar">
      <div className="hamburger-container">
        <Hamburger toggled={isOpen} toggle={setOpen} />
      </div>

      {isOpen && (
        <nav className="sidebar-menu">
          <ul>
            <li>
              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/albums" onClick={() => setOpen(false)}>
                Album
              </Link>
            </li>
            <li>
              <Link to="/artists" onClick={() => setOpen(false)}>
                Artists
              </Link>
            </li>
            <li>
              <Link to="/games" onClick={() => setOpen(false)}>
                Games
              </Link>
            </li>
            <li>
              <Link to="/movies" onClick={() => setOpen(false)}>
                Movies
              </Link>
            </li>
            <li>
              <Link to="/pictures" onClick={() => setOpen(false)}>
                Pictures
              </Link>
            </li>
            <li>
              <Link to="/series" onClick={() => setOpen(false)}>
                Series
              </Link>
            </li>
            <li>
              <Link to="/trips" onClick={() => setOpen(false)}>
                Trips
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;
