import { AIProvider } from "./ai-service";
import { GroqProvider } from "./providers/groq-provider";
import { GeminiProvider } from "./providers/gemini-provider";

export type AIProviderType = "groq" | "gemini";

export class AIFactory {
  static createProvider(type: AIProviderType): AIProvider {
    switch (type) {
      case "groq":
        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) throw new Error("GROQ_API_KEY not found");
        return new GroqProvider(groqKey);

      case "gemini":
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("GEMINI_API_KEY not found");
        return new GeminiProvider(geminiKey);

      default:
        throw new Error(`Unknown AI provider: ${type}`);
    }
  }

  static getDefaultProvider(): AIProvider {
    // Try providers in order of preference
    if (process.env.GROQ_API_KEY) {
      return this.createProvider("groq");
    }
    if (process.env.GEMINI_API_KEY) {
      return this.createProvider("gemini");
    }
    throw new Error("No AI provider API key found. Please add GROQ_API_KEY or GEMINI_API_KEY to .env.local");
  }
}
