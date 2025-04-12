export interface IPessoa {
  id?: number;
  nome: string;
  email: string;
  senha: string;
}

export type IUserWithoutPassword = Omit<IPessoa, 'senha'>;