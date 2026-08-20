import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const tx = await Connection.transaction("write");
        
        // Etnias
        await tx.execute("UPDATE pertenenciaSociolinguistica SET etnia = 'Maya' WHERE etnia IN ('1', '1.0');");
        await tx.execute("UPDATE pertenenciaSociolinguistica SET etnia = 'Garífuna' WHERE etnia IN ('2', '2.0');");
        await tx.execute("UPDATE pertenenciaSociolinguistica SET etnia = 'Xinka' WHERE etnia IN ('3', '3.0');");
        await tx.execute("UPDATE pertenenciaSociolinguistica SET etnia = 'Afrodescendiente / creole / afromestizo' WHERE etnia IN ('4', '4.0');");
        await tx.execute("UPDATE pertenenciaSociolinguistica SET etnia = 'Ladino' WHERE etnia IN ('5', '5.0');");
        await tx.execute("UPDATE pertenenciaSociolinguistica SET etnia = 'Extranjero' WHERE etnia IN ('6', '6.0');");

        await tx.commit();
        console.log("Updated Etnias successfully");
    } catch (e) {
        console.error(e);
    }
}
run();
