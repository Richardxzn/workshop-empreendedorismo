// Classes compartilhadas (botões, campos, painel) para manter o visual consistente.
export const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-caneta px-6 py-3 font-display text-base font-bold text-white transition-colors hover:bg-caneta-escura disabled:cursor-not-allowed disabled:opacity-60";

export const btnOutline =
  "inline-flex items-center justify-center rounded-md border-2 border-tinta bg-white px-4 py-2 font-display text-sm font-bold text-tinta transition-colors hover:bg-marca disabled:cursor-not-allowed disabled:opacity-60";

export const btnDanger =
  "inline-flex items-center justify-center rounded-md border-2 border-erro bg-white px-3 py-1.5 text-sm font-bold text-erro transition-colors hover:bg-erro hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

export const labelText = "block font-display text-base font-bold";

export const errorText = "mt-1.5 text-sm font-bold text-erro";

// Campo "linha de caderno" (formulário público)
export const inputLine =
  "block w-full border-0 border-b-2 border-tinta/60 bg-transparent px-1 py-2 text-lg placeholder:text-tinta/45 aria-[invalid=true]:border-erro";

// Campo com caixa (painel do organizador)
export const inputBox =
  "block w-full rounded-md border-2 border-tinta/50 bg-white px-3 py-2 text-base placeholder:text-tinta/45 aria-[invalid=true]:border-erro";

// Ficha: caixa com borda de tinta e sombra de marca-texto
export const panel =
  "border-2 border-tinta bg-white p-6 shadow-[8px_8px_0_0_var(--marca)] sm:p-8";
