// PubliAnnoncesAction.ts
import type { Request, Response, RequestHandler } from "express";
import {
  PubliAnnoncesRepository,
  type CreateAnnonce,
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
    const { title, description, price, user_id, date } = req.body;

    if (!title || !description || !user_id) {
      res.status(400).json({
        error:
          "Les champs 'title', 'description' et 'user_id' sont obligatoires.",
        received: { title, description, user_id },
      });
      return;
    }

    const annonce: CreateAnnonce = {
      title,
      description,
      price: price ? Number(price) : undefined,
      user_id,
      date,
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

  public getAnnonces: RequestHandler = async (req, res) => {
    const annonces = await this.repository.getAnnonces();
    res.status(200).json(annonces);
  };
}
