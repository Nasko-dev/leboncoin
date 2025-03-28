// src/modules/User/UserRepository.ts
import databaseClient from "../../../database/client";

export interface UserProfile {
  username: string;
  global_name: string;
  avatar: string | null;
  discord_id: string;
  bio: string;
  profession: string;
  age: number;
  site_web: string;
  localisation: string;
  email: string;
}

export class UserRepository {
  public async getUserByDiscordId(
    discord_id: string,
  ): Promise<UserProfile | null> {
    const query = "SELECT * FROM users WHERE discord_id = ?";
    const [rows] = await databaseClient.execute(query, [discord_id]);
    const results = rows as UserProfile[];
    return results.length ? results[0] : null;
  }

  public async updateUserByDiscordId(
    discord_id: string,
    data: Partial<UserProfile>,
  ): Promise<void> {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (!fields.length) return;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const query = `UPDATE users SET ${setClause} WHERE discord_id = ?`;

    await databaseClient.execute(query, [...values, discord_id]);
  }
}
