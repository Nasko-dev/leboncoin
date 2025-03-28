import type { Request, RequestHandler, Response } from "express";
import databaseClient from "../../../database/client";
import CandidatureRepository from "./CandidatureRepository";

const candidatureRepository = new CandidatureRepository();

// Le endpoint pour récupérer toutes les candidatures
const browse: RequestHandler = async (req, res) => {
  try {
    const candidatures = await candidatureRepository.findAll();
    res.json(candidatures);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des candidatures" });
  }
};

// Le endpoint pour récupérer les candidatures de l'utilisateur connecté
const browseByUser: RequestHandler = async (req, res) => {
  const discord_id = req.params.id;

  if (!discord_id) {
    res.status(400).json({ error: "discord_id manquant" });
    return;
  }

  try {
    const candidatures = await candidatureRepository.findByUserId(discord_id);
    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Le endpoint pour récupérer les candidatures reçues pour les annonces de l'utilisateur
const browseReceived: RequestHandler = async (req, res) => {
  const discord_id = req.params.id;

  if (!discord_id) {
    res.status(400).json({ error: "discord_id manquant" });
    return;
  }

  try {
    const candidatures =
      await candidatureRepository.findByAnnonceUserId(discord_id);
    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Le endpoint pour récupérer une candidature par son ID
const read: RequestHandler = async (req, res) => {
  try {
    const candidature = await candidatureRepository.findById(
      Number(req.params.id),
    );
    if (!candidature) {
      res.status(404).json({ error: "Candidature non trouvée" });
      return;
    }
    res.json(candidature);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la candidature" });
  }
};

// Le endpoint pour créer une nouvelle candidature (postuler)
const add: RequestHandler = async (req, res) => {
  try {
    const { annonce_id, user_id, portfolio, status } = req.body;

    if (!annonce_id || !user_id || !portfolio) {
      res.status(400).json({
        error: "Données manquantes",
        details: {
          annonce_id: !annonce_id ? "ID de l'annonce requis" : null,
          user_id: !user_id ? "ID de l'utilisateur requis" : null,
          portfolio: !portfolio ? "Portfolio requis" : null,
        },
      });
      return;
    }

    // Vérifier si l'annonce existe
    const annonceQuery = "SELECT id FROM annonces WHERE id = ?";
    const [annonceResult] = await databaseClient.execute(annonceQuery, [
      annonce_id,
    ]);
    const annonces = annonceResult as { id: number }[];

    if (annonces.length === 0) {
      res.status(404).json({ error: "Annonce non trouvée" });
      return;
    }

    const candidature = await candidatureRepository.create({
      annonce_id: Number(annonce_id),
      user_id: String(user_id),
      portfolio,
      status: status || "en_attente",
      annonce: {
        title: "",
        price: 0,
        duree: "",
      },
      candidat: {
        username: "",
        global_name: "",
        avatar: null,
        discord_id: user_id,
      },
    });

    res.status(201).json(candidature);
  } catch (error) {
    console.error("Erreur lors de la création de la candidature:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la candidature" });
  }
};

// Le endpoint pour mettre à jour le statut d'une candidature
const updateStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      res.status(400).json({ error: "ID et statut requis" });
      return;
    }

    const candidature = await candidatureRepository.updateStatus(
      Number(id),
      status,
    );
    res.status(200).json(candidature);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

export default {
  browse,
  browseByUser,
  browseReceived,
  read,
  add,
  updateStatus,
};
