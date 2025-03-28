import { useEffect, useRef, useState } from "react";
import {
  FiBriefcase,
  FiChevronDown,
  FiFileText,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ProfileDropdown.css";

interface ProfileDropdownProps {
  username: string;
  avatarUrl: string;
  onLogout: () => void;
}

export default function ProfileDropdown({
  username,
  avatarUrl,
  onLogout,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="username">{username}</span>
        <img
          src={avatarUrl}
          alt={`Avatar de ${username}`}
          className="avatar"
          width={40}
          height={40}
        />
        <FiChevronDown className={`chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <img
              src={avatarUrl}
              alt={`Avatar de ${username}`}
              className="dropdown-avatar"
              width={40}
              height={40}
            />
            <span className="dropdown-username">{username}</span>
          </div>

          <div className="dropdown-items">
            <a
              onClick={() => navigate("/mes-annonces")}
              href="mes-annonces"
              className="dropdown-item"
            >
              <FiFileText className="item-icon" />
              Mes annonces
            </a>
            <a
              onClick={() => navigate("/MesCandidatures.tsx")}
              href="/mes-candidatures"
              className="dropdown-item"
            >
              <FiBriefcase className="item-icon" />
              Mes candidatures
            </a>
            <a href="/mon-profil" className="dropdown-item">
              <FiUser className="item-icon" />
              Mon Profil
            </a>
          </div>

          <div className="dropdown-footer">
            <button type="button" onClick={onLogout} className="logout-button">
              <FiLogOut className="item-icon" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
