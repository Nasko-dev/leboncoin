import databaseClient from "../../../database/client";

export interface Candidature {
  id: number;
  annonce_id: number;
  user_id: string;
  portfolio: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  annonce: {
    title: string;
    price: number;
    duree: string;
  };
  candidat: {
    username: string;
    global_name: string;
    avatar: string | null;
    discord_id: string;
  };
}

export default class CandidatureRepository {
  async findAll(): Promise<Candidature[]> {
    const query = `
      SELECT 
        c.id, c.annonce_id, c.user_id, c.portfolio, c.status, c.created_at, c.updated_at,
        a.title, a.price, a.duree,
        u.username, u.global_name, u.avatar, u.discord_id
      FROM candidature c
      LEFT JOIN annonces a ON c.annonce_id = a.id
      LEFT JOIN users u ON c.user_id = u.discord_id
      ORDER BY c.created_at DESC
    `;

    const [rows] = await databaseClient.execute(query);

    return (rows as Array<Record<string, unknown>>).map((row) => ({
      id: Number(row.id),
      annonce_id: Number(row.annonce_id),
      user_id: String(row.user_id),
      portfolio: row.portfolio ? String(row.portfolio) : null,
      status: String(row.status),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
      annonce: {
        title: String(row.title || ""),
        price: Number(row.price || 0),
        duree: String(row.duree || ""),
      },
      candidat: {
        username: String(row.username || ""),
        global_name: String(row.global_name || ""),
        avatar: row.avatar ? String(row.avatar) : null,
        discord_id: String(row.discord_id || ""),
      },
    }));
  }

  async findById(id: number): Promise<Candidature | null> {
    const query = `
      SELECT 
        c.id, c.annonce_id, c.user_id, c.portfolio, c.status, c.created_at, c.updated_at,
        a.title, a.price, a.duree,
        u.username, u.global_name, u.avatar, u.discord_id
      FROM candidature c
      LEFT JOIN annonces a ON c.annonce_id = a.id
      LEFT JOIN users u ON c.user_id = u.discord_id
      WHERE c.id = ?
    `;

    const [rows] = await databaseClient.execute(query, [id]);
    const result = rows as Array<Record<string, unknown>>;

    if (result.length === 0) return null;

    const row = result[0];

    return {
      id: Number(row.id),
      annonce_id: Number(row.annonce_id),
      user_id: String(row.user_id),
      portfolio: row.portfolio ? String(row.portfolio) : null,
      status: String(row.status),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
      annonce: {
        title: String(row.title || ""),
        price: Number(row.price || 0),
        duree: String(row.duree || ""),
      },
      candidat: {
        username: String(row.username || ""),
        global_name: String(row.global_name || ""),
        avatar: row.avatar ? String(row.avatar) : null,
        discord_id: String(row.discord_id || ""),
      },
    };
  }

  async findByUserId(userId: string): Promise<Candidature[]> {
    try {
      const query = `
        SELECT 
          c.id, c.annonce_id, c.user_id, c.portfolio, c.status, c.created_at, c.updated_at,
          a.title, a.price, a.duree,
          u.username, u.global_name, u.avatar, u.discord_id
        FROM candidature c
        LEFT JOIN annonces a ON c.annonce_id = a.id
        LEFT JOIN users u ON c.user_id = u.discord_id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `;

      const [rows] = await databaseClient.execute(query, [userId]);
      const result = rows as Array<Record<string, unknown>>;

      return result.map((row) => ({
        id: Number(row.id),
        annonce_id: Number(row.annonce_id),
        user_id: String(row.user_id),
        portfolio: row.portfolio ? String(row.portfolio) : null,
        status: String(row.status),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        annonce: {
          title: String(row.title || ""),
          price: Number(row.price || 0),
          duree: String(row.duree || ""),
        },
        candidat: {
          username: String(row.username || ""),
          global_name: String(row.global_name || ""),
          avatar: row.avatar ? String(row.avatar) : null,
          discord_id: String(row.discord_id || ""),
        },
      }));
    } catch (error) {
      console.error("Erreur dans findByUserId:", error);
      throw error;
    }
  }

  async create(
    candidature: Omit<Candidature, "id" | "created_at" | "updated_at">,
  ): Promise<Candidature> {
    const query = `
      INSERT INTO candidature (annonce_id, user_id, portfolio, status)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      candidature.annonce_id,
      candidature.user_id,
      candidature.portfolio,
      candidature.status,
    ];

    const [result] = await databaseClient.execute(query, values);
    const insertId = (result as { insertId: number }).insertId;

    return this.findById(insertId) as Promise<Candidature>;
  }

  async findByAnnonceUserId(discord_id: string): Promise<Candidature[]> {
    try {
      const query = `
        SELECT 
          c.*,
          a.title as annonce_title,
          a.price as annonce_price,
          a.duree as annonce_duree,
          u.username,
          u.global_name,
          u.avatar,
          u.discord_id
        FROM candidature c
        JOIN annonces a ON c.annonce_id = a.id
        JOIN users u ON c.user_id = u.discord_id
        WHERE a.user_id = (SELECT id FROM users WHERE discord_id = ?)
        ORDER BY c.created_at DESC
      `;

      const [rows] = await databaseClient.execute(query, [discord_id]);

      return (rows as Array<Record<string, unknown>>).map((row) => ({
        id: Number(row.id),
        annonce_id: Number(row.annonce_id),
        user_id: String(row.user_id),
        portfolio: row.portfolio as string | null,
        status: row.status as string,
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
        annonce: {
          title: row.annonce_title as string,
          price: Number(row.annonce_price),
          duree: row.annonce_duree as string,
        },
        candidat: {
          username: row.username as string,
          global_name: row.global_name as string,
          avatar: row.avatar as string | null,
          discord_id: row.discord_id as string,
        },
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des candidatures reçues:",
        error,
      );
      throw error;
    }
  }

  async updateStatus(id: number, status: string): Promise<Candidature> {
    try {
      const query = `
        UPDATE candidature 
        SET status = ?, updated_at = NOW()
        WHERE id = ?
      `;

      await databaseClient.execute(query, [status, id]);
      return this.findById(id) as Promise<Candidature>;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
  }
}
