import { GoogleGenAI, Type } from "@google/genai";

export const getZoningAdvice = async (zone: string, area: number, location: string) => {
  try {
    // Fix: Initialize GoogleGenAI inside the function to ensure the most up-to-date API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, professional planning advice for a ${area} sqm project in a ${zone} zone at ${location}. Suggest common regulations or typical uses for this zone in a Philippine city context. Keep it under 100 words.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Planning advice currently unavailable. Please consult the City Planning guidelines manually.";
  }
};