import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiTwitter,
  FiClock,
  FiGithub,
  FiHeart,
} from "react-icons/fi";
import "./Acceil.css";
import { useNavigate } from "react-router-dom";
import TypewriterText from "../../composants/Annimation/TypewriterText/TypewriterText";
import Navbar from "../../composants/NavBar/NavBar";

export default function Acceil() {
  const navigate = useNavigate();

  return (
    <div className="modern-landing">
      <div className="neon-lines">
        <div className="neon-line" />
        <div className="neon-line" />
        <div className="neon-line" />
        <div className="neon-line" />
        <div className="neon-line" />
      </div>
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
            <button
              type="button"
              className="glass-button primary"
              onClick={() => navigate("/annonces")}
            >
              Voir les missions
              <FiArrowRight />
            </button>
            <button
              type="button"
              className="glass-button secondary"
              onClick={() => navigate("/profil")}
            >
              Créer un profil
            </button>
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
              company: "TechCorp",
              location: "Paris",
              rating: 4.8,
            },
            {
              title: "UI/UX Designer",
              category: "Design",
              budget: "500€/jour",
              duration: "3 mois",
              skills: ["Figma", "Adobe XD", "Prototyping"],
              company: "DesignStudio",
              location: "Lyon",
              rating: 4.9,
            },
            {
              title: "Chef de Projet Digital",
              category: "Management",
              budget: "700€/jour",
              duration: "12 mois",
              skills: ["Agile", "Scrum", "Leadership"],
              company: "DigitalPro",
              location: "Bordeaux",
              rating: 4.7,
            },
          ].map((mission) => (
            <div key={mission.title} className="glass-card mission-card">
              <div className="card-content">
                <div className="card-header">
                  <h3>{mission.title}</h3>
                  <div className="company-info">
                    <span className="company-name">{mission.company}</span>
                    <div className="rating">
                      <FiStar />
                      <span>{mission.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="card-category">{mission.category}</div>
                <div className="location">
                  <FiMapPin />
                  <span>{mission.location}</span>
                </div>
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
                <button
                  type="button"
                  className="card-button"
                  onClick={() => navigate(`/annonces/${mission.id}`)}
                >
                  Voir la mission
                  <FiArrowRight />
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
                <div className="feature-icon">
                  <FiShield />
                </div>
                <div className="feature-text">
                  <h4>Paiements Sécurisés</h4>
                  <p>Garantie de paiement pour chaque mission</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FiClock />
                </div>
                <div className="feature-text">
                  <h4>Processus Rapide</h4>
                  <p>Trouvez la mission parfaite en quelques clics</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FiCheckCircle />
                </div>
                <div className="feature-text">
                  <h4>Talents Vérifiés</h4>
                  <p>Une communauté de professionnels d'élite</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FiTrendingUp />
                </div>
                <div className="feature-text">
                  <h4>Croissance Continue</h4>
                  <p>Évoluez dans votre carrière freelance</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="image-container">
              <img src="/images/about-team.jpg" alt="Équipe LeBonFreelance" />
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">Ce qu'ils disent de nous</h2>
        <div className="testimonials-grid">
          {[
            {
              name: "Marie Laurent",
              role: "Freelance Designer",
              image: "/images/testimonial-1.jpg",
              text: "LeBonFreelance m'a permis de trouver des projets passionnants et de développer mon portfolio.",
              rating: 5,
            },
            {
              name: "Thomas Dubois",
              role: "Client",
              image: "/images/testimonial-2.jpg",
              text: "Une plateforme exceptionnelle qui nous a permis de trouver le talent parfait pour notre projet.",
              rating: 5,
            },
            {
              name: "Sophie Martin",
              role: "Freelance Developer",
              image: "/images/testimonial-3.jpg",
              text: "La meilleure plateforme pour les freelances en France. Je la recommande vivement !",
              rating: 5,
            },
          ].map((testimonial) => (
            <div key={testimonial.name} className="testimonial-card">
              <div className="testimonial-content">
                <FiHeart className="testimonial-icon" />
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_) => (
                    <FiStar key={_} />
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à commencer votre aventure freelance ?</h2>
          <p>
            Rejoignez notre communauté de talents et trouvez votre prochaine
            mission
          </p>
          <button
            type="button"
            className="glass-button primary"
            onClick={() => navigate("/register")}
          >
            Créer un compte
          </button>
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
              <a href="#testimonials">Témoignages</a>
            </div>
            <div className="footer-section">
              <h4>Ressources</h4>
              <a href="#blog">Blog</a>
              <a href="#guides">Guides</a>
              <a href="#support">Support</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-section">
              <h4>Légal</h4>
              <a href="#privacy">Confidentialité</a>
              <a href="#terms">Conditions</a>
              <a href="#cookies">Cookies</a>
              <a href="#contact">Contact</a>
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
