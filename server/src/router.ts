import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";
import ConnexionDiscord from "./modules/ConnexionDiscord/ConnexionDiscordAction";
import { PubliAnnoncesAction } from "./modules/PubliAnnonces/PubliAnnoncesAction";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

router.get("/auth/discord/callback", ConnexionDiscord.ConnexionDiscord);
router.get("/api/me", ConnexionDiscord.getCurrentUser);

router.post("/api/annonces", new PubliAnnoncesAction().createAnnonce);
router.get("/api/annonces", new PubliAnnoncesAction().getAnnonces);

/* ************************************************************************* */

export default router;
