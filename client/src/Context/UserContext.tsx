// src/context/UserContext.tsx
import { createContext, useState, useEffect, useContext } from "react";

export interface User {
  id: number;
  global_name: string;
  avatar: string | null;
  discord_id: string;
  username: string;
  // Vous pouvez ajouter d'autres propriétés si nécessaire, comme "discriminator"
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Appel à l'API pour récupérer les infos de l'utilisateur connecté
    fetch("http://localhost:3310/api/me", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération de l'utilisateur :", err)
      );
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUser doit être utilisé à l'intérieur d'un UserProvider"
    );
  }
  return context;
};
