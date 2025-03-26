import { useEffect, useState } from "react";
import { FiClock, FiDollarSign, FiTag, FiUpload, FiUser } from "react-icons/fi";
import { useUser } from "../../Context/UserContext";
import Navbar from "../../composants/NavBar/NavBar";
import Notification from "../../composants/Notification/Notification";
import type { NotificationType } from "../../composants/Notification/Notification";
import "./UploadAnnonces.css";

interface Category {
  id: number;
  name: string;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: NotificationType;
}

export default function UploadAnnonces() {
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "info",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    category: "",
    skills: "",
  });

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.discord_id) {
      showNotification(
        "Vous devez être connecté pour publier une annonce",
        "error",
      );
      return;
    }

    if (!formData.title || !formData.description) {
      showNotification(
        "Le titre et la description sont obligatoires",
        "warning",
      );
      return;
    }

    const dataToSend = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: formData.budget ? Number.parseInt(formData.budget) : undefined,
      duree: formData.duration ? formData.duration.trim() : "Non spécifiée",
      user_id: user.discord_id,
      category: formData.category
        ? { id: Number.parseInt(formData.category) }
        : undefined,
      skills: formData.skills || undefined,
    };

    try {
      const response = await fetch("http://localhost:3310/api/annonces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de l'envoi de l'annonce",
        );
      }

      setFormData({
        title: "",
        description: "",
        budget: "",
        duration: "",
        category: "",
        skills: "",
      });
      showNotification("Votre annonce a été publiée avec succès !", "success");
    } catch (error) {
      showNotification(
        "Une erreur est survenue lors de la publication de l'annonce",
        "error",
      );
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3310/api/categories");
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navbar />
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
      <div className="upload-container">
        <div className="upload-header">
          <h1>Publier une annonce</h1>
          <p>
            Remplissez les informations ci-dessous pour publier votre mission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <div className="input-group">
              <label htmlFor="title">Titre de la mission</label>
              <input
                className="input-field"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Développeur React Senior"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description détaillée</label>
              <textarea
                className="input-field"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre projet, les compétences requises, etc."
                required
                rows={6}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="input-group">
              <label htmlFor="category">Catégorie</label>
              <div className="select-wrapper">
                <FiTag className="input-icon" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionnez une catégorie --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="budget">Budget (€/jour)</label>
              <div className="input-wrapper">
                <FiDollarSign className="input-icon" />
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Ex: 500"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="duration">Durée estimée</label>
              <div className="input-wrapper">
                <FiClock className="input-icon" />
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 3 semaines"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="skills">Compétences requises</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Ex: React, TypeScript, Node.js"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              <FiUpload className="button-icon" />
              Publier l'annonce
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
