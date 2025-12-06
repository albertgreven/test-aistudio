import { GoogleGenAI, Type } from "@google/genai";
import { GameData, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (): Promise<GameData> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Genereer een quiz in de stijl van "Twee voor Twaalf".
    
    Vereisten:
    1. Kies een enkelvoudig, veelgebruikt, 12-letterig Nederlands zelfstandig naamwoord (geen spaties, geen streepjes). Dit is de 'oplossing'.
    2. Genereer 12 quizvragen.
    3. De eerste letter van het antwoord op vraag 1 moet overeenkomen met de eerste letter van de oplossing.
    4. De eerste letter van het antwoord op vraag 2 moet overeenkomen met de tweede letter van de oplossing, enzovoort.
    5. De antwoorden moeten eenduidig zijn (meestal 1 woord of een naam).
    
    Output JSON formaat.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          solution: {
            type: Type.STRING,
            description: "Het 12-letterige woord.",
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: {
                  type: Type.STRING,
                  description: "De vraag.",
                },
                answerText: {
                  type: Type.STRING,
                  description: "Het antwoord op de vraag.",
                }
              },
              required: ["questionText", "answerText"],
            },
          },
        },
        required: ["solution", "questions"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Geen data ontvangen van Gemini");

  const data = JSON.parse(text);
  
  // Transform to our internal type ensuring IDs and structure
  const cleanSolution = data.solution.trim().toUpperCase();
  
  if (cleanSolution.length !== 12) {
      // Fallback or retry logic could go here, but for simplicity we throw/re-generate
      // In a production app, we might retry loop here.
      console.warn(`Generated solution '${cleanSolution}' is not 12 letters. Proceeding anyway, UI might look odd.`);
  }

  const questions: Question[] = data.questions.map((q: any, index: number) => ({
    id: index + 1,
    text: q.questionText,
    answer: q.answerText,
    targetLetter: cleanSolution[index] || '?',
  }));

  return {
    solution: cleanSolution,
    questions,
  };
};
