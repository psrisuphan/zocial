"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : "/auth/reset-password";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <Card>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4 text-2xl">
            ✉️
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">Check your email</h1>
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
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-xl font-bold text-text-primary mb-1">Forgot Password</h1>
      <p className="text-sm text-text-muted mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
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
          disabled={loading || !email}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-text-link hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
