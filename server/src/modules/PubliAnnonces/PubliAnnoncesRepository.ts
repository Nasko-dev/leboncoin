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
  category: {
    id: number;
    name: string;
  };
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
  category?: { id: number };
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
    const categoryId = annonce.category?.id ?? null;

    // Ensuite, créer l'annonce avec l'id de l'utilisateur
    const query = `
    INSERT INTO annonces (title, description, price, duree, user_id, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    const values = [
      annonce.title,
      annonce.description,
      annonce.price ?? null,
      annonce.duree || "Non spécifiée",
      userId,
      categoryId, // ✅ on ajoute l’ID de la catégorie
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

  public async getAnnonces(categoryId?: number): Promise<Annonce[]> {
    let query = `
      SELECT 
        a.id, a.title, a.description, a.price, a.duree,
        a.created_at, a.updated_at,
        u.username, u.global_name, u.avatar, u.discord_id,
        c.id AS category_id, c.name AS category_name
      FROM annonces a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
    `;

    const values: (number | string)[] = [];

    if (categoryId) {
      query += " WHERE c.id = ?";
      values.push(categoryId);
    }

    query += " ORDER BY a.created_at DESC";

    const [rows] = await databaseClient.execute(query, values);

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
      category: {
        id: row.category_id as number,
        name: row.category_name as string,
      },
    }));
  }

  public async getAnnoncesByUserId(user_id: number): Promise<Annonce[]> {
    const query = `
      SELECT 
        a.id, a.title, a.description, a.price, a.duree,
        a.created_at, a.updated_at,
        u.username, u.global_name, u.avatar, u.discord_id,
        c.id AS category_id, c.name AS category_name
      FROM annonces a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `;

    const [rows] = await databaseClient.execute(query, [user_id]);

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
      category: {
        id: row.category_id as number,
        name: row.category_name as string,
      },
    }));
  }

  public async getAnnonceById(id: number): Promise<Annonce | null> {
    const query = `
      SELECT 
        a.id, a.title, a.description, a.price, a.duree, a.created_at, a.updated_at,
        u.username, u.global_name, u.avatar, u.discord_id,
        c.id AS category_id, c.name AS category_name
      FROM annonces a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `;

    const [rows] = await databaseClient.execute(query, [id]);
    const result = rows as Array<Record<string, unknown>>;

    if (result.length === 0) return null;

    const row = result[0];

    return {
      id: row.id as number,
      title: row.title as string,
      description: row.description as string,
      price: row.price as number,
      duree: row.duree as string,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      user: {
        username: row.username as string,
        global_name: row.global_name as string,
        avatar: row.avatar as string | null,
        discord_id: row.discord_id as string,
      },
      category: {
        id: row.category_id as number,
        name: row.category_name as string,
      },
    };
  }
}
