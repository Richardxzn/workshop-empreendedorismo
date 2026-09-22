import type { ShiftValue } from "./constants";

export type Counts = Record<"total" | ShiftValue, number>;

export type ParticipantRow = {
  id: number;
  name: string;
  cpf: string; // já formatado: 000.000.000-00
  shift: ShiftValue;
  createdAt: string;
};

export type PostRow = {
  id: number;
  title: string;
  content: string;
  imageData: string | null;
  createdAt: string;
};
