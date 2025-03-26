import type { Request, RequestHandler, Response } from "express";
import { CategorieRepository } from "./CategorieRepository"; // Ajustez le chemin selon votre arborescence

export class CategorieAction {
  private repository: CategorieRepository;

  constructor() {
    this.repository = new CategorieRepository();
  }

  // Exemple de méthode pour obtenir toutes les catégories via une requête HTTP
  public getAllCategories: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const categories = await this.repository.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des catégories" });
    }
  };
}
