import { Button, ThemeToggle } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <header className="h-12 bg-bg-secondary border-b border-border flex items-center justify-end px-4">
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Zocial</h1>
          <p className="text-sm text-text-muted mb-8">
            A clean, privacy-first chat app for everyone.
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
    </div>
  );
}
