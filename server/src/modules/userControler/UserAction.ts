// src/modules/User/UserAction.ts
import type { RequestHandler } from "express";
import { UserRepository } from "./UserRepository";

const repository = new UserRepository();

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

type AllowedFields = keyof Pick<
  UserProfile,
  "bio" | "profession" | "age" | "site_web" | "localisation" | "email"
>;

export class UserAction {
  public getUser: RequestHandler = async (req, res) => {
    const { discord_id } = req.params;

    if (!discord_id) {
      res.status(400).json({ error: "discord_id manquant" });
      return;
    }

    try {
      const user = await repository.getUserByDiscordId(discord_id);
      if (!user) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Erreur getUser:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  public updateUser: RequestHandler = async (req, res) => {
    const { discord_id } = req.params;
    const data = req.body;

    if (!discord_id) {
      res.status(400).json({ error: "discord_id manquant" });
      return;
    }

    // Vérifier si l'utilisateur existe
    try {
      const existingUser = await repository.getUserByDiscordId(discord_id);
      if (!existingUser) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
      res.status(500).json({ error: "Erreur serveur" });
      return;
    }

    // Validation des données
    const allowedFields: AllowedFields[] = [
      "bio",
      "profession",
      "age",
      "site_web",
      "localisation",
      "email",
    ];

    const filteredData = Object.keys(data).reduce(
        (acc, key) => {
        if (allowedFields.includes(key as AllowedFields)) {
          acc[key as AllowedFields] = data[key];
        }
        return acc;
      },
      {} as Partial<UserProfile>,
    );

    if (Object.keys(filteredData).length === 0) {
      res.status(400).json({
        error: "Aucune donnée valide à mettre à jour",
      });
      return;
    }

    // Validation spécifique des champs
    if (
      filteredData.age &&
      (Number.isNaN(filteredData.age) || filteredData.age < 0)
    ) {
      res.status(400).json({ error: "Âge invalide" });
      return;
    }

    if (filteredData.email && !filteredData.email.includes("@")) {
      res.status(400).json({ error: "Email invalide" });
      return;
    }

    if (filteredData.site_web && !filteredData.site_web.startsWith("http")) {
      res.status(400).json({ error: "URL du site web invalide" });
      return;
    }

    try {
      await repository.updateUserByDiscordId(discord_id, filteredData);

      // Récupérer l'utilisateur mis à jour
      const updatedUser = await repository.getUserByDiscordId(discord_id);

      res.status(200).json({
        message: "Profil mis à jour avec succès",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erreur updateUser:", error);
      res.status(500).json({
        error: "Erreur lors de la mise à jour du profil",
      });
    }
  };
}
