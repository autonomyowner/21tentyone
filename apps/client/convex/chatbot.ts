"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// System prompt for T21 assistant
const SYSTEM_PROMPT = `You are T21, a friendly and empathetic AI assistant for 21|Twenty One - a 21-day attachment healing program.

About the Program:
- 21|Twenty One is a transformative 21-day journey designed to help people understand their attachment style and heal emotional wounds
- The program helps users identify whether they have anxious, avoidant, disorganized, or secure attachment patterns
- Each day includes guided exercises, reflections, and practical tools for building healthier relationship patterns
- The program covers topics like inner child healing, boundary setting, self-love practices, and communication skills

Your Role:
- Help visitors understand what attachment styles are and how they affect relationships
- Explain the benefits of the 21-day healing journey
- Answer questions about the program structure and what participants can expect
- Be warm, supportive, and understanding - many visitors may be struggling with relationship issues
- Encourage users to take the free attachment style quiz on the site
- If users seem ready to commit, guide them toward purchasing the program

Key Points to Share:
- Attachment styles develop in childhood and affect adult relationships
- The 4 main attachment styles: Secure, Anxious, Avoidant, and Disorganized
- Healing is possible - the brain can form new patterns with consistent practice
- 21 days is scientifically backed as the time needed to form new habits
- The program is self-paced and can be done from home

Guidelines:
- Keep responses concise but helpful (2-4 sentences usually)
- Be encouraging without being pushy
- If asked about pricing, mention the program is affordable and they can check the website for current offers
- Don't make up specific prices or features not mentioned above
- If someone shares personal struggles, be empathetic but remind them you're an AI and suggest professional help for serious issues

Always be warm, genuine, and focused on helping visitors understand how 21|Twenty One can support their healing journey.`;

// OpenRouter API call using Claude 3 Haiku (cheapest Anthropic model)
export const sendMessage = action({
  args: {
    sessionId: v.string(),
    message: v.string(),
    conversationHistory: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args): Promise<{ response: string }> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    // Build messages array with conversation history
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...args.conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: args.message },
    ];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://21twentyone.com",
          "X-Title": "21|Twenty One Chatbot",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API error:", errorText);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content;

      if (!assistantMessage) {
        throw new Error("No response from AI model");
      }

      // Save messages to database
      await ctx.runMutation(internal.chat.saveMessage, {
        sessionId: args.sessionId,
        role: "user",
        content: args.message,
      });

      await ctx.runMutation(internal.chat.saveMessage, {
        sessionId: args.sessionId,
        role: "assistant",
        content: assistantMessage,
      });

      return { response: assistantMessage };
    } catch (error) {
      console.error("Chatbot error:", error);
      throw new Error("Failed to get response from AI assistant");
    }
  },
});
