import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiGlobe,
  FiMapPin,
  FiStar,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import Navbar from "../../composants/NavBar/NavBar";
import "./DeteilAnnonce.css";
import PostulerButton from "../../composants/PostulerButton/PostulerButton";

interface Annonce {
  id: number;
  title: string;
  description: string;
  price: number;
  duree: string;
  created_at: string;
  user: {
    username: string;
    global_name: string;
    avatar: string | null;
    discord_id: string;
  };
}

export default function DeteilAnnonce() {
  const { id } = useParams<{ id: string }>();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/annonces/${id}`,
        );
        if (!response.ok) {
          throw new Error("Annonce non trouvée");
        }
        const data = await response.json();
        setAnnonce(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="detail-annonce-container">
          <div className="detail-annonce-loading">Chargement...</div>
        </div>
      </>
    );
  }

  if (error || !annonce) {
    return (
      <>
        <Navbar />
        <div className="detail-annonce-container">
          <div className="detail-annonce-error">
            {error || "Annonce non trouvée"}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="detail-annonce-container">
        <div className="detail-annonce-content">
          {/* Sidebar avec les informations du vendeur */}
          <div className="detail-annonce-sidebar">
            <div className="user-card">
              <div className="user-header">
                <div className="detail-avatar-container">
                  {annonce.user.avatar ? (
                    <img
                      src={`https://cdn.discordapp.com/avatars/${annonce.user.discord_id}/${annonce.user.avatar}.png`}
                      alt={annonce.user.global_name || annonce.user.username}
                      className="detail-avatar"
                    />
                  ) : (
                    <div className="detail-avatar-placeholder">
                      {annonce.user.global_name?.[0] ||
                        annonce.user.username[0]}
                    </div>
                  )}
                  <div className="detail-verified-badge">
                    <FiCheckCircle />
                  </div>
                </div>
                <div className="user-info">
                  <h3>{annonce.user.global_name || annonce.user.username}</h3>
                </div>
              </div>

              <div className="user-stats">
                <div className="stat-item">
                  <FiStar className="icon" />
                  <span>4.8/5</span>
                </div>
                <div className="stat-item">
                  <FiUser className="icon" />
                  <span>Membre depuis 2023</span>
                </div>
                <div className="stat-item">
                  <FiMapPin className="icon" />
                  <span>France</span>
                </div>
                <div className="stat-item">
                  <FiGlobe className="icon" />
                  <span>Français</span>
                </div>
              </div>

              <div className="user-actions">
                <PostulerButton missionId={annonce.id.toString()} />
              </div>
            </div>

            <div className="info-card">
              <h3>Informations sur la mission</h3>
              <div className="info-item">
                <FiDollarSign className="icon" />
                <span>Budget: {annonce.price}€</span>
              </div>
              <div className="info-item">
                <FiClock className="icon" />
                <span>Durée: {annonce.duree} semaine</span>
              </div>
              <div className="info-item">
                <FiTag className="icon" />
                <span>
                  Publié le {new Date(annonce.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu principal de l'annonce */}
          <div className="detail-annonce-main">
            <div className="annonce-header">
              <h1>{annonce.title}</h1>
              <div className="annonce-meta">
                <div className="meta-item">
                  <FiDollarSign className="icon" />
                  <span>{annonce.price}€</span>
                </div>
                <div className="meta-item">
                  <FiClock className="icon" />
                  <span>{annonce.duree} semaine</span>
                </div>
                <div className="meta-item">
                  <FiTag className="icon" />
                  <span>
                    Publié le{" "}
                    {new Date(annonce.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="annonce-content">
              <div className="description-section">
                <h2>Description</h2>
                <p>{annonce.description}</p>
              </div>

              <div className="skills-section">
                <h2>Compétences requises</h2>
                <div className="skills-list">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">TypeScript</span>
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">MongoDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
