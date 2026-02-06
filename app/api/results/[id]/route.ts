import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/storage";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const session = await getSession(id);

		if (!session) {
			return NextResponse.json({ error: "Session not found" }, { status: 404 });
		}

		return NextResponse.json({
			id: session.id,
			questions: session.questions,
			feedback: session.feedback,
			overallScore: session.overallScore,
			grade: session.grade,
			summary: session.summary,
			strengths: session.strengths,
			weaknesses: session.weaknesses,
			completedAt: session.completedAt,
		});
	} catch (error) {
		console.error("Get results error:", error);
		return NextResponse.json({ error: "Failed to get results" }, { status: 500 });
	}
}
