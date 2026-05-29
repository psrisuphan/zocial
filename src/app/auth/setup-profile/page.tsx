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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => { setUsername(e.target.value); checkUsername(e.target.value); }}
          placeholder="johndoe"
          hint="This is how others will find you"
          error={usernameError ?? undefined}
          required
        />
        <Input
          label="Display Name"
          type="text"
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
