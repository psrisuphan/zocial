export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Zocial</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          A privacy-first chat app for Gen Z
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </a>
          <a
            href="/auth/login"
            className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Log In
          </a>
        </div>
      </div>
    </main>
  );
}
