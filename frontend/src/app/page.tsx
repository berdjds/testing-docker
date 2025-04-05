import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Our Application
        </h1>
        <p className="text-xl text-center mb-8">
          This is a full-stack application built with Next.js, Node.js, and MySQL.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/api/health"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Check API Status
          </a>
        </div>
      </main>
    </div>
  );
}
