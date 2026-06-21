import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "George Oetterer" },
      { name: "description", content: "George Oetterer" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <h1 className="font-display font-semibold tracking-tight text-center text-5xl md:text-7xl lg:text-8xl">
        GEORGE OETTERER
      </h1>
    </div>
  );
}
