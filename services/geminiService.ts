import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getTreeHoleResponse = async (userContent: string, mood: string): Promise<string> => {
  const client = getClient();
  if (!client) return "树洞静悄悄的，似乎在倾听... (API Key missing)";

  try {
    const prompt = `
      用户刚刚在“树洞”应用里写下了一段心事。
      内容: "${userContent}"
      当前心情标签: "${mood}"
      
      请你扮演一个住在古老树洞里的温柔精灵或回声。
      任务：
      1. 用简短、温柔、充满诗意和治愈感的话语回复用户。
      2. 就像风吹过树叶的声音，给予抚慰或共鸣。
      3. 不要说教，不要长篇大论，字数控制在60字以内。
      4. 语气要温暖，像是一个拥抱。
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "风声温柔地拂过...";
  } catch (error) {
    console.error("Error getting tree hole response:", error);
    return "树洞今天似乎睡着了...";
  }
};