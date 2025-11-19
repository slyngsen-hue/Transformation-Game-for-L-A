import { GoogleGenAI, Type } from "@google/genai";
import { ScenarioData, AnalysisData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = 'gemini-2.5-flash';

export const generateScenario = async (): Promise<ScenarioData> => {
  try {
    const prompt = `
      Generate a high-stakes strategic scenario for a University President or Provost.
      
      Context: Higher Education in the US.
      Themes: Enrollment cliffs, structural budget deficits, siloed academic vs administrative functions, or integrating AI into legacy systems.
      
      The problem should imply a need for 'Realignment', 'Capacity Building', or 'Resource Optimization' to fit the pieces of the university together.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A professional title for the crisis (e.g., 'The Retention Paradox')" },
            description: { type: Type.STRING, description: "2-3 sentences describing the institutional mess." },
            stakes: { type: Type.STRING, description: "The immediate risk (e.g., accreditation warning, financial exigency)." }
          },
          required: ["title", "description", "stakes"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ScenarioData;
  } catch (error) {
    console.error("Error generating scenario:", error);
    // Fallback 
    return {
      title: "The Enrollment Cliff",
      description: "While recruitment marketing has increased applications, first-year retention has plummeted. The university is top-heavy with administrative costs while academic programs are starving.",
      stakes: "The Board represents a vote of no confidence if a sustainable financial framework isn't presented immediately."
    };
  }
};

export const analyzePerformance = async (moves: number, optimalMoves: number, scenario: ScenarioData): Promise<AnalysisData> => {
  try {
    const prompt = `
      The user played a game called "Strategic Alignment" (based on Tetris mechanics).
      Context: Higher Education Consulting (Lynnerup & Ansell).
      
      Scenario: ${scenario.title}
      Lines Cleared (Goals Met): ${moves} (Goal was 5).
      
      Act as a Senior Partner at "Lynnerup & Ansell". 
      We specialize in: Strategy & Finance, Enrollment Management, AI-powered institutions, Operational Excellence, and Organization & People.
      
      Metaphor:
      - The falling blocks were "Resources" or "Capabilities".
      - Clearing lines was "Executing Strategy" or "Finding Efficiencies".
      
      Provide feedback:
      - Praise their ability to make pieces fit under pressure.
      - Connect "Tetris" logic to "Institutional Transformation" (e.g., "You can't just pile up initiatives; you need to integrate them").

      Consultant Note should pitch a specific L&A expertise area.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING, description: "Analysis of their leadership style." },
            score: { type: Type.NUMBER, description: "Score out of 100." },
            consultantNote: { type: Type.STRING, description: "Specific L&A value proposition connection." }
          },
          required: ["feedback", "score", "consultantNote"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisData;
  } catch (error) {
    console.error("Error analyzing performance:", error);
    return {
      feedback: "You demonstrated that meaningful change requires alignment. Simply adding more resources (blocks) without a plan only creates clutter.",
      score: 88,
      consultantNote: "Lynnerup & Ansell helps leaders build resilient, adaptive organizations by embedding robust performance management cultures that align resources to mission."
    };
  }
};