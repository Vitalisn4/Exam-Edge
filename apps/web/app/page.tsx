export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary">ExamEdge</h1>
      <p className="mt-2 text-base text-text-secondary">Monorepo scaffold — Unit 01</p>
      <p className="mt-4 text-sm text-text-muted">
        Design system preview:{" "}
        <a href="/dev/ui" className="text-primary underline-offset-4 hover:underline">
          /dev/ui
        </a>
      </p>
    </main>
  );
}
