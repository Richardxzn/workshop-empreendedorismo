"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/client-api";
import { SHIFTS, SHIFT_LABEL, type ShiftValue } from "@/lib/constants";
import { formatCpf, isValidCpf } from "@/lib/cpf";
import {
  btnOutline,
  btnPrimary,
  errorText,
  inputLine,
  labelText,
  panel,
} from "@/components/ui";

type Fields = { name: string; cpf: string; shift: ShiftValue | "" };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", cpf: "", shift: "" };
const CPF_INVALID = "CPF inválido. Confira os números digitados";

const SHIFT_PHRASE: Record<ShiftValue, string> = {
  MANHA: "no turno da manhã",
  NOITE: "no turno da tarde",
  AMBOS: "nos dois turnos, manhã e tarde",
};

// Mesmas regras da API (a API sempre valida de novo)
function validate(values: Fields): Errors {
  const errors: Errors = {};
  const name = values.name.trim().replace(/\s+/g, " ");

  if (name.length < 3) errors.name = "Informe o nome completo";
  else if (name.split(" ").length < 2) errors.name = "Informe nome e sobrenome";

  if (!values.cpf) errors.cpf = "Informe o CPF";
  else if (!isValidCpf(values.cpf)) errors.cpf = CPF_INVALID;

  if (!values.shift) errors.shift = "Selecione um turno";
  return errors;
}

export default function RegistrationForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ name: string; shift: ShiftValue } | null>(null);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (submitting) return;
    setFormError("");

    const found = validate(values);
    setErrors(found);
    const firstInvalid = (["name", "cpf", "shift"] as const).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(`campo-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    const res = await apiFetch<{ participant: { name: string; shift: ShiftValue } }>(
      "/api/participants",
      { method: "POST", body: JSON.stringify(values) }
    );
    setSubmitting(false);

    if (res.ok) {
      setDone({ name: res.data.participant.name, shift: res.data.participant.shift });
      return;
    }
    if (res.fields) setErrors(res.fields as Errors);
    else setFormError(res.error);
  }

  if (done) {
    return (
      <div role="status" className={panel}>
        <h3 className="font-display text-2xl font-bold">
          Inscrição confirmada, {done.name.split(" ")[0]}!
        </h3>
        <p className="mt-3 text-lg">Você vai participar {SHIFT_PHRASE[done.shift]}. Até lá!</p>
        <button
          type="button"
          className={`${btnOutline} mt-6`}
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setDone(null);
          }}
        >
          Inscrever outra pessoa
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={panel}>
      <div>
        <label htmlFor="campo-name" className={labelText}>
          Nome completo
        </label>
        <input
          id="campo-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          required
          placeholder="Nome e sobrenome"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "erro-name" : undefined}
          className={inputLine}
        />
        {errors.name && (
          <p id="erro-name" className={errorText}>
            {errors.name}
          </p>
        )}
      </div>

      <div className="mt-7">
        <label htmlFor="campo-cpf" className={labelText}>
          CPF
        </label>
        <input
          id="campo-cpf"
          name="cpf"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={14}
          required
          placeholder="000.000.000-00"
          value={values.cpf}
          onChange={(e) => update("cpf", formatCpf(e.target.value))}
          onBlur={() => {
            if (values.cpf && !isValidCpf(values.cpf)) {
              setErrors((e) => ({ ...e, cpf: CPF_INVALID }));
            }
          }}
          aria-invalid={!!errors.cpf}
          aria-describedby={errors.cpf ? "erro-cpf" : undefined}
          className={`${inputLine} tabular-nums`}
        />
        {errors.cpf && (
          <p id="erro-cpf" className={errorText}>
            {errors.cpf}
          </p>
        )}
      </div>

      <fieldset className="mt-8" aria-describedby={errors.shift ? "erro-shift" : undefined}>
        <legend className={labelText}>Turno</legend>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-3">
          {SHIFTS.map((s, i) => (
            <label key={s} className="cursor-pointer">
              <input
                id={i === 0 ? "campo-shift" : undefined}
                type="radio"
                name="shift"
                value={s}
                checked={values.shift === s}
                onChange={() => update("shift", s)}
                className="peer sr-only"
              />
              <span className="flex items-center justify-center border-2 border-tinta px-2 py-3 text-center font-display font-bold transition-colors hover:bg-marca peer-checked:bg-tinta peer-checked:text-white peer-checked:hover:bg-tinta peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-caneta">
                {SHIFT_LABEL[s]}
              </span>
            </label>
          ))}
        </div>
        {errors.shift && (
          <p id="erro-shift" className={errorText}>
            {errors.shift}
          </p>
        )}
      </fieldset>

      {formError && (
        <p role="alert" className="mt-6 border-2 border-erro bg-white p-3 font-bold text-erro">
          {formError}
        </p>
      )}

      <button type="submit" disabled={submitting} className={`${btnPrimary} mt-8 w-full`}>
        {submitting ? "Enviando…" : "Confirmar inscrição"}
      </button>

      <p className="mt-4 text-sm text-tinta/70">
        Seu CPF é usado só para identificar a inscrição e evitar duplicidade.
      </p>
    </form>
  );
}
