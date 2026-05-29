"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card } from "@/components/ui";

export default function SetupProfile() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const checkUsername = async (value: string) => {
    if (!value) { setUsernameError(null); return; }
    if (!/^[a-z0-9_.]{3,30}$/.test(value.toLowerCase())) {
      setUsernameError("3–30 chars: letters, numbers, _ and . only");
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", value.toLowerCase())
      .maybeSingle();
    setUsernameError(data ? "Username already taken" : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) return;
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setError("Not authenticated"); setLoading(false); return; }

    const { error } = await supabase.from("profiles").insert([{
      id: userData.user.id,
      username: username.toLowerCase(),
      display_name: displayName,
      bio: bio || null,
      avatar_url: null,
    }]);

    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-text-primary mb-1">Set Up Profile</h1>
      <p className="text-sm text-text-muted mb-6">Create your Zocial identity</p>

      {/* Avatar placeholder — upload enabled in a future phase */}
      <div className="flex justify-center mb-6">
        <div
          title="Avatar upload coming soon"
          className="relative w-20 h-20 rounded-full bg-bg-surface border-2 border-dashed border-border flex items-center justify-center cursor-pointer group hover:border-accent transition-colors"
        >
          <span className="text-2xl text-text-muted group-hover:text-accent transition-colors select-none">
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
          onChange={(e) => { setUsername(e.target.value); checkUsername(e.target.value); }}
          placeholder="johndoe"
          hint="How others will find and add you"
          error={usernameError ?? undefined}
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
          disabled={loading || !!usernameError || !username || !displayName}
        >
          {loading ? "Setting up..." : "Continue"}
        </Button>
      </form>
    </Card>
  );
}
