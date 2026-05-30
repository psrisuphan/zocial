"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Spinner } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const redirect = async () => {
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/dashboard" : "/auth/login");
    };
    redirect();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <Spinner size="lg" className="text-accent" />
    </div>
  );
}
