import { GoogleGenAI } from "@google/genai";
import { ShiftBlock, Staff, PositionType } from '../types';

const formatTime = (hour: number) => {
  const h = Math.floor(hour);
  const m = (hour % 1) * 60;
  return `${h}:${m === 0 ? '00' : '30'}`;
};

export const getShiftAdvice = async (
  date: string,
  shifts: ShiftBlock[],
  staffList: Staff[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "API Key is missing. Please check your environment configuration.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare data for the prompt
    const shiftSummary = shifts.map(s => {
      const staff = staffList.find(st => st.id === s.staffId);
      return `${formatTime(s.startHour)} - ${formatTime(s.endHour)} : ${staff?.name} (${s.position})`;
    }).join('\n');

    const prompt = `
      You are an expert store manager assistant for a Bento/Food shop. 
      Analyze the following shift schedule for ${date}.
      
      Positions available: 
      - ホール (Hall/Service)
      - サラダ (Salad prep)
      - 火場 (Cooking/Grill)
      - お弁当 (Bento assembly)
      - PC詰め (PC Packing/Admin)

      Operating Hours: 06:00 to 23:00.
      
      Current Assignments:
      ${shiftSummary || "No shifts assigned yet."}
      
      Please provide a brief, bulleted list of advice. 
      Focus on:
      1. Coverage gaps (e.g., is the kitchen/hibana covered during peak hours?).
      2. Staff workload balance between the 5 distinct positions.
      3. Suggestions for improvement.
      
      Keep it concise and professional (Japanese).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Service is currently unavailable.";
  }
};