import { ThemeToggle } from "@/components/ui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <header className="h-12 bg-bg-secondary border-b border-border flex items-center justify-end px-4">
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
