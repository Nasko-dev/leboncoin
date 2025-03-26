import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import { CategorieAction } from "./modules/Categorie/CategorieAction";
import ConnexionDiscord from "./modules/ConnexionDiscord/ConnexionDiscordAction";
import { PubliAnnoncesAction } from "./modules/PubliAnnonces/PubliAnnoncesAction";
import itemActions from "./modules/item/itemActions";

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

/* ************************************************************************* */

export default router;
