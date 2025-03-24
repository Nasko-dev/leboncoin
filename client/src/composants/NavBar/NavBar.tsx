import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="glass-nav">
        <div className="nav-logo">LeBonFreelance</div>
        <div className="nav-links">
          <Link to="/annonces">Missions</Link>
          <a href="#talents">Talents</a>
          <a href="#about">À propos</a>
          <button type="button" className="nav-cta">
            Connexion
          </button>
        </div>
      </nav>
    </>
  );
}
