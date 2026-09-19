"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api";
import { formatDateTime } from "@/lib/format";
import type { PostRow } from "@/lib/types";
import { btnDanger, btnPrimary, errorText, inputBox, labelText, panel } from "@/components/ui";

type FormErrors = { title?: string; content?: string };

export default function PostsPanel() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [listError, setListError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const res = await apiFetch<{ posts: PostRow[] }>("/api/posts", {
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      if (res.ok) setPosts(res.data.posts);
      else setLoadError(res.error);
      setLoading(false);
    })();
    return () => controller.abort();
  }, []);

  async function publish(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (saving) return;
    setFormError("");
    setNotice("");

    const found: FormErrors = {};
    if (title.trim().length < 3) found.title = "Informe um título com pelo menos 3 caracteres";
    if (content.trim().length < 3) found.content = "Escreva o conteúdo do aviso";
    setErrors(found);
    if (found.title || found.content) return;

    setSaving(true);
    const res = await apiFetch<{ post: PostRow }>("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);

    if (res.ok) {
      setPosts((list) => [res.data.post, ...list]);
      setTitle("");
      setContent("");
      setNotice("Aviso publicado. Ele já aparece na página do evento.");
    } else if (res.status === 401) {
      router.replace("/admin/login");
    } else if (res.fields) {
      setErrors(res.fields as FormErrors);
    } else {
      setFormError(res.error);
    }
  }

  async function remove(post: PostRow) {
    if (!window.confirm(`Excluir o aviso "${post.title}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    setDeletingId(post.id);
    setListError("");

    const res = await apiFetch(`/api/posts/${post.id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res.ok || res.status === 404) {
      setPosts((list) => list.filter((p) => p.id !== post.id));
    } else if (res.status === 401) {
      router.replace("/admin/login");
    } else {
      setListError(res.error);
    }
  }

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr]">
      {/* Novo aviso */}
      <form onSubmit={publish} noValidate className={`${panel} self-start`}>
        <h2 className="font-display text-xl font-bold">Novo aviso</h2>

        <div className="mt-5">
          <label htmlFor="titulo" className={labelText}>
            Título
          </label>
          <input
            id="titulo"
            type="text"
            maxLength={150}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((x) => ({ ...x, title: undefined }));
            }}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "erro-titulo" : undefined}
            className={`${inputBox} mt-1`}
          />
          {errors.title && (
            <p id="erro-titulo" className={errorText}>
              {errors.title}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="conteudo" className={labelText}>
            Conteúdo
          </label>
          <textarea
            id="conteudo"
            rows={6}
            maxLength={5000}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrors((x) => ({ ...x, content: undefined }));
            }}
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? "erro-conteudo" : undefined}
            className={`${inputBox} mt-1 resize-y`}
          />
          {errors.content && (
            <p id="erro-conteudo" className={errorText}>
              {errors.content}
            </p>
          )}
        </div>

        {formError && (
          <p role="alert" className="mt-4 font-bold text-erro">
            {formError}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 font-bold">
            {notice}
          </p>
        )}

        <button type="submit" disabled={saving} className={`${btnPrimary} mt-6 w-full`}>
          {saving ? "Publicando…" : "Publicar aviso"}
        </button>
      </form>

      {/* Avisos publicados */}
      <section aria-labelledby="titulo-publicados">
        <h2 id="titulo-publicados" className="font-display text-xl font-bold">
          Avisos publicados
        </h2>

        {listError && (
          <p role="alert" className="mt-3 font-bold text-erro">
            {listError}
          </p>
        )}

        {loading ? (
          <p className="mt-4">Carregando avisos…</p>
        ) : loadError ? (
          <p role="alert" className="mt-4 font-bold text-erro">
            {loadError}
          </p>
        ) : posts.length === 0 ? (
          <p className="mt-4">Nenhum aviso publicado ainda. Use o formulário para criar o primeiro.</p>
        ) : (
          <ul className="mt-4 divide-y-2 divide-linha border-2 border-tinta bg-white">
            {posts.map((post) => (
              <li key={post.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold">{post.title}</h3>
                  <p className="text-sm text-tinta/70">{formatDateTime(post.createdAt)}</p>
                  <p className="mt-2 line-clamp-3 whitespace-pre-line break-words">{post.content}</p>
                </div>
                <button
                  type="button"
                  className={`${btnDanger} shrink-0`}
                  disabled={deletingId === post.id}
                  aria-label={`Excluir o aviso ${post.title}`}
                  onClick={() => remove(post)}
                >
                  {deletingId === post.id ? "Excluindo…" : "Excluir"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
