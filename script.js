const cargosExoticos = [
    "Especialista em Aperto de Mãos Virtuais",
    "Consultor de Ideias Brilhantes",
    "Diretor de Cartões Improváveis",
    "Analista de Sorrisos Digitais",
    "Arquiteto de Primeiras Impressões",
    "Gerente de Criatividade Instantânea"
];

const gradientes = [
    { classe: "cartao-gradiente-oceano", cores: "#0066cc e #00a6a6" },
    { classe: "cartao-gradiente-criativo", cores: "#7b2cbf e #f72585" },
    { classe: "cartao-gradiente-floresta", cores: "#1b4332 e #52b788" },
    { classe: "cartao-gradiente-solar", cores: "#d00000 e #ffba08" },
    { classe: "cartao-gradiente-coral", cores: "#293241 e #ee6c4d" },
    { classe: "cartao-gradiente-noite", cores: "#003049 e #669bbc" }
];

let contador = 0;

const botaoInterativo = document.getElementById("btn-interativo");
const mensagem = document.getElementById("mensagem");
const cartaoGerado = document.getElementById("cartao-gerado");

botaoInterativo.addEventListener("click", function () {
    const nomeDigitado = prompt("Digite o nome para o cartão:");
    const nome = nomeDigitado && nomeDigitado.trim() !== "" ? nomeDigitado.trim() : "Visitante Misterioso";
    const cargo = cargosExoticos[Math.floor(Math.random() * cargosExoticos.length)];
    const gradiente = gradientes[Math.floor(Math.random() * gradientes.length)];

    contador = contador + 1;

    mensagem.innerHTML = "O botão foi clicado " + contador + " vez(es).";
    cartaoGerado.innerHTML = `
        <article class="cartao-digital ${gradiente.classe}">
            <h3>${nome}</h3>
            <p>${cargo}</p>
            <p>Paleta: ${gradiente.cores}</p>
            <p>Cartão de visitas digital gerado automaticamente.</p>
            <span class="numero-cartao">Cartão nº ${contador}</span>
        </article>
    `;
});
