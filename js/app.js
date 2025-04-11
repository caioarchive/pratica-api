const BASE_URL = "http://localhost:3333/api";
const message = document.getElementById("message");
const formCad = document.getElementById("item-form");

const showMessage = (text, cor) => {
    message.textContent = text;
    message.style.color = cor;
};

const handleFormSubmit = async (event) => {
    event.preventDefault();

    const campoName = document.getElementById("name").value;
    const campoEmail = document.getElementById("email").value;
    const campoSenha = document.getElementById("senha").value;

    // const campoDescription = document.getElementById("description").value;

    const pessoa = {  //ITEM AQUI
        id: "",
        nome: campoName,
        email: campoEmail,
        senha: campoSenha,
    };

    await adicionarPessoa(pessoa);
    // console.log(JSON.stringify(item))
}
const adicionarPessoa = async (objPessoa) => {
    try {
        const res = await fetch(`${BASE_URL}/pessoas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Connection: "close", //Obrigatório no POST

            },
            body: JSON.stringify(objPessoa),
        });
        console.log(objPessoa)
        if (!res.ok) {
            showMessage(`Erro: Email ja está em uso ou digite um email valido!, exemplo: caio@gmail.com`, "red");
            return;
        }
        showMessage("Cadastrado com sucesso!", "green");
        await listarPessoas();
    } catch (error) {
        console.log(error);
        showMessage("Erro ao cadastrar a pessoa.", "red");
    }


};

const listarPessoas = async () => {
    try {
        const res = await fetch(`${BASE_URL}/pessoas`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            console.log("Erro ao listar itens");
            return;
        }
        const pessoas = await res.json();
        console.log(pessoas);
        await mostrarPessoas(pessoas);
    } catch (error) {
        console.log("Erro:", error);
    }
};

const mostrarPessoas = async (pessoas) => {
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";
    // map(() => ``)
    const cards = pessoas
        .map(
            (pessoa) => `
        <article class="item-card">
            <header class="item-card__header">
            <h2 class="item-card__title">
             Nome: ${pessoa.nome}</h2>
            </header>

            <section class="item-card__body">
            <p class="item-card__description">
              Email: ${pessoa.email}

                </p>
            </section>
        

            <footer class="item-card__footer">

            <button onclick="deletarPessoa(${pessoa.id})" class="item-card__button item-card__button--delete">
                Excluir
            </button>
            </footer>
        </article>
    `
        )
        .join("");
    itemList.innerHTML = cards;
};

const deletarPessoa = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/pessoas/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const error = await res.json();
            if (error.message === "Item não encontrado") {
                showMessage("Item não cadastrado.", "red");
            } else {
                showMessage("Item não excluído", "red");
            }
            return;
        }
        showMessage("Item excluído com sucesso", "green");
        await listarPessoas();
    } catch (error) {
        console.log(error);
        showMessage("Erro ao tentar excluir o item.", "red");
    }
};


formCad.addEventListener("submit", handleFormSubmit);
document.addEventListener("DOMContentLoaded", listarPessoas);