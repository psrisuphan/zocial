"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAuthError } from "@/lib/authErrors";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { AuthShell } from "@/components/features/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : "/auth/reset-password";

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) {
        setError(getAuthError(error.message));
        return;
      }
      setSent(true);
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4 text-xl font-bold text-accent">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Check your email</h1>
        <p className="text-sm text-text-muted mb-6">
          We sent a password reset link to{" "}
          <span className="text-text-secondary font-medium">{email}</span>.
          Check your inbox and follow the link.
        </p>
        <Link href="/auth/login">
          <Button variant="ghost" size="md" fullWidth>
            Back to Log In
          </Button>
        </Link>
      </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
    <div>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        ← Back
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-1">Forgot your password?</h1>
      <p className="text-sm text-text-muted mb-6">
        Don&apos;t worry, enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        {error && (
          <p className="text-xs text-status-error bg-status-error/10 px-3 py-2 rounded">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!email}
        >
          Send Reset Link
        </Button>
      </form>
    </div>
    </AuthShell>
  );
}
