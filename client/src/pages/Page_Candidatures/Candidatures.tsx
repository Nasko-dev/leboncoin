import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiTag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import Navbar from "../../composants/NavBar/NavBar";
import "./Candidatures.css";

interface Candidature {
  id: number;
  annonce_id: number;
  user_id: string;
  portfolio: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  annonce: {
    title: string;
    price: number;
    duree: string;
    user_id: string;
  };
  candidat: {
    username: string;
    global_name: string;
    avatar: string | null;
    discord_id: string;
  };
}

interface User {
  discord_id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}

export default function Candidatures() {
  // Gestion de l'onglet actif
  const [activeTab, setActiveTab] = useState<
    "mes-candidatures" | "candidatures-reçues"
  >("mes-candidatures");
  // États séparés pour les candidatures envoyées et reçues
  const [sentCandidatures, setSentCandidatures] = useState<Candidature[]>([]);
  const [receivedCandidatures, setReceivedCandidatures] = useState<
    Candidature[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3310/api/me", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        setUser(userData);
        return userData;
      } catch (err) {
        setError("Vous devez être connecté pour voir vos candidatures");
        return null;
      }
    };

    const fetchCandidatures = async () => {
      try {
        setLoading(true);
        const userData = await fetchUser();
        if (!userData) return;

        // Récupérer les candidatures envoyées par l'utilisateur
        const sentResponse = await fetch(
          `http://localhost:3310/api/candidatures/user/${userData.discord_id}`,
          { credentials: "include" },
        );
        if (!sentResponse.ok) {
          throw new Error(`HTTP error! status: ${sentResponse.status}`);
        }
        const sentData = await sentResponse.json();
        setSentCandidatures(sentData);

        // Récupérer les candidatures reçues sur les annonces de l'utilisateur
        const receivedResponse = await fetch(
          `http://localhost:3310/api/candidatures/received/${userData.discord_id}`,
          { credentials: "include" },
        );
        if (!receivedResponse.ok) {
          throw new Error(`HTTP error! status: ${receivedResponse.status}`);
        }
        const receivedData = await receivedResponse.json();
        setReceivedCandidatures(receivedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, []);

  // Vérifie si le statut correspond à "en attente" (avec ou sans underscore)
  const isEnAttente = (status: string) =>
    status === "en_attente" || status === "en attente";

  const getStatusColor = (status: string) => {
    if (isEnAttente(status)) return "#fbbf24";
    if (status === "acceptée") return "#22c55e";
    if (status === "refusée") return "#ef4444";
    return "#6b7280";
  };

  const getStatusText = (status: string) => {
    if (isEnAttente(status)) return "En attente";
    if (status === "acceptée") return "Acceptée";
    if (status === "refusée") return "Refusée";
    return status;
  };

  const handleStatusUpdate = async (
    candidatureId: number,
    newStatus: string,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3310/api/candidatures/${candidatureId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Mise à jour locale des candidatures
      setSentCandidatures((prev) =>
        prev.map((c) =>
          c.id === candidatureId ? { ...c, status: newStatus } : c
        ),
      );
      setReceivedCandidatures((prev) =>
        prev.map((c) =>
          c.id === candidatureId ? { ...c, status: newStatus } : c
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleAccept = async (
    candidatureId: number,
    candidature: Candidature,
  ) => {
    try {
      // Mettre à jour le statut dans l'API principale
      const response = await fetch(
        `http://localhost:3310/api/candidatures/${candidatureId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "acceptée" }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Créer le salon Discord
      const discordResponse = await fetch(
        "http://localhost:3001/api/candidature",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "accepter",
            candidat: candidature.candidat.discord_id,
            annonce: candidature.annonce.title,
          }),
        },
      );

      if (!discordResponse.ok) {
        throw new Error("Erreur lors de la création du salon Discord");
      }

      // Mise à jour locale des candidatures
      setSentCandidatures((prev) =>
        prev.map((c) =>
          c.id === candidatureId ? { ...c, status: "acceptée" } : c
        ),
      );
      setReceivedCandidatures((prev) =>
        prev.map((c) =>
          c.id === candidatureId ? { ...c, status: "acceptée" } : c
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleReject = async (
    candidatureId: number,
    candidature: Candidature,
  ) => {
    try {
      // Mettre à jour le statut dans l'API principale
      const response = await fetch(
        `http://localhost:3310/api/candidatures/${candidatureId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "refusée" }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Notifier le refus via Discord
      const discordResponse = await fetch(
        "http://localhost:3001/api/candidature",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "refuser",
            candidat: candidature.candidat.discord_id,
            annonce: candidature.annonce.title,
          }),
        },
      );

      if (!discordResponse.ok) {
        throw new Error("Erreur lors de la notification Discord");
      }

      // Mise à jour locale des candidatures
      setSentCandidatures((prev) =>
        prev.map((c) =>
          c.id === candidatureId ? { ...c, status: "refusée" } : c,
        )
      );
      setReceivedCandidatures((prev) =>
        prev.map((c) =>
          c.id === candidatureId ? { ...c, status: "refusée" } : c
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  // Sélection des candidatures à afficher selon l'onglet actif
  let displayedCandidatures: Candidature[] = [];
  if (activeTab === "mes-candidatures") {
    displayedCandidatures = sentCandidatures;
  } else if (activeTab === "candidatures-reçues") {
    displayedCandidatures = receivedCandidatures;
  }

  const renderCandidatureCard = (candidature: Candidature) => (
    <div key={candidature.id} className="candidature-card">
      <div className="candidature-header">
        <div className="candidat-info">
          <div className="candidature-avatar-container">
            {candidature.candidat.avatar ? (
              <img
                src={`https://cdn.discordapp.com/avatars/${candidature.candidat.discord_id}/${candidature.candidat.avatar}.png`}
                alt={
                  candidature.candidat.global_name ||
                  candidature.candidat.username
                }
                className="candidature-avatar"
              />
            ) : (
              <div className="candidature-avatar-placeholder">
                {candidature.candidat.global_name?.[0] ||
                  candidature.candidat.username[0]}
              </div>
            )}
            <div className="candidature-verified-badge">
              <FiCheckCircle />
            </div>
          </div>
          <div className="candidat-details">
            <h3>
              {candidature.candidat.global_name ||
                candidature.candidat.username}
            </h3>
            {candidature.portfolio && (
              <a
                href={candidature.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-link"
              >
                Voir le portfolio
              </a>
            )}
          </div>
        </div>
        {/* Utilisation de la classe CSS définie pour le statut */}
        <div
          className={`candidature-status-badge status-${candidature.status.replace(
            " ",
            "_",
          )}`}
        >
          {getStatusText(candidature.status)}
        </div>
      </div>
      <div className="candidature-content">
        <h2>{candidature.annonce.title}</h2>
        <div className="candidature-meta">
          <div className="meta-item">
            <FiDollarSign className="icon" />
            <span>{candidature.annonce.price}€</span>
          </div>
          <div className="meta-item">
            <FiClock className="icon" />
            <span>{candidature.annonce.duree}</span>
          </div>
          <div className="meta-item">
            <FiTag className="icon" />
            <span>
              Postulé le {new Date(candidature.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="candidature-actions">
          {activeTab === "candidatures-reçues" &&
            isEnAttente(candidature.status) && (
              <>
                <button
                  type="button"
                  className="action-button accept"
                  onClick={() => handleAccept(candidature.id, candidature)}
                >
                  <FiCheckCircle className="icon" /> Accepter
                </button>
                <button
                  type="button"
                  className="action-button reject"
                  onClick={() => handleReject(candidature.id, candidature)}
                >
                  <FiX className="icon" /> Refuser
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="candidatures-container">
        <div className="candidatures-header">
          <h1>Gestion des Candidatures</h1>
          <p>Gérez vos candidatures et celles reçues pour vos annonces</p>
        </div>
        {loading && <p>Chargement des candidatures...</p>}
        {error && <p className="error">Erreur: {error}</p>}
        <div className="candidatures-tabs">
          <button
            type="button"
            className={`tab-button ${
              activeTab === "mes-candidatures" ? "active" : ""
            }`}
            onClick={() => setActiveTab("mes-candidatures")}
          >
            <FiBriefcase className="tab-icon" /> Mes Candidatures
          </button>
          <button
            type="button"
            className={`tab-button ${
              activeTab === "candidatures-reçues" ? "active" : ""
            }`}
            onClick={() => setActiveTab("candidatures-reçues")}
          >
            <FiUsers className="tab-icon" /> Candidatures Reçues
          </button>
        </div>
        <div className="candidatures-grid">
          {displayedCandidatures.length > 0 ? (
            displayedCandidatures.map(renderCandidatureCard)
          ) : (
            <p>Aucune candidature trouvée.</p>
          )}
        </div>
      </div>
    </>
  );
}
