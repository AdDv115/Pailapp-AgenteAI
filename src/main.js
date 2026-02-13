import "dotenv/config"; // Carga variables de entorno desde .env
import readline from "readline"; // Módulo estándar para leer de la terminal
import { Agente } from "./Agente/agente.js";

// Creamos interfaz de lectura/escritura por consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Puedes cambiar "free" por "pro" para probar el otro modelo
const tipoUsuario = "free";

console.log("=== Chirrit ===");
console.log(`Modo: ${tipoUsuario.toUpperCase()}`);
console.log("Escribe tu mensaje (Ctrl+C para salir)\n");

// Función recursiva para mantener la conversación
function preguntar() {
  rl.question("Tú: ", async (mensaje) => {
    // Si el usuario solo presiona Enter, volvemos a preguntar
    if (!mensaje.trim()) {
      return preguntar();
    }

    try {
      // Llamamos a nuestro agente con el mensaje y el tipo de usuario
      const respuesta = await Agente(mensaje, tipoUsuario);
      console.log("\Chirrit:", respuesta, "\n");
    } catch (err) {
      console.error("Error:", err.message);
    }

    // Volvemos a preguntar para mantener el loop
    preguntar();
  });
}

// Iniciamos el loop de preguntas+

preguntar();
