import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  idSchema,
  createSchema
  // updateSchema
} from "../validator/pessoaValidator";
import {
  getPeople,
  createPeople,
  deletePeople,
  getAllPeople,
  updatePeople
} from "../models/pessoaModel";
import { AppError } from "../shared/errors/AppError";

export const listarPessoas = async (request: Request, response: Response) => {
  try {
    const pessoas = await getAllPeople();
    if (pessoas.length === 0) {
      response.status(200).json({ message: "A lista está vazia" });
      return;
    }
    response.status(200).json(pessoas);
  } catch (error) {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }
    response.status(500).json({ message: "Internal server error" });
  }
};

export const cadastrarPessoa = async (request: Request, response: Response) => {
  const createValidation = createSchema.safeParse(request.body);
  if (!createValidation.success) {
    response.status(400).json({
      error: "Campos são obrigatórios",
      message: createValidation.error.errors.map(err => ({
        campo: err.path[0],
        message: err.message
      }))
    });
    return;
  }

  const { nome, email, senha } = createValidation.data;

  const salt = 10;
  const hashPassword = bcrypt.hashSync(senha, salt);

  const pessoa = {
    nome,
    email,
    senha: hashPassword
  };

  try {
    const novaPessoa = await createPeople(pessoa);

    console.log(novaPessoa);
    response
      .status(201)
      .json({ message: "Cadastro realizado com sucesso", novaPessoa });
  } catch (error) {
    if (error instanceof AppError) {
      response
        .status(error.statusCode)
        .json({ error: error.name, message: error.message });
      return;
    }
    response.status(500).json({ error: "Internal server error" });
  }
};

export const selecionarPessoa = async (
  request: Request,
  response: Response
) => {
  const idValidation = idSchema.safeParse(request.params);
  if (!idValidation.success) {
    response.status(400).json({
      error: idValidation.error.errors[0].path[0],
      message: idValidation.error.errors[0].message
    });
    return;
  }

  const id = idValidation.data.id;

  try {
    const pessoa = await getPeople(id);
    response.status(200).json(pessoa);
  } catch (error) {
    if (error instanceof AppError) {
      response
        .status(error.statusCode)
        .json({ error: error.name, message: error.message });
      return;
    }
    response.status(500).json({ message: "Internal server error" });
  }
};

export const atualizarPessoa = async (request: Request, response: Response) => {
  const idValidation = idSchema.safeParse(request.params);
  if (!idValidation.success) {
    response.status(400).json({
      error: idValidation.error.errors[0].path[0],
      message: idValidation.error.errors[0].message
    });
    return;
  }

  const id = idValidation.data.id;
  const { nome, email, senha } = request.body;

  if (nome.length < 3) {
    response.status(400).json({
      error: "Campo nome",
      message: "O nome deve conter no mínimo 3 caracteres"
    });
    return;
  }
  if (!email.includes("@")) {
    response.status(400).json({
      error: "Campo E-mail",
      message: "Campo e-mail está inválido"
    });
    return;
  }
  if (senha.length < 6) {
    response.status(400).json({
      error: "Campo senha",
      message: "O nome deve conter no mínimo 6 caracteres"
    });
    return;
  }

  try {
    
    const pessoa = {
      nome,
      email,
      senha: bcrypt.hashSync(senha, 10)
    };

    const updatePessoa = await updatePeople(id, pessoa);
    response.status(200).json(updatePessoa);
  } catch (error) {
    if (error instanceof AppError) {
      response
        .status(error.statusCode)
        .json({ error: error.name, message: error.message });
      return;
    }
    response.status(500).json({ message: "Internal server error" });
  }
};

export const excluirPessoa = async (request: Request, response: Response) => {
  const idValidation = idSchema.safeParse(request.params);
  if (!idValidation.success) {
    response.status(400).json({
      error: idValidation.error.errors[0].path[0],
      message: idValidation.error.errors[0].message
    });
    return;
  }

  const id = idValidation.data.id;

  try {
    const deletePessoa = await deletePeople(id);
    response.status(200).json({ message: "Usuário excluído", deletePessoa });
  } catch (error) {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }
    response.status(500).json({ error: "Internal server Error!" });
  }
};
