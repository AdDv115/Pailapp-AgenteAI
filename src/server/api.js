import "dotenv/config";
import express from "express";
import cors from "cors";
import { Agente } from "../Agente/agente.js";
import { conectarDB } from "../db/mongo.js";

let db;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    db = await conectarDB();
    res.send("API de Chirrit está corriendo 🐸 | Mongo OK");
  } catch(err) {
    res.send("API OK pero Mongo falló");
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    db = await conectarDB();
    const { mensaje, tipoUsuario } = req.body;
    const userId = tipoUsuario;

    const conversacion = await db.collection("conversaciones").findOne({ userId }) || { mensajes: [] };
    const esPrimerMensaje = conversacion.mensajes.length === 0;

    conversacion.mensajes.push({ role: "user", content: mensaje });

    const respuesta = await Agente(mensaje, tipoUsuario, conversacion.mensajes, esPrimerMensaje);

    conversacion.mensajes.push({ role: "assistant", content: respuesta });

    if (conversacion.mensajes.length > 20) {
      conversacion.mensajes = conversacion.mensajes.slice(-20);
    }

    await db.collection("conversaciones").updateOne(
      { userId },
      { $set: { userId, mensajes: conversacion.mensajes, ultimaActualizacion: new Date() } },
      { upsert: true }
    );

    res.json({ respuesta, tipoUsuario, esPrimerMensaje });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el agente: " + err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
