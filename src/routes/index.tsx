import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login | Painel Administrativo Master" },
      {
        name: "description",
        content: "Acesse o painel geral do administrador master.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AuthGate>
      <Navigate to="/admin/master" replace />
    </AuthGate>
  );
}
