import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const SAMPLE_DONATIONS = [
  {
    name: "ぴょん吉",
    planId: "frog-palace",
    planLabel: "ケロ宮殿フルサポート",
    amount: 6000,
    message: "ケロちゃんの削除癖は文化遺産。",
    createdAt: new Date("2025-10-07T12:32:00+09:00").getTime(),
  },
  {
    name: "ゆい",
    planId: "panic-button",
    planLabel: "メッセージ消去ストッパー",
    amount: 2500,
    message: "削除された瞬間にスクショする係です。",
    createdAt: new Date("2025-10-09T21:15:00+09:00").getTime(),
  },
  {
    name: "のぶ",
    planId: "ribbit-lite",
    planLabel: "月額監視ライト",
    amount: 500,
    message: "定期的にぴょんと応援していきます！",
    createdAt: new Date("2025-10-11T09:48:00+09:00").getTime(),
  },
] as const;

const RECENT_DONATIONS_LIMIT = 200;

export const list = query({
  args: {},
  handler: async (ctx) =>
    await ctx.db
      .query("donations")
      .withIndex("by_created_at")
      .order("desc")
      .take(RECENT_DONATIONS_LIMIT),
});

export const create = mutation({
  args: {
    name: v.string(),
    planId: v.string(),
    planLabel: v.string(),
    amount: v.number(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const createdAt = Date.now();
    await ctx.db.insert("donations", { ...args, createdAt });
  },
});

export const ensureSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("donations")
      .withIndex("by_created_at")
      .take(1);

    if (existing.length > 0) {
      return { inserted: 0 };
    }

    for (const donation of SAMPLE_DONATIONS) {
      await ctx.db.insert("donations", donation);
    }

    return { inserted: SAMPLE_DONATIONS.length };
  },
});
