import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarFilter from "../SidebarFilter/SidebarFilter";
import "./Annonces.css";

interface Annonce {
  id: number;
  title: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
  };
  user: {
    username: string;
    global_name: string;
    avatar: string | null;
    discord_id: string;
  };
}

export default function Annonces() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const url = new URL("http://localhost:3310/api/annonces");
        if (categoryFilter) {
          url.searchParams.append("category", categoryFilter);
        }
        const response = await fetch(url.toString());
        const data = await response.json();
        setAnnonces(data);
      } catch (err) {
        console.error("Erreur lors du chargement des annonces :", err);
      }
    };

    fetchAnnonces();
  }, [categoryFilter]);

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const getAvatarUrl = (user: Annonce["user"] | undefined) => {
    if (!user?.avatar) return "https://cdn.discordapp.com/embed/avatars/0.png";
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.${ext}`;
  };

  const handleVoirPlus = (id: number) => {
    navigate(`/annonces/${id}`);
  };

  const filteredAnnonces = annonces.filter((annonce) => {
    const matchesSearch =
      annonce.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      annonce.description.toLowerCase().includes(searchValue.toLowerCase());

    const matchesMinPrice = !minPrice || annonce.price >= minPrice;
    const matchesMaxPrice = !maxPrice || annonce.price <= maxPrice;

    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="Tableaux-Annonces">
      <div className="header-section">
        <h1>Vous recherchez une mission ?</h1>
        <p className="subtitle">
          Découvrez des milliers d'opportunités postées par des clients
          vérifiés. Trouvez la mission qui correspond à vos compétences et à vos
          attentes.
        </p>
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Missions actives</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">120+</div>
            <div className="stat-label">Freelances</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Clients satisfaits</div>
          </div>
        </div>
      </div>
      <SidebarFilter
        onSearch={handleSearch}
        onPriceChange={handlePriceChange}
        onCategoryChange={(categoryId) => setCategoryFilter(categoryId)}
        onExperienceChange={() => {}}
        onReset={() => setSearchValue("")}
      />
      <div className="annonces">
        {filteredAnnonces.map((annonce) => {
          return (
            <div className="annonce-card" key={annonce.id}>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <title>Note moyenne</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        4.8
                      </div>
                      <div className="missions">Nouveau client</div>
                    </div>
                  </div>
                </div>
                <div className="category-badge">
                  {annonce.category?.name || "Sans catégorie"}
                </div>
              </div>
              <div className="annonce-content">
                <h2>{annonce.title}</h2>
                <p className="description">{annonce.description}</p>
                <div className="annonce-details">
                  <span className="budget">{annonce.price}€</span>
                  <span className="duree">
                    Publié le{" "}
                    {new Date(annonce.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  type="button"
                  className="voir-plus"
                  onClick={() => handleVoirPlus(annonce.id)}
                >
                  Voir plus
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
