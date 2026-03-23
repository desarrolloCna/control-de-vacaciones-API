import { createClient } from "@libsql/client";

// Crear cliente de conexión a SQLite usando @libsql/client
export const Connection = createClient({
    url: "libsql://catalogosbd-desarrollocna.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjMwOTkwOTgsImlkIjoiYzFhN2UzMmUtYmUxNC00ZWIwLTlkZTEtMjc5ZTljMTU1MTg1IiwicmlkIjoiODA1Nzg1ZjItM2NjZS00MjY1LTk1NTMtNmUwZjFmODZjY2ViIn0.51Wc06l-KFG22S3gMsBfq2_6MyFqEno89BL0fEsnoNvnC__loPjpi7VxTFLn3aP4UI3fFX9w59pT4ewa8rUUCQ"
});
