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

// Get AI leads stats for admin dashboard
export const getAILeadsStats = query({
  args: {},
  handler: async (ctx) => {
    const allLeads = await ctx.db.query("aiLeads").collect();
    const totalLeads = allLeads.length;

    // Count leads from last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentLeads = allLeads.filter((l) => l.createdAt > thirtyDaysAgo).length;

    // Count leads from previous 30 days for growth calculation
    const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
    const previousPeriodLeads = allLeads.filter(
      (l) => l.createdAt > sixtyDaysAgo && l.createdAt <= thirtyDaysAgo
    ).length;

    // Calculate growth percentage
    const growth =
      previousPeriodLeads > 0
        ? Math.round(((recentLeads - previousPeriodLeads) / previousPeriodLeads) * 100)
        : recentLeads > 0
        ? 100
        : 0;

    // Conversion rate
    const convertedLeads = allLeads.filter((l) => l.convertedToCustomer).length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return {
      totalLeads,
      recentLeads,
      growth,
      conversionRate,
    };
  },
});

// Get recent AI leads for admin dashboard
export const getRecentAILeads = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    const leads = await ctx.db
      .query("aiLeads")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);

    return leads;
  },
});

// List all AI leads with pagination
export const listAILeads = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    const limit = args.limit || 20;

    const allLeads = await ctx.db
      .query("aiLeads")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    const totalCount = allLeads.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const leads = allLeads.slice(startIndex, startIndex + limit);

    return {
      leads,
      totalCount,
      totalPages,
      currentPage: page,
    };
  },
});
