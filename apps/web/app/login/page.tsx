import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary">Log in</h1>
      <p className="text-base text-text-secondary">Authentication UI — Unit 06.</p>
      <Link href="/" className="text-primary underline-offset-4 hover:underline">
        Back to home
      </Link>
    </main>
  );
}
