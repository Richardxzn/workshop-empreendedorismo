import Link from "next/link";
import { EVENT } from "@/lib/event";
import HeroImage from "@/components/HeroImage";
import RegistrationForm from "@/components/RegistrationForm";
import { btnOutline, btnPrimary } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="pagina">
      <div className="miolo">
        {/* Hero */}
        <section className="grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h1 className="titulo-hero font-display font-bold leading-[1.05] tracking-tight">
              <span className="block">Workshop de</span>
              <span className="block">Empreendedorismo</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed">{EVENT.description}</p>

            {(EVENT.dateLabel || EVENT.locationLabel) && (
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                {EVENT.dateLabel && (
                  <div>
                    <dt className="text-sm font-bold text-tinta/70">Quando</dt>
                    <dd className="font-display text-lg font-bold">{EVENT.dateLabel}</dd>
                  </div>
                )}
                {EVENT.locationLabel && (
                  <div>
                    <dt className="text-sm font-bold text-tinta/70">Onde</dt>
                    <dd className="font-display text-lg font-bold">{EVENT.locationLabel}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#inscricao" className={btnPrimary}>
                Quero me inscrever
              </a>
              <Link href="/postagens" className={`${btnOutline} px-6 py-3 text-base`}>
                Ver postagens
              </Link>
            </div>
          </div>

          <HeroImage />
        </section>

        {/* Inscrição */}
        <section
          id="inscricao"
          className="grid scroll-mt-6 gap-8 py-12 md:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
        >
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Inscrição</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed">
              Preencha a ficha com seus dados. Você pode participar só de manhã, só à tarde ou nos
              dois turnos.
            </p>
            <p className="mt-3 max-w-md text-tinta/80">Cada CPF pode se inscrever uma única vez.</p>
          </div>
          <RegistrationForm />
        </section>

        {/* Acesso às postagens */}
        <section className="border-t-2 border-linha py-10 md:py-12">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Postagens do evento</h2>
              <p className="mt-2 max-w-2xl text-tinta/80">
                Acompanhe comunicados e atualizações publicados pela organização do workshop.
              </p>
            </div>
            <Link href="/postagens" className={btnOutline}>
              Entrar e ver postagens
            </Link>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-linha py-8 text-sm text-tinta/70">
          <p>
            © {new Date().getFullYear()} {EVENT.name}
          </p>
          <Link href="/admin/login" className="font-bold underline underline-offset-4">
            Área do organizador
          </Link>
        </footer>
      </div>
    </div>
  );
}
