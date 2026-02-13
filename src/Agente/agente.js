// Agente de texto: arma el prompt y llama al modelo

import { ai } from "../config/gemini.js";
import { pSistema } from "../prompts/pSistema.js";
import { pLogica } from "../prompts/pLogica.js";

export async function Agente(mensajeUser, tipoUsuario = "free") {

// Elige el modelo en función del tipo de usuario
  // const modelo =
   //  tipoUsuario === "pro"
    //   ? "gemini-3-flash-preview"     
     //  : "gemini-3-flash-preview";      

  const modelo = "gemini-3-flash-preview";

  // Construimos el prompt completo siguiendo tu estructura de Trello
  const prompt = `

    [SISTEMA]
    ${pSistema}

    [USUARIO]
    ${mensajeUser}

    ${pLogica}
`;

  // Llamamos al modelo con el prompt como mensaje de usuario
  const respuesta = await ai.models.generateContent({
    model: modelo,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  // La respuesta viene como un array de "candidates" con "parts"
  const candidate = respuesta.candidates?.[0];
  if (!candidate) {
    throw new Error("No se recibió ninguna candidate de Gemini");
  }

  // Une todos los textos de las partes en un solo string
  const parts = candidate.content?.parts || [];
  const texto = parts
    .map((part) => part.text || "")
    .join(" ")
    .trim();

  // Busca la etiqueta RESPUESTA
  const indice = texto.indexOf("RESPUESTA:");
  if (indice === -1) return texto;

  // Si no la encuentra, deveuelve todo el texto
  return texto.slice(indice + "RESPUESTA:".length).trim();
}
