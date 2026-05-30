"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAuthError } from "@/lib/authErrors";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button, Input,
  PasswordInput, PasswordRequirements,
  checkPassword, isPasswordValid,
  useToast,
} from "@/components/ui";
import { AuthShell } from "@/components/features/auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  const strength = checkPassword(password);
  const passwordValid = isPasswordValid(strength);
  const passwordsMatch = password === confirmPassword;
  const confirmError =
    confirmPassword.length > 0 && !passwordsMatch ? "Passwords do not match" : undefined;
  const canSubmit = email && passwordValid && passwordsMatch && confirmPassword.length > 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(getAuthError(error.message));
        return;
      }
      toast.success("Account created! Set up your profile.");
      router.push("/auth/setup-profile");
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Create Account</h1>
      <p className="text-sm text-text-muted mb-6">Join Zocial to start chatting</p>

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <PasswordRequirements password={password} visible={password.length > 0} />
        </div>

        <PasswordInput
          label="Confirm Password"
          id="confirm-password"
          name="confirm-password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={confirmError}
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
          disabled={!canSubmit}
        >
          Sign Up
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-text-link hover:underline">
          Log in
        </Link>
      </p>
    </div>
    </AuthShell>
  );
}
