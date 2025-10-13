import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  donations: defineTable({
    name: v.string(),
    planId: v.string(),
    planLabel: v.string(),
    amount: v.number(),
    message: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
});
