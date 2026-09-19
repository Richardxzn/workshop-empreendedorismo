export const SHIFTS = ["MANHA", "NOITE", "AMBOS"] as const;

export type ShiftValue = (typeof SHIFTS)[number];

export const SHIFT_LABEL: Record<ShiftValue, string> = {
  MANHA: "Manhã",
  NOITE: "Noite",
  AMBOS: "Ambos",
};
