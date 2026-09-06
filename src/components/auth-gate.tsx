import { useState } from "react";
import { actions, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Lock, UserRound } from "lucide-react";
import { toast } from "sonner";

const ADMIN_LOGIN_KEY = "admin-login";
const ADMIN_LOGIN = "ramos660@hotmail.com";

function normalizeLogin(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function getSavedLogin() {
  if (typeof window === "undefined") return ADMIN_LOGIN;

  const savedLogin = window.localStorage.getItem(ADMIN_LOGIN_KEY);
  if (!savedLogin || normalizeLogin(savedLogin) === "admin") {
    return ADMIN_LOGIN;
  }

  return savedLogin;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const isAdmin = useStore((s) => s.auth.isAdmin);
  const hasPassword = useStore((s) => !!s.settings.adminPasswordHash);
  const usersExist = useStore((s) => s.users.length > 0);
  const [login, setLogin] = useState(() => getSavedLogin());
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdmin) return <>{children}</>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedLogin = normalizeLogin(login);

    if (normalizedLogin.length < 3) {
      toast.error("Informe um login válido");
      return;
    }

    if (!pw) return;

    // First‑time setup – no users registered yet
    if (!usersExist) {
      // Register the first user as admin
      setLoading(true);
      await actions.registerUser(normalizedLogin, pw, true);
      await actions.login(normalizedLogin, pw);
      setLoading(false);
      window.localStorage.setItem(ADMIN_LOGIN_KEY, normalizedLogin);
      toast.success("Administrador criado e logado");
      return;
    }

    // Normal login flow for existing users
    setLoading(true);
    const ok = await actions.login(normalizedLogin, pw);
    setLoading(false);

    if (!ok) {
      toast.error("Login ou senha incorretos");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_LOGIN_KEY, normalizedLogin);
    }

    toast.success("Bem‑vindo");
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-brand/10 grid place-items-center mb-2">
            <Shield className="h-6 w-6 text-brand" />
          </div>
          <CardTitle className="font-display text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>
            {hasPassword
              ? "Acesso restrito. Digite seu login e senha."
              : "Primeiro acesso — defina seu login e senha de administrador."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login"
                  type="email"
                  className="pl-9"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pw">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pw"
                  type="password"
                  className="pl-9"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  autoComplete={hasPassword ? "current-password" : "new-password"}
                  required
                />
              </div>
            </div>

            {/* No longer needed – password confirmation is handled by registerUser when first user is created */}

            <Button
              type="submit"
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              disabled={loading}
            >
              {loading ? "Entrando..." : usersExist ? "Entrar" : "Criar admin e entrar"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Use o login {ADMIN_LOGIN} e a senha cadastrada neste dispositivo.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
