"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface QuestionFeedback {
  question: string;
  answer: string;
  score: string;
  feedback: string;
}

interface Results {
  overallScore: number;
  grade: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  feedback: QuestionFeedback[];
}

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch(`/api/results/${id}`);
        const data = await res.json();
        
        if (data.grade) {
          setResults(data);
        } else {
          setError("Results not found");
        }
      } catch {
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [id]);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-400";
    if (grade.startsWith("B")) return "text-blue-400";
    if (grade.startsWith("C")) return "text-yellow-400";
    if (grade.startsWith("D")) return "text-orange-400";
    return "text-red-400";
  };

  const shareOnTwitter = () => {
    const text = `Just got roasted on my interview skills. Grade: ${results?.grade} 💀\n\nPractice tough interview questions:`;
    const url = `${window.location.origin}/results/${id}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading your roast...</p>
      </main>
    );
  }

  if (error || !results) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Results not found"}</p>
          <Link href="/start">
            <Button>Start New Interview</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Score Card */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8 text-center">
          <CardContent className="pt-8 pb-8">
            <p className="text-gray-400 mb-2">Your Interview Readiness Score</p>
            <div className={`text-8xl font-bold ${getGradeColor(results.grade)}`}>
              {results.grade}
            </div>
            <Progress value={results.overallScore} className="h-3 mt-4 max-w-xs mx-auto" />
            <p className="text-2xl text-gray-300 mt-2">{results.overallScore}/100</p>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white">The Verdict 🔥</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed">
              {results.summary}
            </p>
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">✓ What worked</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.strengths.map((s, i) => (
                  <li key={i} className="text-gray-300">• {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">✗ What to fix</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.weaknesses.map((w, i) => (
                  <li key={i} className="text-gray-300">• {w}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Per-question feedback */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Question-by-Question Roast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.feedback.map((q, i) => (
              <div key={i} className="border-b border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-gray-400 text-sm">{q.question}</p>
                  <Badge className={`${getGradeColor(q.score)} bg-transparent border shrink-0`}>
                    {q.score}
                  </Badge>
                </div>
                <p className="text-gray-300">{q.feedback}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="flex flex-col gap-4">
          <Link href="/start">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-6">
              Try Another Interview
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-gray-300"
            onClick={shareOnTwitter}
          >
            Share Results on Twitter
          </Button>
        </div>
      </div>
    </main>
  );
}
