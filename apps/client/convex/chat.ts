import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Save a chat message (internal mutation called from chatbot action)
export const saveMessage = internalMutation({
  args: {
    sessionId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

// Get conversation history for a session
export const getConversationHistory = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt,
    }));
  },
});

// Capture AI lead when user provides email
export const captureAILead = mutation({
  args: {
    email: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists in aiLeads
    const existingLead = await ctx.db
      .query("aiLeads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingLead) {
      // Update existing lead with new interaction
      await ctx.db.patch(existingLead._id, {
        lastInteraction: Date.now(),
        messageCount: existingLead.messageCount + 1,
      });
      return { leadId: existingLead._id, isNew: false };
    }

    // Count messages in this session
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Create new AI lead
    const leadId = await ctx.db.insert("aiLeads", {
      email: args.email,
      sessionId: args.sessionId,
      messageCount: messages.length,
      lastInteraction: Date.now(),
      convertedToCustomer: false,
      createdAt: Date.now(),
    });

    return { leadId, isNew: true };
  },
});

// Update AI lead message count
export const updateAILeadActivity = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db
      .query("aiLeads")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (lead) {
      await ctx.db.patch(lead._id, {
        messageCount: lead.messageCount + 1,
        lastInteraction: Date.now(),
      });
    }
  },
});
