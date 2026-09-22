import { z } from "zod";
import { SHIFTS } from "./constants";
import { isValidCpf, onlyDigits } from "./cpf";

export const shiftSchema = z.enum(SHIFTS, { message: "Selecione um turno" });

export const participantSchema = z.object({
  name: z
    .string({ message: "Informe o nome completo" })
    .trim()
    .min(3, "Informe o nome completo")
    .max(120, "Nome muito longo (máx. 120 caracteres)")
    .refine((v) => v.split(/\s+/).length >= 2, "Informe nome e sobrenome")
    .transform((v) => v.replace(/\s+/g, " ")),
  cpf: z
    .string({ message: "Informe o CPF" })
    .refine(isValidCpf, "CPF inválido")
    .transform(onlyDigits), // salva só os dígitos
  shift: shiftSchema,
});

const imageDataSchema = z
  .string()
  .max(3_000_000, "A foto ficou grande demais. Escolha uma imagem de até 2 MB.")
  .refine(
    (value) => /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value),
    "Formato de imagem inválido. Use JPG, PNG ou WEBP."
  );

export const postSchema = z.object({
  title: z
    .string({ message: "Informe o título" })
    .trim()
    .min(3, "Título muito curto")
    .max(150, "Título muito longo (máx. 150 caracteres)"),
  content: z
    .string({ message: "Informe o conteúdo" })
    .trim()
    .min(3, "Conteúdo muito curto")
    .max(5000, "Conteúdo muito longo (máx. 5000 caracteres)"),
  imageData: imageDataSchema.nullish().transform((value) => value ?? null),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha").max(200),
});
