import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import CandidatureAction from "./modules/Candidature/CandidatureAction";
import { CategorieAction } from "./modules/Categorie/CategorieAction";
import ConnexionDiscord from "./modules/ConnexionDiscord/ConnexionDiscordAction";
import { PubliAnnoncesAction } from "./modules/PubliAnnonces/PubliAnnoncesAction";
import itemActions from "./modules/item/itemActions";
import { UserAction } from "./modules/userControler/UserAction";
const userAction = new UserAction();

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

router.get("/auth/discord/callback", ConnexionDiscord.ConnexionDiscord);
router.post("/auth/logout", ConnexionDiscord.logout);
router.get("/api/me", ConnexionDiscord.getCurrentUser);

router.post("/api/annonces", new PubliAnnoncesAction().createAnnonce);
router.get("/api/annonces", new PubliAnnoncesAction().getAnnonces);
router.get(
  "/api/annonces/user/:id",
  new PubliAnnoncesAction().getAnnoncesByUserId,
);
router.get("/api/annonces/:id", new PubliAnnoncesAction().getAnnonceById);
router.get("/api/categories", new CategorieAction().getAllCategories);

router.get("/api/user/:discord_id", userAction.getUser);
router.put("/api/user/:discord_id", userAction.updateUser);

router.get("/api/candidatures", CandidatureAction.browse);
router.get("/api/candidatures/user/:id", CandidatureAction.browseByUser);
router.get("/api/candidatures/received/:id", CandidatureAction.browseReceived);
router.get("/api/candidatures/:id", CandidatureAction.read);
router.post("/api/candidatures", CandidatureAction.add);
router.put("/api/candidatures/:id/status", CandidatureAction.updateStatus);

/* ************************************************************************* */

export default router;
