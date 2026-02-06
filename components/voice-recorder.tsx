"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
	onTranscription: (text: string) => void;
	disabled?: boolean;
}

export function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			setError(null);
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "audio/webm;codecs=opus",
			});

			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
				const url = URL.createObjectURL(audioBlob);
				setAudioUrl(url);

				// Transcribe
				setIsTranscribing(true);
				try {
					const formData = new FormData();
					formData.append("audio", audioBlob, "recording.webm");

					const res = await fetch("/api/transcribe", {
						method: "POST",
						body: formData,
					});

					const data = await res.json();
					if (data.text) {
						onTranscription(data.text);
					} else {
						setError(data.error || "Transcription failed");
					}
				} catch {
					setError("Failed to transcribe audio");
				} finally {
					setIsTranscribing(false);
				}

				// Stop all tracks
				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch {
			setError("Could not access microphone. Please allow microphone access.");
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				{!isRecording ? (
					<Button
						type="button"
						variant="outline"
						onClick={startRecording}
						disabled={disabled || isTranscribing}
						className="border-red-500/50 text-red-400 hover:bg-red-500/10"
					>
						<span className="mr-2">🎤</span>
						{isTranscribing ? "Transcribing..." : "Record Answer"}
					</Button>
				) : (
					<Button
						type="button"
						variant="destructive"
						onClick={stopRecording}
						className="animate-pulse"
					>
						<span className="mr-2">⏹️</span>
						Stop Recording
					</Button>
				)}

				{isRecording && (
					<div className="flex items-center gap-2 text-red-400 text-sm">
						<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
						Recording...
					</div>
				)}
			</div>

			{error && <p className="text-red-400 text-sm">{error}</p>}

			{audioUrl && !isRecording && (
				<div className="bg-gray-800 rounded-lg p-3">
					<p className="text-xs text-gray-400 mb-2">Your recording:</p>
					<audio src={audioUrl} controls className="w-full h-8" />
				</div>
			)}
		</div>
	);
}
