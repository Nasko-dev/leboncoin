import "./Annonces.css";

export default function Annonces() {
  const FakeAnnonces = [
    {
      id: 1,
      title: "Développeur Frontend React",
      description:
        "Recherche développeur React expérimenté pour un projet e-commerce. Stack : React, TypeScript, TailwindCSS",
      price: 500,
      duree: "2 semaines",
      user: {
        name: "Thomas Martin",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
        rating: 4.8,
        missions: 24,
        verified: true,
      },
      category: "Développement",
    },
    {
      id: 2,
      title: "Designer UI/UX",
      description:
        "Besoin d'un designer pour créer l'interface d'une application mobile. Design moderne et épuré requis.",
      price: 800,
      duree: "3 semaines",
      user: {
        name: "Sophie Bernard",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
        rating: 4.9,
        missions: 36,
        verified: true,
      },
      category: "Design",
    },
    {
      id: 3,
      title: "Rédacteur Web",
      description:
        "Recherche rédacteur pour créer du contenu SEO pour notre blog tech. Expérience en rédaction technique appréciée.",
      price: 300,
      duree: "1 semaine",
      user: {
        name: "Lucas Dubois",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3",
        rating: 4.6,
        missions: 18,
        verified: false,
      },
      category: "Rédaction",
    },
    {
      id: 1,
      title: "Développeur Frontend React",
      description:
        "Recherche développeur React expérimenté pour un projet e-commerce. Stack : React, TypeScript, TailwindCSS",
      price: 500,
      duree: "2 semaines",
      user: {
        name: "Thomas Martin",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
        rating: 4.8,
        missions: 24,
        verified: true,
      },
      category: "Développement",
    },
    {
      id: 2,
      title: "Designer UI/UX",
      description:
        "Besoin d'un designer pour créer l'interface d'une application mobile. Design moderne et épuré requis.",
      price: 800,
      duree: "3 semaines",
      user: {
        name: "Sophie Bernard",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
        rating: 4.9,
        missions: 36,
        verified: true,
      },
      category: "Design",
    },
    {
      id: 3,
      title: "Rédacteur Web",
      description:
        "Recherche rédacteur pour créer du contenu SEO pour notre blog tech. Expérience en rédaction technique appréciée.",
      price: 300,
      duree: "1 semaine",
      user: {
        name: "Lucas Dubois",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3",
        rating: 4.6,
        missions: 18,
        verified: false,
      },
      category: "Rédaction",
    },
    {
      id: 1,
      title: "Développeur Frontend React",
      description:
        "Recherche développeur React expérimenté pour un projet e-commerce. Stack : React, TypeScript, TailwindCSS",
      price: 500,
      duree: "2 semaines",
      user: {
        name: "Thomas Martin",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
        rating: 4.8,
        missions: 24,
        verified: true,
      },
      category: "Développement",
    },
    {
      id: 2,
      title: "Designer UI/UX",
      description:
        "Besoin d'un designer pour créer l'interface d'une application mobile. Design moderne et épuré requis.",
      price: 800,
      duree: "3 semaines",
      user: {
        name: "Sophie Bernard",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
        rating: 4.9,
        missions: 36,
        verified: true,
      },
      category: "Design",
    },
    {
      id: 3,
      title: "Rédacteur Web",
      description:
        "Recherche rédacteur pour créer du contenu SEO pour notre blog tech. Expérience en rédaction technique appréciée.",
      price: 300,
      duree: "1 semaine",
      user: {
        name: "Lucas Dubois",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3",
        rating: 4.6,
        missions: 18,
        verified: false,
      },
      category: "Rédaction",
    },
  ];

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
            <div className="stat-number">15K+</div>
            <div className="stat-label">Missions actives</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Freelances</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Clients satisfaits</div>
          </div>
        </div>
      </div>
      <div className="annonces">
        {FakeAnnonces.map((annonce) => (
          <div className="annonce-card" key={annonce.id}>
            <div className="user-header">
              <div className="user-info">
                <div className="avatar-container">
                  <img
                    src={annonce.user.avatar}
                    alt={`Profil de ${annonce.user.name}`}
                    className="avatar"
                  />
                  {annonce.user.verified && (
                    <div className="verified-badge">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title id="svgTitle">
                          Icon representing [insère ici la signification]
                        </title>
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h3>{annonce.user.name}</h3>
                  <div className="user-stats">
                    <div className="rating">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title id="svgTitle">
                          Icon representing [insère ici la signification]
                        </title>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {annonce.user.rating}
                    </div>
                    <div className="missions">
                      {annonce.user.missions} missions
                    </div>
                  </div>
                </div>
              </div>
              <div className="category-badge">{annonce.category}</div>
            </div>
            <div className="annonce-content">
              <h2>{annonce.title}</h2>
              <p className="description">{annonce.description}</p>
              <div className="annonce-details">
                <span className="budget">{annonce.price}</span>
                <span className="duree">{annonce.duree}</span>
              </div>
              <button type="button" className="voir-plus">
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
        ))}
      </div>
    </div>
  );
}
