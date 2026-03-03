"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, MailCheck, Lock, KeyRound, CalendarDays } from "lucide-react";
import { signUp } from "@/actions/auth";
import { calculateAge } from "@/lib/validation";

export default function SignUpPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (email !== confirmEmail) {
      setError("Email addresses do not match.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least 1 uppercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least 1 number.");
      return;
    }

    // Age validation: must be at least 16
    if (calculateAge(birthDate) < 16) {
      setError("You must be at least 16 years old to register.");
      return;
    }

    setLoading(true);

    const result = await signUp({
      nickname,
      email,
      password,
      birthDate,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#000]">
        <div className="w-full max-w-md border border-[#00FF00]/30 bg-[#000] p-8 font-mono">
          <h1 className="mb-4 text-xl font-bold text-[#00FF00]">
            REGISTRATION COMPLETE
          </h1>
          <p className="mb-6 text-sm text-[#00FF00]/70">
            Registration successful. Please check your email for the
            confirmation link from our domain.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full border border-[#00FF00] bg-[#00FF00]/10 py-2 text-sm font-bold text-[#00FF00] hover:bg-[#00FF00]/20"
          >
            GO TO SIGN IN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000]">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md border border-[#00FF00]/30 bg-[#000] p-8 font-mono"
      >
        <h1 className="mb-2 text-xl font-bold text-[#00FF00]">
          CAH TERMINAL
        </h1>
        <p className="mb-6 text-sm text-[#00FF00]/70">
          Create Account
        </p>

        {error && (
          <div className="mb-4 border border-[#FF0000]/50 bg-[#FF0000]/10 p-2 text-xs text-[#FF0000]">
            {error}
          </div>
        )}

        <label className="mb-1 flex items-center gap-2 text-xs text-[#00FF00]/60">
          <User size={14} /> NICKNAME
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="mb-4 w-full border border-[#00FF00]/30 bg-[#000] px-3 py-2 text-sm text-[#00FF00] outline-none focus:border-[#00FF00]"
        />

        <label className="mb-1 flex items-center gap-2 text-xs text-[#00FF00]/60">
          <Mail size={14} /> EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full border border-[#00FF00]/30 bg-[#000] px-3 py-2 text-sm text-[#00FF00] outline-none focus:border-[#00FF00]"
        />

        <label className="mb-1 flex items-center gap-2 text-xs text-[#00FF00]/60">
          <MailCheck size={14} /> CONFIRM EMAIL
        </label>
        <input
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
          className="mb-4 w-full border border-[#00FF00]/30 bg-[#000] px-3 py-2 text-sm text-[#00FF00] outline-none focus:border-[#00FF00]"
        />

        <label className="mb-1 flex items-center gap-2 text-xs text-[#00FF00]/60">
          <Lock size={14} /> PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="mb-4 w-full border border-[#00FF00]/30 bg-[#000] px-3 py-2 text-sm text-[#00FF00] outline-none focus:border-[#00FF00]"
        />

        <label className="mb-1 flex items-center gap-2 text-xs text-[#00FF00]/60">
          <KeyRound size={14} /> CONFIRM PASSWORD
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="mb-4 w-full border border-[#00FF00]/30 bg-[#000] px-3 py-2 text-sm text-[#00FF00] outline-none focus:border-[#00FF00]"
        />

        <label className="mb-1 flex items-center gap-2 text-xs text-[#00FF00]/60">
          <CalendarDays size={14} /> BIRTH DATE
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          max={new Date().toISOString().split("T")[0]}
          className="mb-6 w-full border border-[#00FF00]/30 bg-[#000] px-3 py-2 text-sm text-[#00FF00] outline-none focus:border-[#00FF00]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-[#00FF00] bg-[#00FF00]/10 py-2 text-sm font-bold text-[#00FF00] hover:bg-[#00FF00]/20 disabled:opacity-50"
        >
          {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
        </button>

        <p className="mt-4 text-center text-xs text-[#00FF00]/50">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00FF00] hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
