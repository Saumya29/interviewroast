import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createSession } from "@/lib/storage";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
	try {
		const { jobDescription } = await request.json();

		if (!jobDescription) {
			return NextResponse.json({ error: "Job description is required" }, { status: 400 });
		}

		const prompt = `You are a tough interview coach. Based on this job description, generate 10 challenging interview questions that would really test a candidate.

JOB DESCRIPTION:
${jobDescription}

Generate questions that:
1. Are specific to this role and industry
2. Include behavioral questions (tell me about a time...)
3. Include technical/skill-based questions where relevant
4. Include at least 2-3 "hard" questions that make candidates uncomfortable
5. Test for red flags hiring managers look for

Return a JSON object with this structure:
{
  "questions": ["question 1", "question 2", ...]
}

Make questions progressively harder. The last 3 should be the toughest.`;

		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content:
						"You are a senior hiring manager who has conducted hundreds of interviews. Generate tough, specific interview questions. Respond only with valid JSON.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			response_format: { type: "json_object" },
			temperature: 0.8,
		});

		const content = completion.choices[0].message.content;
		if (!content) {
			throw new Error("No response from AI");
		}

		const { questions } = JSON.parse(content);
		const id = nanoid(10);

		await createSession({
			id,
			jobDescription,
			questions,
			answers: [],
			feedback: null,
			overallScore: null,
			grade: null,
			summary: null,
			strengths: null,
			weaknesses: null,
			createdAt: new Date(),
			completedAt: null,
		});

		return NextResponse.json({ id, questions });
	} catch (error) {
		console.error("Start error:", error);
		return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
	}
}
