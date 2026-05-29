"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SetupProfile() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const checkUsernameAvailability = async (name: string) => {
    if (!name) {
      setUsernameError(null);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", name.toLowerCase())
      .single();

    if (data) {
      setUsernameError("Username already taken");
    } else {
      setUsernameError(null);
    }
  };

  const handleSetupProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (usernameError) {
      setError("Please fix the errors");
      setLoading(false);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").insert([
        {
          id: userData.user.id,
          username: username.toLowerCase(),
          display_name: displayName,
          bio: bio || null,
          avatar_url: null,
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Set up your Zocial identity
      </p>

      <form onSubmit={handleSetupProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Username (@username)
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              checkUsernameAvailability(e.target.value);
            }}
            placeholder="johndoe"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {usernameError && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {usernameError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !!usernameError}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
