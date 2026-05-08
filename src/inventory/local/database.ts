import * as SQLite from "expo-sqlite";
import { localMigrations } from "./schema";

export async function openInventoryDatabase() {
  const db = await SQLite.openDatabaseAsync("inventory.db");

  for (const statement of localMigrations) {
    await db.execAsync(statement);
  }

  return db;
}
