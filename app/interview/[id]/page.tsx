"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/session/${id}`);
        const data = await res.json();
        
        if (data.questions) {
          setQuestions(data.questions);
          setAnswers(new Array(data.questions.length).fill(""));
        } else {
          setError("Session not found");
        }
      } catch {
        setError("Failed to load interview");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [id]);

  const progress = questions.length > 0 ? ((currentQuestion) / questions.length) * 100 : 0;

  const handleNext = async () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(newAnswers[currentQuestion + 1] || "");
    } else {
      // All done, submit answers
      setSubmitting(true);
      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: id, answers: newAnswers }),
        });

        if (res.ok) {
          router.push(`/results/${id}`);
        } else {
          setError("Failed to submit. Please try again.");
          setSubmitting(false);
        }
      } catch {
        setError("Failed to submit. Please try again.");
        setSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = currentAnswer;
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(newAnswers[currentQuestion - 1] || "");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading interview...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => router.push("/start")}>Start Over</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-red-400 border-red-400">
                Q{currentQuestion + 1}
              </Badge>
              {currentQuestion >= questions.length - 3 && (
                <Badge className="bg-red-600">Hard</Badge>
              )}
            </div>
            <CardTitle className="text-xl text-white leading-relaxed">
              {questions[currentQuestion]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your answer here... Be specific and use real examples from your experience."
              className="min-h-[200px] bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={submitting}
            />
            <p className="text-sm text-gray-500 mt-2">
              💡 Tip: Use the STAR method (Situation, Task, Action, Result)
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || submitting}
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            ← Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={submitting}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {submitting 
              ? "Analyzing..." 
              : currentQuestion === questions.length - 1 
                ? "Get My Roast 🔥" 
                : "Next →"}
          </Button>
        </div>
      </div>
    </main>
  );
}
