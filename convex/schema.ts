import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	sessions: defineTable({
		sessionId: v.string(),
		jobDescription: v.string(),
		questions: v.array(v.string()),
		answers: v.optional(v.array(v.string())),
		createdAt: v.number(),
		completedAt: v.optional(v.number()),
	}).index("by_sessionId", ["sessionId"]),

	results: defineTable({
		sessionId: v.string(),
		overallScore: v.number(),
		grade: v.string(),
		summary: v.string(),
		strengths: v.array(v.string()),
		weaknesses: v.array(v.string()),
		feedback: v.array(
			v.object({
				question: v.string(),
				answer: v.string(),
				score: v.string(),
				feedback: v.string(),
			})
		),
		createdAt: v.number(),
	}).index("by_sessionId", ["sessionId"]),
});
