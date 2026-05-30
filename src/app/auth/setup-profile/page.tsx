"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAuthError } from "@/lib/authErrors";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card, ThemeToggle, useToast } from "@/components/ui";
import { useAuth } from "@/components/features/auth";

const USERNAME_RE = /^[a-z0-9_.]{3,30}$/;

export default function SetupProfile() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { refreshProfile } = useAuth();

  // Synchronous format validation for instant feedback.
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameTaken(false);
    if (!value) {
      setUsernameError(null);
      return;
    }
    setUsernameError(
      USERNAME_RE.test(value.toLowerCase())
        ? null
        : "3–30 chars: letters, numbers, _ and . only"
    );
  };

  // Debounced uniqueness check — only fires once a valid format settles.
  useEffect(() => {
    const value = username.toLowerCase();
    if (!USERNAME_RE.test(value)) {
      setCheckingUsername(false);
      return;
    }

    let ignore = false;
    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", value)
        .maybeSingle();
      if (ignore) return;
      setUsernameTaken(!!data);
      setCheckingUsername(false);
    }, 350);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [username]);

  const usernameMessage =
    usernameError ?? (usernameTaken ? "Username already taken" : undefined);
  const canSubmit =
    !usernameMessage && !checkingUsername && !!username && !!displayName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError("Session expired. Please sign in again.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("profiles").insert([{
        id: userData.user.id,
        username: username.toLowerCase(),
        display_name: displayName,
        bio: bio || null,
        avatar_url: null,
      }]);

      if (error) {
        setError(getAuthError(error.message));
        return;
      }

      await refreshProfile();
      toast.success("Profile created! Welcome to Zocial.");
      router.push("/dashboard");
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <header className="flex justify-end p-3">
        <ThemeToggle />
      </header>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <Card className="relative overflow-hidden">
            {/* accent flourish */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent-hover to-accent-active" />
            <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent-subtle blur-2xl" />

            <div className="relative">
              <h1 className="text-xl font-bold text-text-primary mb-1">Set Up Profile</h1>
              <p className="text-sm text-text-muted mb-6">Create your Zocial identity</p>

              <div className="flex justify-center mb-8">
                <div
                  title="Avatar upload coming soon"
                  className="relative w-20 h-20 rounded-full bg-bg-surface ring-2 ring-accent/30 border-2 border-dashed border-accent/40 flex items-center justify-center cursor-pointer group hover:border-accent hover:ring-accent/50 transition-all"
                >
                  <span className="text-2xl text-accent/70 group-hover:text-accent transition-colors select-none">
                    +
                  </span>
                  <span className="absolute -bottom-5 text-xs text-text-muted whitespace-nowrap">
                    Add photo (soon)
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="johndoe"
                  hint={checkingUsername ? "Checking availability…" : "How others will find and add you"}
                  error={usernameMessage}
                  required
                />
                <Input
                  label="Display Name"
                  type="text"
                  name="display_name"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  hint="Shown in chats and your profile"
                  required
                />
                <Textarea
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about yourself..."
                  rows={3}
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
                  Continue
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
