import { FiSend, FiX } from "react-icons/fi";
import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import Notification from "../Notification/Notification";
import "./PostulerButton.css";

interface PostulerButtonProps {
  missionId: string;
}

interface NotificationState {
  type: "success" | "error";
  message: string;
}

export default function PostulerButton({ missionId }: PostulerButtonProps) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.discord_id) {
      setNotification({
        type: "error",
        message: "Vous devez être connecté pour postuler",
      });
      return;
    }

    if (!portfolioUrl) {
      setNotification({
        type: "error",
        message: "Veuillez fournir un lien vers votre portfolio",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3310/api/candidatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          annonce_id: missionId,
          portfolio: portfolioUrl,
          user_id: user.discord_id,
          status: "en attente",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Erreur lors de l'envoi de la candidature",
        );
      }

      setNotification({
        type: "success",
        message: "Votre candidature a été envoyée avec succès !",
      });
      setIsModalOpen(false);
      setPortfolioUrl("");
    } catch (error) {
      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'envoi de votre candidature",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <button
        type="button"
        className="postuler-button"
        onClick={() => setIsModalOpen(true)}
      >
        Postuler
      </button>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsModalOpen(false);
              }
            }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              <FiX />
            </button>
            <h2>Postuler à la mission</h2>
            <form onSubmit={handleSubmit} className="postuler-form">
              <div className="form-group">
                <label htmlFor="portfolio">Lien de votre portfolio</label>
                <input
                  type="url"
                  id="portfolio"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://votre-portfolio.com"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || !portfolioUrl}
                >
                  <FiSend className="icon" />
                  {loading ? "Envoi en cours..." : "Envoyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
