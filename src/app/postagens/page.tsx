import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EVENT } from "@/lib/event";
import { formatDateLong } from "@/lib/format";
import { btnOutline } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Postagens do evento" };

async function loadPosts() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return { posts, failed: false };
  } catch (error) {
    console.error(error);
    return { posts: [], failed: true };
  }
}

export default async function PostagensPage() {
  const { posts, failed } = await loadPosts();

  return (
    <div className="pagina">
      <main className="miolo py-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-linha pb-8">
          <div>
            <p className="font-bold text-tinta/70">{EVENT.name}</p>
            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Postagens do evento</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-tinta/80">
              Comunicados, fotos e atualizações publicados pelos organizadores do workshop.
            </p>
          </div>
          <Link href="/" className={btnOutline}>
            Voltar para a inscrição
          </Link>
        </div>

        <section className="py-8 md:py-10" aria-label="Lista de postagens">
          {failed ? (
            <p className="max-w-xl border-2 border-erro bg-white p-4 font-bold text-erro">
              Não foi possível carregar as postagens agora. Recarregue a página em instantes.
            </p>
          ) : posts.length === 0 ? (
            <div className="max-w-2xl border-2 border-tinta bg-white p-6">
              <h2 className="font-display text-2xl font-bold">Nenhuma postagem ainda</h2>
              <p className="mt-2 text-lg text-tinta/80">
                Quando a organização publicar uma novidade, ela aparecerá aqui.
              </p>
            </div>
          ) : (
            <ol className="grid gap-6">
              {posts.map((post) => (
                <li key={post.id} className="border-2 border-tinta bg-white p-5 shadow-[6px_6px_0_0_var(--marca)] md:p-7">
                  <article>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="font-display text-2xl font-bold md:text-3xl">{post.title}</h2>
                      <time dateTime={post.createdAt.toISOString()} className="text-sm font-bold text-tinta/65">
                        {formatDateLong(post.createdAt)}
                      </time>
                    </div>

                    {post.imageData && (
                      <img
                        src={post.imageData}
                        alt={`Foto da postagem ${post.title}`}
                        className="mt-5 max-h-[36rem] w-full rounded-md border-2 border-linha object-contain"
                      />
                    )}

                    <p className="mt-5 max-w-[75ch] whitespace-pre-line text-lg leading-relaxed">
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
      </main>
    </div>
  );
}
