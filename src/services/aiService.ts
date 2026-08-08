/**
 * Service to communicate with the Food Safety AI Chatbot (Cloudflare Worker).
 */

// The deployed Cloudflare Worker URL
const WORKER_URL = "https://food-safety-bot.worker-chatbot.workers.dev";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  answer?: string;
  error?: string;
}

export async function askFoodSafetyQuestion(
  question: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, history }),
    });

    if (!response.ok) {
      // Handle HTTP errors
      return { error: `Server error: ${response.status}` };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    return { error: "Network error or service unavailable." };
  }
}
