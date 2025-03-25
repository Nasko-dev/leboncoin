import { useState, useEffect } from "react";
import { FiSearch, FiX, FiCheck } from "react-icons/fi";
import "./SidebarFilter.css";

interface SidebarFilterProps {
  onSearch: (query: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (category: string) => void;
  onExperienceChange: (experience: string) => void;
  onReset: () => void;
}

export default function SidebarFilter({
  onSearch,
  onPriceChange,
  onCategoryChange,
  onExperienceChange,
  onReset,
}: SidebarFilterProps) {
  const [isValidated, setIsValidated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    "Toutes les catégories"
  );
  const [selectedExperience, setSelectedExperience] =
    useState("Tous les niveaux");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "Toutes les catégories",
    "Développement",
    "Design",
    "Marketing",
    "Rédaction",
    "Traduction",
    "Administration",
    "Conseil",
    "Data Science",
  ];

  const experiences = [
    "Tous les niveaux",
    "Junior (0-2 ans)",
    "Confirmé (2-5 ans)",
    "Senior (5-8 ans)",
    "Expert (8+ ans)",
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (isValidated) {
      onSearch(e.target.value);
    }
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    if (isValidated) {
      onPriceChange(Number(e.target.value), Number(maxPrice));
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    if (isValidated) {
      onPriceChange(Number(minPrice), Number(e.target.value));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    if (isValidated) {
      onCategoryChange(e.target.value);
    }
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExperience(e.target.value);
    if (isValidated) {
      onExperienceChange(e.target.value);
    }
  };

  const handleActionButton = () => {
    if (isValidated) {
      // Réinitialiser
      setSearchValue("");
      setMinPrice("");
      setMaxPrice("");
      setSelectedCategory("Toutes les catégories");
      setSelectedExperience("Tous les niveaux");
      setIsValidated(false);
      onReset();
    } else {
      // Valider
      onSearch(searchValue);
      onPriceChange(Number(minPrice), Number(maxPrice));
      onCategoryChange(selectedCategory);
      onExperienceChange(selectedExperience);
      setIsValidated(true);
    }
  };

  return (
    <div className={`sidebar-filter ${isScrolled ? "scrolled" : ""}`}>
      <div className="filter-content">
        <div className="filter-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une mission..."
              value={searchValue}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="filter-section">
          <h3>Prix</h3>
          <div className="price-range">
            <input
              type="number"
              className="price-input"
              placeholder="Min"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            <span>-</span>
            <input
              type="number"
              className="price-input"
              placeholder="Max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>

        <div className="filter-section">
          <h3>Catégories</h3>
          <div className="category-select">
            <select value={selectedCategory} onChange={handleCategoryChange}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-section">
          <h3>Expérience</h3>
          <div className="category-select">
            <select
              value={selectedExperience}
              onChange={handleExperienceChange}
            >
              {experiences.map((experience) => (
                <option key={experience} value={experience}>
                  {experience}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className={`action-button ${isValidated ? "reset" : "validate"}`}
          onClick={handleActionButton}
        >
          {isValidated ? (
            <>
              <FiX /> Réinitialiser
            </>
          ) : (
            <>
              <FiCheck /> Valider
            </>
          )}
        </button>
      </div>
    </div>
  );
}
