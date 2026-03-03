"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          birth_date: birthDate,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-full max-w-sm border border-neutral-800 bg-black p-8">
          <h1 className="mb-4 font-mono text-xl font-bold text-green-500">
            REGISTRATION COMPLETE
          </h1>
          <p className="mb-6 font-mono text-sm text-neutral-400">
            Check your email to confirm your account, then sign in.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-amber-600 py-2 font-mono text-sm font-bold text-black hover:bg-amber-500"
          >
            GO TO SIGN IN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-sm border border-neutral-800 bg-black p-8"
      >
        <h1 className="mb-6 font-mono text-xl font-bold text-amber-500">
          CAH TERMINAL
        </h1>
        <p className="mb-6 font-mono text-sm text-neutral-400">
          Create Account
        </p>

        {error && (
          <div className="mb-4 border border-red-800 bg-red-950 p-2 font-mono text-xs text-red-400">
            {error}
          </div>
        )}

        <label className="mb-1 block font-mono text-xs text-neutral-500">
          EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-sm text-white outline-none focus:border-amber-500"
        />

        <label className="mb-1 block font-mono text-xs text-neutral-500">
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mb-4 w-full border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-sm text-white outline-none focus:border-amber-500"
        />

        <label className="mb-1 block font-mono text-xs text-neutral-500">
          BIRTH DATE
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          max={new Date().toISOString().split("T")[0]}
          className="mb-6 w-full border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-sm text-white outline-none focus:border-amber-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 py-2 font-mono text-sm font-bold text-black hover:bg-amber-500 disabled:opacity-50"
        >
          {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
        </button>

        <p className="mt-4 text-center font-mono text-xs text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
