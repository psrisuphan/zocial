"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { getAuthError } from "@/lib/authErrors";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button, Card, useToast,
  PasswordInput, PasswordRequirements,
  checkPassword, isPasswordValid,
} from "@/components/ui";
import { AuthShell } from "@/components/features/auth";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  const strength = checkPassword(password);
  const passwordValid = isPasswordValid(strength);
  const passwordsMatch = password === confirmPassword;
  const confirmError =
    confirmPassword.length > 0 && !passwordsMatch ? "Passwords do not match" : undefined;
  const canSubmit = passwordValid && passwordsMatch && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(getAuthError(error.message));
        return;
      }
      setDone(true);
      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell>
      <Card>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4 text-xl font-bold text-accent">
            ✓
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">Password Updated</h1>
          <p className="text-sm text-text-muted">Redirecting you to the app...</p>
        </div>
      </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
    <Card>
      <h1 className="text-xl font-bold text-text-primary mb-1">Set New Password</h1>
      <p className="text-sm text-text-muted mb-6">Choose a strong new password.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <PasswordInput
            label="New Password"
            id="new-password"
            name="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <PasswordRequirements password={password} visible={password.length > 0} />
        </div>

        <PasswordInput
          label="Confirm New Password"
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
          Update Password
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        <Link href="/auth/login" className="text-text-link hover:underline">
          Back to Log In
        </Link>
      </p>
    </Card>
    </AuthShell>
  );
}
