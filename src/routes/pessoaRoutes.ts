import { Router } from "express";
import {
  listarPessoas,
  cadastrarPessoa,
  selecionarPessoa,
  atualizarPessoa,
  excluirPessoa
} from "../controllers/pessoaController";

const router = Router();

router.get("/", listarPessoas);
router.post("/", cadastrarPessoa);
router.get("/:id", selecionarPessoa);
router.put("/:id", atualizarPessoa);
router.delete("/:id", excluirPessoa);

export default router;
