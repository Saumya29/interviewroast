import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const audioFile = formData.get("audio") as File;

		if (!audioFile) {
			return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
		}

		// Convert to buffer for OpenAI
		const buffer = Buffer.from(await audioFile.arrayBuffer());

		// Create a File object that OpenAI accepts
		const file = new File([buffer], "audio.webm", { type: "audio/webm" });

		const transcription = await openai.audio.transcriptions.create({
			file,
			model: "whisper-1",
			language: "en",
		});

		return NextResponse.json({ text: transcription.text });
	} catch (error) {
		console.error("Transcription error:", error);
		return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
	}
}
