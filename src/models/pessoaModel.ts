import { IPessoa, IUserWithoutPassword } from "../@types/IPessoa";
import { AppError } from "../shared/errors/AppError";
import prisma from "../shared/prisma/prisma";

export const createPeople = async (data: IPessoa): Promise<IPessoa> => {
  try {
    const findPessoa = await prisma.pessoas.findUnique({where: {email: data.email}})

    if(findPessoa){
      throw new AppError('E-mail já está em uso')
    }

    const pessoa = await prisma.pessoas.create({ data });
    return pessoa;
  } catch (error) {
    throw error;
  }
};

export const getAllPeople = async (): Promise<IUserWithoutPassword[]> => {
  try {
    const pessoas = await prisma.pessoas.findMany({
      select:{
        id: true,
        nome: true,
        email: true,
      }
    });
    return pessoas;
  } catch (error) {
    throw error;
  }
};

export const getPeople = async (id: number): Promise<IUserWithoutPassword> => {
  try {
    const pessoa = await prisma.pessoas.findUnique({ where: { id }, select:{
      id: true,
      nome: true,
      email: true
    }});
    if (!pessoa) {
      throw new AppError("Pessoa não encontrada", 404);
    }
    return pessoa;
  } catch (error) {
    throw error;
  }
};

export const updatePeople = async (
  id: number,
  data: IPessoa
): Promise<IPessoa> => {
  try {
    const pessoa = await prisma.pessoas.findUnique({ where: { id } });
    if (!pessoa) {
      throw new AppError("Pessoa não encontrada", 404);
    }

    const atualizarPessoa = await prisma.pessoas.update({
      where: { id },
      data
    });
    return atualizarPessoa;
  } catch (error) {
    throw error;
  }
};

export const deletePeople = async (id: number): Promise<IPessoa> => {
  try {
    const pessoa = await prisma.pessoas.findUnique({ where: { id } });
    if (!pessoa) {
      throw new AppError("Pessoa não encontrada", 404);
    }
    const deletarPessoa = await prisma.pessoas.delete({ where: { id } });
    return deletarPessoa;
  } catch (error) {
    throw error;
  }
};
