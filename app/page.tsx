import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Practice the questions they&apos;re{" "}
          <span className="text-red-500">afraid</span> to ask you
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Paste any job description. Get 10 brutal interview questions tailored to that role. 
          Answer them. Get roasted on what you got wrong.
        </p>
        <Link href="/start">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
            Start Your Mock Interview — $5
          </Button>
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          Or <span className="text-red-400">$19/mo</span> for unlimited interviews
        </p>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">1. Paste the JD</h3>
            <p className="text-gray-400">Drop in any job description you&apos;re preparing for</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold mb-2">2. Answer questions</h3>
            <p className="text-gray-400">10 tough questions specific to that role. No softballs.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold mb-2">3. Get roasted</h3>
            <p className="text-gray-400">Brutally honest feedback on every answer + readiness score</p>
          </div>
        </div>
      </div>

      {/* Sample questions */}
      <div className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8">Sample questions you might get</h2>
        <div className="space-y-4 text-gray-300">
          <p className="p-4 bg-gray-800/50 rounded-lg">
            &quot;Tell me about a time you had to push back on a product decision. What happened?&quot;
          </p>
          <p className="p-4 bg-gray-800/50 rounded-lg">
            &quot;Your biggest technical mistake and what you learned from it.&quot;
          </p>
          <p className="p-4 bg-gray-800/50 rounded-lg">
            &quot;Why should we hire you over someone with 2 more years of experience?&quot;
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Stop winging interviews</h2>
        <p className="text-gray-400 mb-8">
          The candidates who get offers are the ones who practiced the hard questions.
        </p>
        <Link href="/start">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
            Start Interview — $5
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
        <p>Built by someone who bombed too many interviews</p>
      </footer>
    </main>
  );
}
