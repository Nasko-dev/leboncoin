import { useEffect, useState } from "react";
import {
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiBriefcase,
  FiCalendar,
  FiEdit2,
  FiGlobe,
  FiItalic,
  FiList,
  FiMail,
  FiMapPin,
  FiSave,
  FiUser,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { useUser } from "../../Context/UserContext";
import Navbar from "../../composants/NavBar/NavBar";
import Notification from "../../composants/Notification/Notification";
import "./Profil.css";

interface UserProfile {
  username: string;
  global_name: string;
  avatar: string | null;
  discord_id: string;
  bio: string;
  profession: string;
  age: number;
  site_web: string;
  localisation: string;
  email: string;
}

interface NotificationState {
  type: "success" | "error";
  message: string;
}

export default function Profil() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user?.discord_id) {
          throw new Error("Utilisateur non connecté");
        }

        const response = await fetch(
          `http://localhost:3310/api/user/${user.discord_id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du profil");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setNotification({
          type: "error",
          message: "Erreur lors du chargement du profil",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "age" ? Number.parseInt(value, 10) : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user?.discord_id) return;

    try {
      const response = await fetch(
        `http://localhost:3310/api/user/${user.discord_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(profile),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile.user);
      setIsEditing(false);
      setNotification({
        type: "success",
        message: "Profil mis à jour avec succès",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setNotification({
        type: "error",
        message: "Erreur lors de la mise à jour du profil",
      });
    }
  };

  const handleFormatText = (command: string) => {
    const textarea = document.getElementById("bio") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = profile?.bio.substring(start, end) || "";
    const beforeText = profile?.bio.substring(0, start) || "";
    const afterText = profile?.bio.substring(end) || "";

    let newText = "";
    switch (command) {
      case "bold":
        newText = `${beforeText}**${selectedText}**${afterText}`;
        break;
      case "italic":
        newText = `${beforeText}*${selectedText}*${afterText}`;
        break;
      case "bullet":
        newText = `${beforeText}\n- ${selectedText}${afterText}`;
        break;
      case "number":
        newText = `${beforeText}\n1. ${selectedText}${afterText}`;
        break;
      case "left":
        newText = `${beforeText}\n<div style="text-align: left;">${selectedText}</div>${afterText}`;
        break;
      case "center":
        newText = `${beforeText}\n<div style="text-align: center;">${selectedText}</div>${afterText}`;
        break;
      case "right":
        newText = `${beforeText}\n<div style="text-align: right;">${selectedText}</div>${afterText}`;
        break;
    }

    setProfile((prev) => (prev ? { ...prev, bio: newText } : null));

    // Restaurer le focus et la sélection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profil-container">
          <div className="profil-loading">Chargement...</div>
        </div>
      </>
    );
  }

  if (error || !profile || !user) {
    return (
      <>
        <Navbar />
        <div className="profil-container">
          <div className="profil-error">{error || "Profil non trouvé"}</div>
        </div>
      </>
    );
  }

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`
    : null;

  return (
    <>
      <Navbar />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="profil-container">
        {/* Sidebar */}
        <div className="profil-sidebar">
          <div className="profil-card">
            <div className="profil-avatar-container">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Avatar de ${profile.global_name || profile.username}`}
                  className="profil-avatar"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="profil-avatar-placeholder">
                  {profile.global_name?.[0] || profile.username[0]}
                </div>
              )}
            </div>
            <div className="profil-info">
              <h2>{profile.global_name || profile.username}</h2>
              <p className="profil-username">@{profile.username}</p>

              {profile.profession && (
                <div className="profil-detail">
                  <FiBriefcase className="icon" />
                  <span>{profile.profession}</span>
                </div>
              )}

              {profile.localisation && (
                <div className="profil-detail">
                  <FiMapPin className="icon" />
                  <span>{profile.localisation}</span>
                </div>
              )}

              {profile.age && (
                <div className="profil-detail">
                  <FiCalendar className="icon" />
                  <span>{profile.age} ans</span>
                </div>
              )}

              {profile.site_web && (
                <div className="profil-detail">
                  <FiGlobe className="icon" />
                  <a
                    href={profile.site_web}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.site_web}
                  </a>
                </div>
              )}

              {profile.email && (
                <div className="profil-detail">
                  <FiMail className="icon" />
                  <span>{profile.email}</span>
                </div>
              )}

              {profile.bio && (
                <div className="profil-bio">
                  <ReactMarkdown>{profile.bio}</ReactMarkdown>
                </div>
              )}

              <div className="profil-stats">
                <div className="stat-item">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Annonces</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">45</span>
                  <span className="stat-label">Candidatures</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">4.8</span>
                  <span className="stat-label">Note</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="profil-content">
          <div className="profil-header">
            <h1>Mon Profil</h1>
            <button
              type="button"
              className="edit-button"
              onClick={() => {
                if (isEditing) {
                  const form = document.getElementById(
                    "profil-form"
                  ) as HTMLFormElement;
                  form?.requestSubmit();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <>
                  <FiSave className="icon" />
                  Enregistrer
                </>
              ) : (
                <>
                  <FiEdit2 className="icon" />
                  Modifier
                </>
              )}
            </button>
          </div>

          <form
            id="profil-form"
            onSubmit={handleSubmit}
            className="profil-form"
          >
            <div className="form-section">
              <h2>Informations personnelles</h2>
              <div className="form-group">
                <label htmlFor="global_name">
                  <FiUser className="icon" />
                  Nom complet
                </label>
                <input
                  type="text"
                  id="global_name"
                  name="global_name"
                  value={profile.global_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profession">
                  <FiBriefcase className="icon" />
                  Profession
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={profile.profession}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">
                  <FiCalendar className="icon" />
                  Âge
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Contact</h2>
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail className="icon" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="localisation">
                  <FiMapPin className="icon" />
                  Localisation
                </label>
                <input
                  type="text"
                  id="localisation"
                  name="localisation"
                  value={profile.localisation}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="site_web">
                  <FiGlobe className="icon" />
                  Site web
                </label>
                <input
                  type="url"
                  id="site_web"
                  name="site_web"
                  value={profile.site_web}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>À propos</h2>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <div className="bio-editor">
                  <div className="bio-toolbar">
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleFormatText("bold")}
                      title="Gras"
                    >
                      <FiBold />
                    </button>
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleFormatText("italic")}
                      title="Italique"
                    >
                      <FiItalic />
                    </button>
                    <div className="toolbar-separator" />
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleFormatText("bullet")}
                      title="Liste à puces"
                    >
                      <FiList />
                    </button>
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleFormatText("number")}
                      title="Liste numérotée"
                    >
                      <FiList />
                    </button>
                    <div className="toolbar-separator" />
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleFormatText("left")}
                      title="Aligné à gauche"
                    >
                      <FiAlignLeft />
                    </button>
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleFormatText("center")}
                      title="Centré"
                    >
                      <FiAlignCenter />
                    </button>
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleFormatText("right")}
                      title="Aligné à droite"
                    >
                      <FiAlignRight />
                    </button>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Décrivez-vous, vos compétences, votre expérience..."
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
