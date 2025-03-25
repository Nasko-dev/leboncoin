import axios from "axios";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import ConnexionDiscordRepository from "./ConnexionDiscordRepository";

const ConnexionDiscord: RequestHandler = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.status(400).send("Code manquant dans l'URL");
    return;
  }

  try {
    // Préparer les paramètres pour l'échange du code
    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID || "");
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET || "");
    params.append("grant_type", "authorization_code");
    params.append("code", code.toString());
    // IMPORTANT: cet URI doit correspondre exactement à celui enregistré dans Discord
    params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI || "");
    params.append("scope", "identify email");

    // Requête pour obtenir le token
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const { access_token } = tokenResponse.data;

    // Utiliser le token pour récupérer les informations de l'utilisateur
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;

    console.info("Utilisateur connecté :", discordUser);

    const userData = {
      id: discordUser.id,
      username: discordUser.username,
      email: discordUser.email,
      avatar: discordUser.avatar,
      global_name: discordUser.global_name,
    };

    // Appeler le repository pour insérer (ou mettre à jour) l'utilisateur dans la BDD
    await ConnexionDiscordRepository(userData);

    // Créer une session pour l'utilisateur
    const tokenPayload = {
      discord_id: userData.id,
      username: userData.username,
      email: userData.email,
      global_name: userData.global_name,
      avatar: userData.avatar,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.APP_SECRET || "defaultSecret",
      { expiresIn: "1h" },
    );

    // Stocker le token dans un cookie HttpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en production avec HTTPS
      maxAge: 3600000, // 1 heure en millisecondes
    });

    // Rediriger l'utilisateur vers le client (l'URL du client est défini dans le .env)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    res.redirect(clientUrl);
  } catch (error) {
    console.error("Erreur lors de l'authentification Discord:", error);
    res.status(500).send("Erreur lors de l'authentification");
  }
};

const getCurrentUser: RequestHandler = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.APP_SECRET || "defaultSecret",
    );
    res.json(decoded);
  } catch (err) {
    console.error("Token invalide :", err);
    res.status(401).json({ message: "Token invalide" });
  }
};

export default { ConnexionDiscord, getCurrentUser };
