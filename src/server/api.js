import "dotenv/config";
import express from "express"
import cors from "cors"
import { Agente } from "../Agente/agente.js"

const app = express();
app.use(cors()); // Permitir que la app consuma la API
app.use(express.json()) //Leer JSON en el body

app.post("/api/chat", async (req, res) => {

    try {
        const { mensaje, tipoUsuario } = req.body;
    
        if (!mensaje || typeof mensaje !== "string") {
        return res.status(400).json({ error: "Falta 'mensaje'" });
        }

        // Chat principal: siempre trabaja con texto
        const respuesta = await Agente(mensaje, tipoUsuario || "free");

        res.json({ respuesta, tipoUsuario: tipoUsuario || "free" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el agente" });
    }

    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);

});

