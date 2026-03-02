import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  vibeMatch: string;
}

export async function generateRecipe(ingredients: string[], vibe: string): Promise<Recipe> {
  const prompt = `I have these ingredients: ${ingredients.join(", ")}. 
  I'm craving something with a "${vibe}" vibe. 
  Please create a simple, student-friendly recipe that uses most or all of these ingredients. 
  Include a catchy title, a brief description of why it fits the vibe, a list of ingredients (including common pantry staples like salt, oil, etc.), and clear step-by-step instructions.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          prepTime: { type: Type.STRING },
          cookTime: { type: Type.STRING },
          vibeMatch: { type: Type.STRING, description: "A short sentence explaining how this recipe matches the requested vibe." }
        },
        required: ["title", "description", "ingredients", "instructions", "prepTime", "cookTime", "vibeMatch"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as Recipe;
}
