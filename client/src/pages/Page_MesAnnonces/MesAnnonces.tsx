import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiStar, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import ModalEditAnnonce from "../../composants/ModalEditAnnonce/ModalEditAnnonce";
import Navbar from "../../composants/NavBar/NavBar";
import "./MesAnnonces.css";

interface Annonce {
  id: number;
  title: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  status: "active" | "pending" | "sold";
  created_at: string;
  user: {
    username: string;
    global_name: string;
    avatar: string | null;
    discord_id: string;
  };
}

export default function MesAnnonces() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnonces = async () => {
      if (!user?.discord_id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3310/api/annonces/user/${user.discord_id}`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des annonces");
        }
        const data = await response.json();
        setAnnonces(data);
        console.info("Annonces récupérées:", data);
      } catch (error) {
        console.error("Erreur lors du chargement des annonces:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnonces();
  }, [user?.discord_id]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      try {
        // TODO: Remplacer par l'appel API réel
        setAnnonces(annonces.filter((annonce) => annonce.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const getAvatarUrl = (user: Annonce["user"]) => {
    if (!user?.avatar) return "https://cdn.discordapp.com/embed/avatars/0.png";
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.${ext}`;
  };

  const handleEdit = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (updatedAnnonce: Partial<Annonce>) => {
    try {
      const response = await fetch(
        `http://localhost:3310/api/annonces/${updatedAnnonce.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAnnonce),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la modification de l'annonce");
      }

      const updatedData = await response.json();
      setAnnonces(
        annonces.map((annonce) =>
          annonce.id === updatedData.id ? updatedData : annonce,
        ),
      );
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      throw error;
    }
  };

  if (!user) {
    return (
      <div className="mes-annonces-container">
        <Navbar />
        <div className="error-message">
          <p>Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mes-annonces-container">
      <Navbar />
      <div className="header-section">
        <h1>Mes Annonces</h1>
        <p className="subtitle">
          Gérez toutes vos annonces en un seul endroit. Modifiez, supprimez ou
          créez de nouvelles annonces pour trouver le freelance idéal.
        </p>
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-number">{annonces.length}</div>
            <div className="stat-label">Annonces totales</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {annonces.filter((a) => a.status === "active").length}
            </div>
            <div className="stat-label">Annonces actives</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {annonces.filter((a) => a.status === "pending").length}
            </div>
            <div className="stat-label">En attente</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Chargement de vos annonces...</p>
        </div>
      ) : (
        <div className="annonces-grid">
          {annonces.map((annonce) => (
            <div
              key={annonce.id}
              className="annonce-card"
              onClick={() => navigate(`/annonces/${annonce.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/annonces/${annonce.id}`);
                }
              }}
            >
              <div className="user-header">
                <div className="user-info">
                  <div className="avatar-container">
                    <img
                      src={getAvatarUrl(annonce.user)}
                      alt={`Avatar de ${
                        annonce.user?.global_name ||
                        annonce.user?.username ||
                        "Utilisateur"
                      }`}
                      className="avatar"
                    />
                    <div className="verified-badge">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>Badge de vérification</title>
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="user-details">
                    <h3>
                      {annonce.user?.global_name ||
                        annonce.user?.username ||
                        "Utilisateur"}
                    </h3>
                    <div className="user-stats">
                      <div className="rating">
                        <FiStar />
                        4.8
                      </div>
                      <div className="missions">Nouveau client</div>
                    </div>
                  </div>
                </div>
                <div className="category-badge">{annonce.category?.name}</div>
              </div>
              <div className="annonce-content">
                <h2>{annonce.title}</h2>
                <p className="description">{annonce.description}</p>
                <div className="annonce-details">
                  <span className="budget">{annonce.price}</span>
                  <span className="duree">
                    Publié le{" "}
                    {new Date(annonce.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="annonce-actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEdit(annonce)}
                  >
                    <FiEdit2 /> Modifier
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(annonce.id)}
                  >
                    <FiTrash2 /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/upload-annonces")}
        className="create-button"
      >
        <FiPlus /> Nouvelle Annonce
      </button>

      <ModalEditAnnonce
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAnnonce(null);
        }}
        annonce={selectedAnnonce}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
