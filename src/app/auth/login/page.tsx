"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAuthError } from "@/lib/authErrors";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, PasswordInput, useToast } from "@/components/ui";
import { AuthShell } from "@/components/features/auth";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(getAuthError(error.message));
        return;
      }
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome Back</h1>
      <p className="text-sm text-text-muted mb-6">Log in to your Zocial account</p>

      <form onSubmit={handleLogIn} className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-1">
          <PasswordInput
            label="Password"
            id="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-text-muted hover:text-text-link transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

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
          disabled={!email || !password}
        >
          Log In
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-text-link hover:underline">
          Sign up
        </Link>
      </p>
    </div>
    </AuthShell>
  );
}
