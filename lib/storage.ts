// In-memory storage for MVP (replace with DB later)

export interface InterviewSession {
	id: string;
	jobDescription: string;
	questions: string[];
	answers: string[];
	feedback: QuestionFeedback[] | null;
	overallScore: number | null;
	grade: string | null;
	summary: string | null;
	strengths: string[] | null;
	weaknesses: string[] | null;
	createdAt: Date;
	completedAt: Date | null;
}

export interface QuestionFeedback {
	question: string;
	answer: string;
	score: string;
	feedback: string;
}

const sessions = new Map<string, InterviewSession>();

export async function createSession(session: InterviewSession): Promise<void> {
	sessions.set(session.id, session);
}

export async function getSession(id: string): Promise<InterviewSession | null> {
	return sessions.get(id) || null;
}

export async function updateSession(id: string, updates: Partial<InterviewSession>): Promise<void> {
	const session = sessions.get(id);
	if (session) {
		sessions.set(id, { ...session, ...updates });
	}
}
