// Pequeno helper para chamar a API no navegador com erros padronizados.
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; fields?: Record<string, string> };

export async function apiFetch<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: init?.body
        ? { "Content-Type": "application/json", ...init.headers }
        : init?.headers,
    });
    const json = await res.json().catch(() => ({}));

    if (res.ok) return { ok: true, data: json as T };
    return {
      ok: false,
      status: res.status,
      error: json.error ?? "Algo deu errado. Tente novamente.",
      fields: json.fields,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Sem conexão com o servidor. Verifique a internet e tente de novo.",
    };
  }
}
