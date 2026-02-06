import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSession, updateSession } from "@/lib/storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId, answers } = await request.json();

    if (!sessionId || !answers) {
      return NextResponse.json(
        { error: "Session ID and answers are required" },
        { status: 400 }
      );
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Build Q&A pairs for analysis
    const qaText = session.questions
      .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(No answer provided)"}`)
      .join("\n\n");

    const prompt = `You are a brutally honest interview coach. A candidate just answered 10 interview questions for this role. Analyze their performance.

JOB CONTEXT:
${session.jobDescription.substring(0, 500)}...

QUESTIONS AND ANSWERS:
${qaText}

Provide your analysis in this JSON format:
{
  "overallScore": 0-100,
  "grade": "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", or "F",
  "summary": "2-3 sentences brutally summarizing their interview performance",
  "strengths": ["3 things they did well"],
  "weaknesses": ["3 things they need to fix"],
  "questionFeedback": [
    {
      "question": "the question text",
      "score": "A to F grade for this answer",
      "feedback": "Specific, actionable feedback for this answer"
    }
  ]
}

Be savage but constructive. Point out vague answers, missing metrics, red flags, and missed opportunities. But also acknowledge what worked.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a brutally honest interview coach. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const analysis = JSON.parse(content);

    // Update session with results
    await updateSession(sessionId, {
      answers,
      feedback: analysis.questionFeedback.map((f: { question: string; score: string; feedback: string }, i: number) => ({
        question: session.questions[i],
        answer: answers[i],
        score: f.score,
        feedback: f.feedback,
      })),
      overallScore: analysis.overallScore,
      grade: analysis.grade,
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      completedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to analyze answers" },
      { status: 500 }
    );
  }
}
