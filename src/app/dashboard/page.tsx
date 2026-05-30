"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/features/auth";
import { Avatar, Button, Spinner, ThemeToggle, useToast } from "@/components/ui";

export default function Dashboard() {
  const { user, session, loading, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (loading) return;
    if (!session) { router.push("/auth/login"); return; }
    if (!user)    { router.push("/auth/setup-profile"); return; }
  }, [loading, session, user, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.info("You've been signed out.");
      router.push("/");
    } catch {
      toast.error("Failed to sign out. Please try again.");
      setLoggingOut(false);
    }
  };

  if (loading || !session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-accent" />
          <p className="text-text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="h-12 bg-bg-secondary border-b border-border flex items-center justify-between px-4">
        <span className="text-sm font-semibold text-text-primary">Zocial</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            loading={loggingOut}
          >
            Log out
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar src={user?.avatar_url} name={user?.display_name} size="lg" />
          <div>
            <p className="text-lg font-semibold text-text-primary">{user?.display_name}</p>
            <p className="text-sm text-text-muted">@{user?.username}</p>
            {user?.bio && (
              <p className="text-sm text-text-secondary mt-2 max-w-xs">{user.bio}</p>
            )}
          </div>
          <div className="mt-4 px-4 py-3 bg-bg-surface rounded-lg border border-border text-sm text-text-muted">
            Phase 0 complete — friends, DMs, and groups coming next.
          </div>
        </div>
      </main>
    </div>
  );
}
