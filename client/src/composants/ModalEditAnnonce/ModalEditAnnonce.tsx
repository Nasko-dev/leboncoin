import { useEffect, useState } from "react";
import { FiSave, FiX, FiXCircle } from "react-icons/fi";
import "./ModalEditAnnonce.css";

interface Category {
  id: number;
  name: string;
}

interface Annonce {
  id: number;
  title: string;
  description: string;
  price: number;
  category_id?: number;
  category: Category;
  status: "active" | "pending" | "sold";
  created_at: string;
  user: {
    username: string;
    global_name: string;
    avatar: string | null;
    discord_id: string;
  };
}

interface ModalEditAnnonceProps {
  isOpen: boolean;
  onClose: () => void;
  annonce: Annonce | null;
  onSave: (updatedAnnonce: Partial<Annonce>) => Promise<void>;
}

export default function ModalEditAnnonce({
  isOpen,
  onClose,
  annonce,
  onSave,
}: ModalEditAnnonceProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    status: "active",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (annonce) {
      setFormData({
        title: annonce.title,
        description: annonce.description,
        price: annonce.price.toString(),
        category_id: annonce.category_id?.toString() || "",
        status: annonce.status,
      });
    }
  }, [annonce]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3310/api/categories");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des catégories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSave({
        id: annonce?.id,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category_id: Number(formData.category_id),
        status: formData.status as "active" | "pending" | "sold",
      });
      onClose();
    } catch (err) {
      setError("Une erreur est survenue lors de la modification de l'annonce");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <button
      type="button"
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Modifier l'annonce</h2>
          <button type="button" className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Prix (€)</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
            >
              <option value="active">Active</option>
              <option value="pending">En attente</option>
              <option value="sold">Vendue</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              <FiXCircle /> {error}
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button type="submit" className="save-button" disabled={isLoading}>
              <FiSave /> {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </button>
  );
}
