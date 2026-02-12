import "dotenv/config";
import readline from "readline";
import { Agente } from "./Agente/agente.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("=== Agente ===");
console.log("Escribe tu mensaje (Ctrl+C para salir)\n");

function preguntar() {
  rl.question("Tú: ", async (mensaje) => {
    if (!mensaje.trim()) {
      return preguntar();
    }

    try {
      const respuesta = await Agente(mensaje);
      console.log("\nAgente:", respuesta, "\n");
    } catch (err) {
      console.error("Error:", err.message);
    }

    preguntar();
  });
}

preguntar();
