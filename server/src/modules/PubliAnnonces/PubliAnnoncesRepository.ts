// PubliAnnoncesRepository.ts
import databaseClient from "../../../database/client";

export interface Annonce {
  id: number;
  title: string;
  description: string;
  price?: number;
  duree?: string;
  created_at: string;
  updated_at: string;
  user: {
    username: string;
    global_name: string;
    avatar: string | null;
    discord_id: string;
  };
}

export interface CreateAnnonce {
  title: string;
  description: string;
  price?: number;
  duree?: string;
  user_id: string;
  category?: string;
  skills?: string;
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

    console.info("Requête SQL:", query);
    console.info("Valeurs:", values);

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
      SELECT 
        a.id,
        a.title,
        a.description,
        a.price,
        a.duree,
        a.created_at,
        a.updated_at,
        u.username,
        u.global_name,
        u.avatar,
        u.discord_id
      FROM annonces a 
      LEFT JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC
    `;
    const [rows] = await databaseClient.execute(query);

    return (rows as Array<Record<string, unknown>>).map((row) => ({
      id: row.id as number,
      title: row.title as string,
      description: row.description as string,
      price: row.price as number | undefined,
      duree: row.duree as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      user: {
        username: row.username as string,
        global_name: row.global_name as string,
        avatar: row.avatar as string | null,
        discord_id: row.discord_id as string,
      },
    }));
  }
}
