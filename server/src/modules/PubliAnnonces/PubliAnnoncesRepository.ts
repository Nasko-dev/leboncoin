// PubliAnnoncesRepository.ts
import databaseClient from "../../../database/client";

export interface Annonce {
  id: number;
  title: string;
  description: string;
  price?: number;
  duree?: string;
  user_id: string; // discord_id
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    global_name: string;
    avatar: string | null;
  };
}

export interface CreateAnnonce {
  title: string;
  description: string;
  price?: number;
  duree?: string;
  user_id: string;
}

interface InsertResult {
  insertId: number;
  affectedRows: number;
}

export class PubliAnnoncesRepository {
  public async createAnnonce(annonce: CreateAnnonce): Promise<InsertResult> {
    // D'abord, récupérer l'id de l'utilisateur à partir du discord_id
    const userQuery = "SELECT id FROM users WHERE discord_id = ?";
    const [userResult] = await databaseClient.execute(userQuery, [
      annonce.user_id,
    ]);
    const users = userResult as { id: number }[];

    if (users.length === 0) {
      throw new Error("Utilisateur non trouvé");
    }

    const userId = users[0].id;

    // Ensuite, créer l'annonce avec l'id de l'utilisateur
    const query =
      "INSERT INTO annonces (title, description, price, duree, user_id) VALUES (?, ?, ?, ?, ?)";
    const values = [
      annonce.title,
      annonce.description,
      annonce.price ?? null,
      annonce.duree || "Non spécifiée",
      userId,
    ];

    console.log("Requête SQL:", query);
    console.log("Valeurs:", values);

    try {
      const [result] = await databaseClient.execute(query, values);
      return result as InsertResult;
    } catch (error) {
      console.error("Erreur SQL:", error);
      throw new Error(`Erreur lors de l'insertion de l'annonce: ${error}`);
    }
  }

  public async getAnnonces(): Promise<Annonce[]> {
    const query = `
      SELECT a.*, u.username, u.global_name, u.avatar 
      FROM annonces a 
      LEFT JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC
    `;
    const [result] = await databaseClient.execute(query);
    return result as Annonce[];
  }
}
