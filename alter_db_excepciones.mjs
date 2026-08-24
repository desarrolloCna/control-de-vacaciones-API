import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.DB_TURSO_URL,
  authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  try {
    await client.execute("ALTER TABLE excepciones_limite_vacaciones ADD COLUMN diasAutorizados INTEGER DEFAULT NULL;");
    console.log("Column diasAutorizados added successfully to Turso DB.");
  } catch (error) {
    if (error.message.includes("duplicate column name")) {
      console.log("Column already exists.");
    } else {
      console.error("Error altering table:", error.message);
    }
  }
}

run();
