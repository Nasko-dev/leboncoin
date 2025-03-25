import ButtonConnexion from "../ButtonConnexion/ButtonConnexion";
import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="glass-nav">
        <div className="nav-logo">
          <Link to="/">LeBonFreelance</Link>
        </div>
        <div className="nav-links">
          <Link to="/annonces">Missions</Link>
          <Link to="/upload-annonces">Publier une mission</Link>
          <a href="#talents">Talents</a>
          <a href="#about">À propos</a>
          <div className="nav-cta">
            <ButtonConnexion />
          </div>
        </div>
      </nav>
    </>
  );
}
