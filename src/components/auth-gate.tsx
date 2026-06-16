import { useState } from "react";
import { actions, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { toast } from "sonner";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const isAdmin = useStore((s) => s.auth.isAdmin);
  const hasPassword = useStore((s) => !!s.settings.adminPasswordHash);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdmin) return <>{children}</>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw) return;
    if (!hasPassword && pw !== pw2) {
      toast.error("As senhas não conferem");
      return;
    }
    if (pw.length < 4) {
      toast.error("Senha muito curta");
      return;
    }
    setLoading(true);
    const ok = await actions.login(pw);
    setLoading(false);
    if (!ok) toast.error("Senha incorreta");
    else toast.success("Bem-vindo");
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
            {hasPassword ? "Acesso restrito. Digite sua senha." : "Primeiro acesso — defina a senha de administrador."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pw">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="pw" type="password" className="pl-9" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
              </div>
            </div>
            {!hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="pw2">Confirmar senha</Label>
                <Input id="pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
              </div>
            )}
            <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90" disabled={loading}>
              {hasPassword ? "Entrar" : "Definir senha e entrar"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Versão local. Quando conectar ao Supabase, ativamos login real por e-mail.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
