import {
  FiArrowRight,
  FiAward,
  FiBriefcase,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiStar,
  FiTwitter,
  FiUser,
} from "react-icons/fi";
import "./Acceil.css";
import TypewriterText from "../../composants/Annimation/TypewriterText/TypewriterText";
import Navbar from "../../composants/NavBar/NavBar";
export default function Acceil() {
  return (
    <div className="modern-landing">
      <Navbar />
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <FiAward /> Plateforme Leader en France
          </div>
          <h1 className="glowing-text">
            Bienvenue dans le Futur
            <br />
            du Freelancing
          </h1>
          <div className="typing-container">
            <span className="typing-text">
              <TypewriterText />
            </span>
          </div>
          <div className="hero-buttons">
            <button type="button" className="glass-button primary">
              Commencer <FiArrowRight />
            </button>
            <button type="button" className="glass-button secondary">
              En savoir plus
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <FiUser className="stat-icon" />
            <div className="stat-number">50K+</div>
            <div className="stat-label">Freelances</div>
          </div>
          <div className="stat-card">
            <FiBriefcase className="stat-icon" />
            <div className="stat-number">15K+</div>
            <div className="stat-label">Missions</div>
          </div>
          <div className="stat-card">
            <FiStar className="stat-icon" />
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Missions en Vedette</h2>
        <div className="featured-grid">
          {[
            {
              title: "Développeur React Senior",
              category: "Développement Web",
              budget: "600€/jour",
              duration: "6 mois",
              skills: ["React", "TypeScript", "Node.js"],
            },
            {
              title: "UI/UX Designer",
              category: "Design",
              budget: "500€/jour",
              duration: "3 mois",
              skills: ["Figma", "Adobe XD", "Prototyping"],
            },
            {
              title: "Chef de Projet Digital",
              category: "Management",
              budget: "700€/jour",
              duration: "12 mois",
              skills: ["Agile", "Scrum", "Leadership"],
            },
          ].map((mission) => (
            <div key={mission.title} className="glass-card mission-card">
              <div className="card-content">
                <h3>{mission.title}</h3>
                <div className="card-category">{mission.category}</div>
                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">{mission.budget}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Durée</span>
                    <span className="detail-value">{mission.duration}</span>
                  </div>
                </div>
                <div className="skill-tags">
                  {mission.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
                <button type="button" className="card-button">
                  Voir la mission <FiArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">Pourquoi Nous Choisir ?</h2>
            <p className="about-description">
              Notre plateforme connecte les meilleurs talents freelance avec des
              projets innovants. Nous garantissons une expérience transparente,
              sécurisée et professionnelle pour tous nos utilisateurs.
            </p>
            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <div className="feature-text">
                  <h4>Processus Simplifié</h4>
                  <p>Trouvez la mission parfaite en quelques clics</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛡️</div>
                <div className="feature-text">
                  <h4>Paiements Sécurisés</h4>
                  <p>Garantie de paiement pour chaque mission</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💎</div>
                <div className="feature-text">
                  <h4>Talents Vérifiés</h4>
                  <p>Une communauté de professionnels d'élite</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="image-container">
              <img src="/path/to/about-image.jpg" alt="Équipe LeBonFreelance" />
            </div>
          </div>
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">LeBonFreelance</div>
            <p>Le futur du travail, aujourd'hui.</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Explorer</h4>
              <a href="#missions">Missions</a>
              <a href="#talents">Talents</a>
              <a href="#about">À propos</a>
            </div>
            <div className="footer-section">
              <h4>Ressources</h4>
              <a href="#blog">Blog</a>
              <a href="#guides">Guides</a>
              <a href="#support">Support</a>
            </div>
            <div className="footer-section">
              <h4>Légal</h4>
              <a href="#privacy">Confidentialité</a>
              <a href="#terms">Conditions</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
          <div className="footer-social">
            <h4>Suivez-nous</h4>
            <div className="social-icons">
              <a href="#linkedin" className="social-icon">
                <FiLinkedin />
              </a>
              <a href="#twitter" className="social-icon">
                <FiTwitter />
              </a>
              <a href="#github" className="social-icon">
                <FiGithub />
              </a>
              <a href="#contact" className="social-icon">
                <FiMail />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 LeBonFreelance. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
