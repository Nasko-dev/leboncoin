import type { Request, RequestHandler, Response } from "express";
import databaseClient from "../../../database/client";
import {
  type CreateAnnonce,
  PubliAnnoncesRepository,
} from "./PubliAnnoncesRepository";

export class PubliAnnoncesAction {
  private repository: PubliAnnoncesRepository;

  constructor() {
    this.repository = new PubliAnnoncesRepository();
  }

  /**
   * Middleware Express pour créer une nouvelle annonce.
   */
  public createAnnonce: RequestHandler = async (req, res) => {
    // ✅ Ajout de category au destructuring
    const { title, description, price, user_id, category, duree, skills } =
      req.body;

    // Vérification des champs obligatoires
    if (!title || !description || !user_id) {
      res.status(400).json({
        error:
          "Les champs 'title', 'description' et 'user_id' sont obligatoires.",
        received: { title, description, user_id },
      });
      return;
    }

    // ✅ Construction de l'objet CreateAnnonce complet
    const annonce: CreateAnnonce = {
      title,
      description,
      price: price ? Number(price) : undefined,
      duree,
      user_id,
      category,
      skills,
    };

    try {
      const result = await this.repository.createAnnonce(annonce);
      res.status(201).json({ id: result.insertId, ...annonce });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue s'est produite";
      res.status(500).json({ error: errorMessage });
    }
  };

  /**
   * Middleware pour récupérer toutes les annonces.
   */
  public getAnnonces: RequestHandler = async (req, res) => {
    const { category } = req.query;

    try {
      const annonces = await this.repository.getAnnonces(
        category ? Number(category) : undefined,
      );
      res.status(200).json(annonces);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des annonces." });
    }
  };

  /**
   * Middleware pour récupérer une annonce par son ID.
   */
  public getAnnoncesByUserId: RequestHandler = async (req, res) => {
    const discord_id = req.params.id;

    if (!discord_id) {
      res.status(400).json({ error: "discord_id manquant" });
      return;
    }

    try {
      // D'abord, récupérer l'id de l'utilisateur à partir du discord_id
      const userQuery = "SELECT id FROM users WHERE discord_id = ?";
      const [userResult] = await databaseClient.execute(userQuery, [
        discord_id,
      ]);
      const users = userResult as { id: number }[];

      if (users.length === 0) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      const userId = users[0].id;
      const annonces = await this.repository.getAnnoncesByUserId(userId);
      res.status(200).json(annonces);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  /**
   * Middleware pour récupérer une annonce par son ID.
   */
  public getAnnonceById: RequestHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "ID manquant" });
      return;
    }

    try {
      const annonce = await this.repository.getAnnonceById(Number(id));
      if (!annonce) {
        res.status(404).json({ error: "Annonce non trouvée" });
        return;
      }
      res.status(200).json(annonce);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
}
