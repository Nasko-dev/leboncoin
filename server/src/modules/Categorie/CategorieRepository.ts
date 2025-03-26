import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

export interface Category extends RowDataPacket {
  id: number;
  name: string;
}

export class CategorieRepository {
  public async getAllCategories(): Promise<Category[]> {
    const [rows] = await databaseClient.query<Category[]>(
      "SELECT id, name FROM categories",
    );
    return rows;
  }

  public async findCategoryByName(name: string): Promise<Category | null> {
    const [rows] = await databaseClient.query<Category[]>(
      "SELECT id, name FROM categories WHERE name = ?",
      [name],
    );
    return rows[0] || null;
  }
}
