import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  global_name: string;
}

const ConnexionDiscordRepository = async (
  discordUser: DiscordUser,
): Promise<void> => {
  // Destructurer toutes les propriétés, y compris global_name
  const { id, username, email, avatar, global_name } = discordUser;

  // Vérifier si l'utilisateur existe déjà dans la base de données
  const [rows] = await databaseClient.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE discord_id = ?",
    [id],
  );

  if (rows.length > 0) {
    // Mettre à jour les informations de l'utilisateur existant
    await databaseClient.query(
      "UPDATE users SET username = ?, global_name = ?, email = ?, avatar = ? WHERE discord_id = ?",
      [username, global_name, email, avatar, id],
    );
  } else {
    // Insérer un nouvel utilisateur en fournissant 5 valeurs pour 5 colonnes
    await databaseClient.query(
      "INSERT INTO users (discord_id, username, global_name, email, avatar) VALUES (?, ?, ?, ?, ?)",
      [id, username, global_name, email, avatar],
    );
  }
};

export default ConnexionDiscordRepository;
