import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number()
});

export const createSchema = z.object({
  nome: z
    .string({ required_error: "Nome é obrigatório" })
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email({ message: "E-mail inválido" }),
  senha: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    .max(100, { message: "A senha deve ter no máximo 100 caracteres" })
});