"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function StartPage() {
	const [jobDescription, setJobDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleStart = async () => {
		if (!jobDescription.trim()) return;

		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ jobDescription }),
			});

			const data = await res.json();

			if (data.id) {
				router.push(`/interview/${data.id}`);
			} else {
				setError(data.error || "Failed to generate questions");
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
			<div className="max-w-2xl mx-auto px-6">
				<Card className="bg-gray-800/50 border-gray-700">
					<CardHeader>
						<CardTitle className="text-2xl text-white">Paste the Job Description</CardTitle>
						<CardDescription className="text-gray-400">
							We&apos;ll generate 10 tough interview questions specific to this role
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<Textarea
							placeholder="Paste the full job description here...

Example:
We're looking for a Senior Frontend Engineer to join our team. You'll be responsible for building and maintaining our React-based dashboard, working closely with designers and backend engineers..."
							className="min-h-[300px] bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
							value={jobDescription}
							onChange={(e) => setJobDescription(e.target.value)}
						/>

						{error && <p className="text-red-400 text-sm">{error}</p>}

						<Button
							onClick={handleStart}
							disabled={!jobDescription.trim() || loading}
							className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
						>
							{loading ? "Generating questions..." : "Generate Interview Questions"}
						</Button>

						<p className="text-sm text-gray-500 text-center">
							💳 You&apos;ll be asked to pay after seeing your questions
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
