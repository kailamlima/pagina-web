function gerator(size){
    return Math.floor(Math.random() * size);
}

function geratorColor(){
    let color = "#";
    const hex = "0123456789abcdef";
    while(color.length < 7){
        color += hex[gerator(hex.length)];
    }
    return color;
}

function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function buscarCartoesSalvos() {
    try {
        const dadosSalvos = localStorage.getItem(CHAVE_CARTOES);
        if (!dadosSalvos) {
            return [];
        }

        const cartoes = JSON.parse(dadosSalvos);
        return Array.isArray(cartoes) ? cartoes : [];
    } catch (erro) {
        return [];
    }
}

function salvarCartao(cartao) {
    const cartoes = buscarCartoesSalvos();
    cartoes.push(cartao);

    const ultimosCartoes = cartoes.slice(-LIMITE_HISTORICO);

    try {
        localStorage.setItem(CHAVE_CARTOES, JSON.stringify(ultimosCartoes));
    } catch (erro) {
        if (mensagem) {
            mensagem.innerHTML = "O cartão foi gerado, mas não foi possível salvar o histórico neste navegador.";
        }
    }
}

function formatarData(dataISO) {
    const data = new Date(dataISO);

    if (Number.isNaN(data.getTime())) {
        return "Data não disponível";
    }

    return data.toLocaleString("pt-BR");
}

function obterMaiorNumeroSalvo() {
    const cartoes = buscarCartoesSalvos();

    return cartoes.reduce(function (maiorNumero, cartao) {
        const numeroCartao = Number(cartao.numero || cartao.contador || 0);
        return numeroCartao > maiorNumero ? numeroCartao : maiorNumero;
    }, 0);
}

function renderizarHistorico() {
    if (!listaCartoes) {
        return;
    }

    const cartoes = buscarCartoesSalvos();

    if (cartoes.length === 0) {
        listaCartoes.innerHTML = '<p class="historico-vazio">Nenhum cartão salvo ainda.</p>';
        return;
    }

    listaCartoes.innerHTML = cartoes
        .slice()
        .reverse()
        .map(function (cartao) {
            const nome = escaparHTML(cartao.nome || "Sem nome");
            const cargo = escaparHTML(cartao.cargo || "Cargo não informado");
            const numero = Number(cartao.numero || cartao.contador || 0);
            const dataCriacao = escaparHTML(formatarData(cartao.criadoEm));

            return `
                <article class="item-historico">
                    <h3>${nome}</h3>
                    <p>${cargo}</p>
                    <p>Cartão nº ${numero}</p>
                    <p class="data-cartao">Criado em ${dataCriacao}</p>
                </article>
            `;
        })
        .join("");
}

function limparHistorico() {
    try {
        localStorage.removeItem(CHAVE_CARTOES);
    } catch (erro) {
        return;
    }

    contador = 0;
    renderizarHistorico();

    if (mensagem) {
        mensagem.innerHTML = "Histórico limpo com sucesso.";
    }
}

function geratorLocal(nome){
    let extendido = gerator(10) + 1;
    const colors = [geratorColor(), geratorColor()];
    const numero = contador + 1;

    let cargo = cargoMestre[gerator(cargoMestre.length)] + deUso[0] + tipo[gerator(tipo.length)];
    if(extendido % 2 == 0){
        cargo += deUso[1] + tipo[gerator(tipo.length)];
    }
    cargo += detalhe[gerator(detalhe.length)];

    contador = numero;

    return {
        nome: nome,
        cargo: cargo,
        corPrimaria: colors[0],
        corSecundaria: colors[1],
        numero: numero,
        criadoEm: new Date().toISOString()
    };
}

function renderisador(gerado){
    const nome = escaparHTML(gerado.nome);
    const cargo = escaparHTML(gerado.cargo);
    const corPrimaria = gerado.corPrimaria || gerado.color1;
    const corSecundaria = gerado.corSecundaria || gerado.color2;
    const numero = gerado.numero || gerado.contador;
    const cores = escaparHTML(corPrimaria + " e " + corSecundaria);

    mensagem.innerHTML = "O botão foi clicado " + numero + " vez(es).";
    cartaoGerado.innerHTML = `
        <article class="cartao-digital" style="background: linear-gradient(135deg,${corPrimaria},${corSecundaria});">
            <h3>${nome}</h3>
            <p>${cargo}</p>
            <p>Paleta: ${cores}</p>
            <p>Cartão de visitas digital gerado automaticamente.</p>
            <span class="numero-cartao">Cartão nº ${numero}</span>
        </article>
    `;

    mineCartao.innerHTML = `
        <article class="cartao-digital mini-cartao" style="background: linear-gradient(135deg,${corPrimaria},${corSecundaria});">
            <h3>${nome}</h3>
            <p>${cargo}</p>
        </article>
    `;
}

function exibirAlertaCep(titulo, texto, icone) {
    if (typeof Swal !== "undefined") {
        Swal.fire(titulo, texto, icone);
    }
}

function mostrarErroCep(mensagem) {
    cepFeedback.textContent = mensagem;
    cepFeedback.classList.remove("sucesso", "carregando");
    cepFeedback.classList.add("erro");
    cep.classList.remove("sucesso", "carregando");
    cep.classList.add("erro");
}

function mostrarSucessoCep(mensagem) {
    cepFeedback.textContent = mensagem;
    cepFeedback.classList.remove("erro", "carregando");
    cepFeedback.classList.add("sucesso");
    cep.classList.remove("erro", "carregando");
    cep.classList.add("sucesso");
}

function limparFeedbackCep() {
    cepFeedback.textContent = "";
    cepFeedback.classList.remove("erro", "sucesso", "carregando");
    cep.classList.remove("erro", "sucesso", "carregando");
    resultadoCep.replaceChildren();
}

function renderizarEndereco(dados) {
    resultadoCep.replaceChildren();

    const enderecoCard = document.createElement("article");
    enderecoCard.classList.add("endereco-card");

    const titulo = document.createElement("h3");
    titulo.textContent = "Endereço encontrado";
    enderecoCard.appendChild(titulo);

    const campos = [
        ["CEP", dados.cep],
        ["Logradouro", dados.logradouro],
        ["Bairro", dados.bairro],
        ["Cidade", dados.localidade],
        ["Estado", dados.uf],
        ["DDD", dados.ddd]
    ];

    campos.forEach(function (campo) {
        const linha = document.createElement("p");
        const rotulo = document.createElement("strong");

        rotulo.textContent = campo[0] + ": ";
        linha.appendChild(rotulo);
        linha.appendChild(document.createTextNode(campo[1] || "Não informado"));
        enderecoCard.appendChild(linha);
    });

    resultadoCep.appendChild(enderecoCard);
}

const CHAVE_CARTOES = "cartoesGerados";
const LIMITE_HISTORICO = 10;
const cargoMestre = ["Especialista ", "Consultor ", "Diretor ", "Analista ", "Arquiteto ", "Gerente "];
const deUso = [" em ", " de "];
const tipo = [" Aperto ", " Mãos Virtuais ", " Ideias ", " Cartões ", " Sorrisos ", " Primeiras ", " Criatividade "];
const detalhe = [" Brilhantes", " Improváveis", " Digitais", " Impressões", " Instantânea"];

let contador = obterMaiorNumeroSalvo();

const botaoInterativo = document.getElementById("btn-interativo");
const mensagem = document.getElementById("mensagem");
const cartaoGerado = document.getElementById("cartao-gerado");
const mineCartao = document.getElementById("mini-cartao-area");
const listaCartoes = document.getElementById("lista-cartoes");
const botaoLimparHistorico = document.getElementById("btn-limpar-historico");
const formCep = document.getElementById("form-cep");
const cep = document.getElementById("cep");
const cepFeedback = document.getElementById("cep-feedback");
const resultadoCep = document.getElementById("resultado-cep");

botaoInterativo.addEventListener("click", function () {
    const nomeDigitado = prompt("Digite o nome para o cartão:");

    if (!nomeDigitado || nomeDigitado.trim() === "") {
        mensagem.innerHTML = "Informe um nome para gerar o cartão.";
        return;
    }

    const nome = nomeDigitado.trim();
    const dadosDoCartao = geratorLocal(nome);

    renderisador(dadosDoCartao);
    salvarCartao(dadosDoCartao);
    renderizarHistorico();
});

formCep.addEventListener("submit", async function (event) {
    event.preventDefault();
    limparFeedbackCep();

    const cepLimpo = cep.value.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        mostrarErroCep("Informe um CEP válido com 8 dígitos.");
        exibirAlertaCep("CEP inválido", "Digite exatamente 8 números para consultar.", "error");
        return;
    }

    cepFeedback.textContent = "Buscando endereço...";
    cepFeedback.classList.add("carregando");
    cep.classList.add("carregando");

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

        if (!resposta.ok) {
            throw new Error("Falha ao consultar a API ViaCEP.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            mostrarErroCep("CEP não encontrado. Confira os números digitados.");
            exibirAlertaCep("CEP não encontrado", "A API ViaCEP não encontrou esse CEP.", "error");
            return;
        }

        renderizarEndereco(dados);
        mostrarSucessoCep("Endereço encontrado com sucesso.");
        exibirAlertaCep("Endereço encontrado", "Os dados foram carregados com sucesso.", "success");
    } catch (erro) {
        mostrarErroCep("Não foi possível buscar o endereço agora. Tente novamente.");
        exibirAlertaCep("Erro na consulta", "Não foi possível consultar a API ViaCEP.", "error");
    }
});

botaoLimparHistorico.addEventListener("click", limparHistorico);
renderizarHistorico();
