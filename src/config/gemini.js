import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Falta el Api");
}

export const ai = new GoogleGenAI({ apiKey });