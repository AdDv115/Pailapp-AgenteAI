import { ai } from "../config/gemini.js";
import { pSistema } from "../prompts/pSistema.js";
import { pLogica } from "../prompts/pLogica.js";

export async function Agente(mensajeUser) {
  const prompt = `
[SISTEMA]
${pSistema}

[USUARIO]
${mensajeUser}

${pLogica}
`;

  const respuesta = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const candidate = respuesta.candidates?.[0];
  if (!candidate) {
    throw new Error("No se recibió ninguna candidate de Gemini");
  }

  const parts = candidate.content?.parts || [];
  const texto = parts
    .map((part) => part.text || "")
    .join(" ")
    .trim();

  const indice = texto.indexOf("RESPUESTA:");
  if (indice === -1) return texto;

  return texto.slice(indice + "RESPUESTA:".length).trim();
}
