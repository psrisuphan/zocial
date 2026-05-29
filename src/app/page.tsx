import { Button } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg-primary px-4">
      <div className="text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Zocial</h1>
        <p className="text-sm text-text-muted mb-8">
          A privacy-first chat app for Gen Z
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" fullWidth>
              Create Account
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="lg" fullWidth>
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
