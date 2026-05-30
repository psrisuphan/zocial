"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/features/auth";
import { Spinner } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(session ? "/dashboard" : "/auth/login");
  }, [router, session, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <Spinner size="lg" className="text-accent" />
    </div>
  );
}
