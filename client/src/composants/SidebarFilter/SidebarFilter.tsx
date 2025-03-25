import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
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
}: SidebarFilterProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    "Toutes les catégories",
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
    onSearch(e.target.value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinPrice = e.target.value;
    setMinPrice(newMinPrice);
    onPriceChange(Number(newMinPrice) || 0, Number(maxPrice) || 0);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxPrice = e.target.value;
    setMaxPrice(newMaxPrice);
    onPriceChange(Number(minPrice) || 0, Number(newMaxPrice) || 0);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExperience(e.target.value);
    onExperienceChange(e.target.value);
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
      </div>
    </div>
  );
}
