import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new lead from quiz submission
export const createFromQuiz = mutation({
  args: {
    email: v.string(),
    attachmentStyle: v.string(),
    quizAnswers: v.any(),
  },
  handler: async (ctx, args) => {
    // Check if lead already exists with this email
    const existingLead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingLead) {
      // Update existing lead with new quiz data
      await ctx.db.patch(existingLead._id, {
        attachmentStyle: args.attachmentStyle,
        quizAnswers: args.quizAnswers,
        createdAt: Date.now(), // Update timestamp
      });
      return existingLead._id;
    }

    // Create new lead
    const leadId = await ctx.db.insert("leads", {
      email: args.email,
      source: "quiz",
      attachmentStyle: args.attachmentStyle,
      quizAnswers: args.quizAnswers,
      convertedToCustomer: false,
      createdAt: Date.now(),
    });

    return leadId;
  },
});

// List all leads with pagination
export const list = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const limit = args.limit ?? 20;

    const leads = await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    const total = leads.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedLeads = leads.slice(start, start + limit);

    return {
      leads: paginatedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },
});

// Get lead stats for dashboard
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    const currentPeriodLeads = leads.filter((l) => l.createdAt >= thirtyDaysAgo);
    const previousPeriodLeads = leads.filter(
      (l) => l.createdAt >= sixtyDaysAgo && l.createdAt < thirtyDaysAgo
    );

    const converted = leads.filter((l) => l.convertedToCustomer);

    // Count by attachment style
    const byAttachmentStyle: Record<string, number> = {};
    leads.forEach((lead) => {
      if (lead.attachmentStyle) {
        byAttachmentStyle[lead.attachmentStyle] =
          (byAttachmentStyle[lead.attachmentStyle] || 0) + 1;
      }
    });

    // Calculate growth
    const growth =
      previousPeriodLeads.length > 0
        ? ((currentPeriodLeads.length - previousPeriodLeads.length) /
            previousPeriodLeads.length) *
          100
        : currentPeriodLeads.length > 0
          ? 100
          : 0;

    return {
      totalLeads: leads.length,
      leadsThisPeriod: currentPeriodLeads.length,
      growth: Math.round(growth),
      convertedCount: converted.length,
      conversionRate:
        leads.length > 0
          ? Math.round((converted.length / leads.length) * 100)
          : 0,
      byAttachmentStyle,
    };
  },
});

// Get recent leads for dashboard
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const leads = await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);

    return leads;
  },
});
