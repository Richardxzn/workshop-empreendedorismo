import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EVENT } from "@/lib/event";
import { formatDateLong } from "@/lib/format";
import HeroImage from "@/components/HeroImage";
import RegistrationForm from "@/components/RegistrationForm";
import { btnOutline, btnPrimary } from "@/components/ui";

// Sempre busca os avisos atuais no banco (novo aviso aparece sem rebuild)
export const dynamic = "force-dynamic";

async function loadPosts() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return { posts, failed: false };
  } catch (e) {
    console.error(e);
    return { posts: [], failed: true };
  }
}

export default async function HomePage() {
  const { posts, failed } = await loadPosts();

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
              <a href="#avisos" className={`${btnOutline} px-6 py-3 text-base`}>
                Ver avisos
              </a>
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
              Preencha a ficha com seus dados. Você pode participar só de manhã, só à noite ou nos
              dois turnos.
            </p>
            <p className="mt-3 max-w-md text-tinta/80">Cada CPF pode se inscrever uma única vez.</p>
          </div>
          <RegistrationForm />
        </section>

        {/* Avisos */}
        <section id="avisos" className="scroll-mt-6 py-12 md:py-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Avisos e atualizações do evento
          </h2>

          {failed ? (
            <p className="mt-6 max-w-xl border-2 border-erro bg-white p-4 font-bold text-erro">
              Não foi possível carregar os avisos agora. Recarregue a página em instantes.
            </p>
          ) : posts.length === 0 ? (
            <p className="mt-6 max-w-xl text-lg">
              Ainda não há avisos. Quando os organizadores publicarem novidades, elas aparecem aqui.
            </p>
          ) : (
            <ol className="mt-8 divide-y-2 divide-linha">
              {posts.map((post) => (
                <li key={post.id} className="grid gap-2 py-6 md:grid-cols-[10rem_1fr] md:gap-8">
                  <time
                    dateTime={post.createdAt.toISOString()}
                    className="text-sm font-bold text-tinta/70 md:pt-2"
                  >
                    {formatDateLong(post.createdAt)}
                  </time>
                  <article>
                    <h3 className="font-display text-xl font-bold md:text-2xl">{post.title}</h3>
                    <p className="mt-2 max-w-[65ch] whitespace-pre-line text-lg leading-relaxed">
                      {post.content}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          )}
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
