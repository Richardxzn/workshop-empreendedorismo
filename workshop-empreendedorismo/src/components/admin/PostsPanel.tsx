"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api";
import { formatDateTime } from "@/lib/format";
import type { PostRow } from "@/lib/types";
import { btnDanger, btnPrimary, errorText, inputBox, labelText, panel } from "@/components/ui";

type FormErrors = { title?: string; content?: string; imageData?: string };

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

export default function PostsPanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [listError, setListError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
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

  async function chooseImage(file?: File) {
    setErrors((x) => ({ ...x, imageData: undefined }));
    setFormError("");

    if (!file) {
      setImageData(null);
      setImageName("");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageData(null);
      setImageName("");
      setErrors((x) => ({ ...x, imageData: "Use uma imagem JPG, PNG ou WEBP." }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageData(null);
      setImageName("");
      setErrors((x) => ({ ...x, imageData: "A foto deve ter no máximo 2 MB." }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImageData(dataUrl);
      setImageName(file.name);
    } catch {
      setErrors((x) => ({ ...x, imageData: "Não foi possível carregar essa imagem." }));
    }
  }

  function clearImage() {
    setImageData(null);
    setImageName("");
    setErrors((x) => ({ ...x, imageData: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function publish(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (saving) return;
    setFormError("");
    setNotice("");

    const found: FormErrors = {};
    if (title.trim().length < 3) found.title = "Informe um título com pelo menos 3 caracteres";
    if (content.trim().length < 3) found.content = "Escreva o conteúdo da postagem";
    setErrors(found);
    if (found.title || found.content || found.imageData) return;

    setSaving(true);
    const res = await apiFetch<{ post: PostRow }>("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content, imageData }),
    });
    setSaving(false);

    if (res.ok) {
      setPosts((list) => [res.data.post, ...list]);
      setTitle("");
      setContent("");
      clearImage();
      setNotice("Postagem publicada. Ela já aparece na página pública de postagens.");
    } else if (res.status === 401) {
      router.replace("/admin/login");
    } else if (res.fields) {
      setErrors(res.fields as FormErrors);
    } else {
      setFormError(res.error);
    }
  }

  async function remove(post: PostRow) {
    if (!window.confirm(`Excluir a postagem "${post.title}"? Essa ação não pode ser desfeita.`)) {
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
      {/* Nova postagem */}
      <form onSubmit={publish} noValidate className={`${panel} self-start`}>
        <h2 className="font-display text-xl font-bold">Nova postagem</h2>

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

        <div className="mt-5">
          <label htmlFor="foto-postagem" className={labelText}>
            Foto <span className="font-normal text-tinta/60">(opcional)</span>
          </label>
          <input
            ref={fileInputRef}
            id="foto-postagem"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => void chooseImage(e.target.files?.[0])}
            aria-invalid={!!errors.imageData}
            aria-describedby={errors.imageData ? "erro-foto" : "ajuda-foto"}
            className={`${inputBox} mt-1 file:mr-3 file:rounded file:border-0 file:bg-tinta file:px-3 file:py-1 file:font-bold file:text-white`}
          />
          <p id="ajuda-foto" className="mt-1.5 text-sm text-tinta/65">
            JPG, PNG ou WEBP, até 2 MB. A foto fica salva junto com a postagem.
          </p>
          {errors.imageData && (
            <p id="erro-foto" className={errorText}>
              {errors.imageData}
            </p>
          )}

          {imageData && (
            <div className="mt-3 overflow-hidden rounded-md border-2 border-tinta/40 bg-white p-2">
              <img
                src={imageData}
                alt="Prévia da foto da postagem"
                className="max-h-64 w-full rounded object-contain"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-bold" title={imageName}>
                  {imageName}
                </p>
                <button type="button" onClick={clearImage} className={btnDanger}>
                  Remover foto
                </button>
              </div>
            </div>
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
          {saving ? "Publicando…" : "Publicar postagem"}
        </button>
      </form>

      {/* Postagens publicadas */}
      <section aria-labelledby="titulo-publicados">
        <h2 id="titulo-publicados" className="font-display text-xl font-bold">
          Postagens publicadas
        </h2>
        <p className="mt-1 text-sm text-tinta/65">
          Você pode excluir qualquer postagem pelo botão vermelho abaixo.
        </p>

        {listError && (
          <p role="alert" className="mt-3 font-bold text-erro">
            {listError}
          </p>
        )}

        {loading ? (
          <p className="mt-4">Carregando postagens…</p>
        ) : loadError ? (
          <p role="alert" className="mt-4 font-bold text-erro">
            {loadError}
          </p>
        ) : posts.length === 0 ? (
          <p className="mt-4">Nenhuma postagem publicada ainda. Use o formulário para criar a primeira.</p>
        ) : (
          <ul className="mt-4 divide-y-2 divide-linha border-2 border-tinta bg-white">
            {posts.map((post) => (
              <li key={post.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold">{post.title}</h3>
                    <p className="text-sm text-tinta/70">{formatDateTime(post.createdAt)}</p>
                    <p className="mt-2 line-clamp-3 whitespace-pre-line break-words">{post.content}</p>
                  </div>
                  <button
                    type="button"
                    className={`${btnDanger} shrink-0`}
                    disabled={deletingId === post.id}
                    aria-label={`Excluir a postagem ${post.title}`}
                    onClick={() => remove(post)}
                  >
                    {deletingId === post.id ? "Excluindo…" : "Excluir postagem"}
                  </button>
                </div>

                {post.imageData && (
                  <img
                    src={post.imageData}
                    alt={`Foto da postagem ${post.title}`}
                    className="mt-4 max-h-72 w-full rounded-md border-2 border-linha object-contain"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
