import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
import { panel } from "@/components/ui";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-folha px-5 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold">Painel do organizador</h1>
        <p className="mt-2 text-tinta/80">Entre com o e-mail e a senha de organizador.</p>
        <div className={`mt-6 ${panel}`}>
          <LoginForm />
        </div>
        <p className="mt-6 text-sm">
          <Link href="/" className="font-bold underline underline-offset-4">
            Voltar ao site
          </Link>
        </p>
      </div>
    </main>
  );
}
