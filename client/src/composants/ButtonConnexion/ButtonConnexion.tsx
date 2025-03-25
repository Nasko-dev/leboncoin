import { useEffect, useState } from "react";
import "./ButtonConnexion.css";

interface User {
  global_name: string;
  avatar: string;
  id: string;
  discord_id: string;
  username: string;
}

export default function ButtonConnexion() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:3310/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        console.info("Données utilisateur reçues:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setUser(null);
      });
  }, []);

  const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const REDIRECT_URI =
    import.meta.env.VITE_DISCORD_REDIRECT_URI ||
    "http://localhost:3310/auth/discord/callback";
  const SCOPE = "identify email guilds";
  const RESPONSE_TYPE = "code";

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI,
  )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;

  const handleConnexion = () => {
    window.location.href = discordAuthUrl;
  };

  const getAvatarUrl = (avatarHash: string) => {
    if (!avatarHash || !user)
      return "https://cdn.discordapp.com/embed/avatars/0.png";
    return `https://cdn.discordapp.com/avatars/${user.discord_id}/${avatarHash}.png`;
  };

  return (
    <div className="button-connexion-container">
      {user ? (
        <div className="user-info">
          <span className="username">{user.global_name}</span>
          <img
            src={getAvatarUrl(user.avatar)}
            alt={`Avatar de ${user.global_name}`}
            className="avatar"
            width={40}
            height={40}
          />
        </div>
      ) : (
        <button
          type="button"
          className="btn-connexion"
          onClick={handleConnexion}
        >
          Connexion
        </button>
      )}
    </div>
  );
}
