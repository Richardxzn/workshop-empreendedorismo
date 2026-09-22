// O valor interno "NOITE" foi mantido por compatibilidade com bancos já criados.
// Na interface, esse turno agora é exibido como "Tarde".
export const SHIFTS = ["MANHA", "NOITE", "AMBOS"] as const;

export type ShiftValue = (typeof SHIFTS)[number];

export const SHIFT_LABEL: Record<ShiftValue, string> = {
  MANHA: "Manhã",
  NOITE: "Tarde",
  AMBOS: "Ambos",
};
