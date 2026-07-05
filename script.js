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

function geratorLocal(nome){
    let extendido = gerator(10) + 1;
    const colors = [geratorColor(), geratorColor()];
    const gradienteC = {cores: colors[0] + " e " +colors[1]};

    let cargo = cargoMestre[gerator(cargoMestre.length)] + deUso[0] + tipo[gerator(tipo.length)];
    if(extendido % 2 == 0){
        cargo += deUso[1] + tipo[gerator(tipo.length)];
    }
    cargo += detalhe[gerator(detalhe.length)];

    contador = contador + 1;

    return {nome : nome, cargo : cargo, contador : contador, cores : gradienteC.cores, color1 : colors[0], color2: colors[1]};
}

function renderisador(gerado){
    mensagem.innerHTML = "O botão foi clicado " + contador + " vez(es).";
    cartaoGerado.innerHTML = `
        <article class="cartao-digital" style="background: linear-gradient(135deg,${gerado.color1},${gerado.color2});">
            <h3>${gerado.nome}</h3>
            <p>${gerado.cargo}</p>
            <p>Paleta: ${gerado.cores}</p>
            <p>Cartão de visitas digital gerado automaticamente.</p>
            <span class="numero-cartao">Cartão nº ${gerado.contador}</span>
        </article>
    `;

    mineCartao.innerHTML = `
        <article class="cartao-digital mini-cartao" style="background: linear-gradient(135deg,${gerado.color1},${gerado.color2});">
            <h3>${gerado.nome}</h3>
            <p>${gerado.cargo}</p>
        </article>
    `;
}

const serve = 'http://localhost:8080/gerar-cartao';

const cargoMestre = ["Especialista ", "Consultor ", "Diretor ", "Analista ", "Arquiteto ", "Gerente "];
const deUso = [" em ", " de "];
const tipo = [" Aperto ", " Mãos Virtuais ", " Ideias ", " Cartões ", " Sorrisos ", " Primeiras ", " Criatividade "];
const detalhe = [" Brilhantes", " Improváveis", " Digitais", " Impressões", " Instantânea"];

let contador = 0;

const botaoInterativo = document.getElementById("btn-interativo");
const mensagem = document.getElementById("mensagem");
const cartaoGerado = document.getElementById("cartao-gerado");
const mineCartao = document.getElementById("lateral");

botaoInterativo.addEventListener("click", async function () {
    
    const nomeDigitado = prompt("Digite o nome para o cartão:");
    const nome = nomeDigitado && nomeDigitado.trim() !== "" ? nomeDigitado.trim() : "Visitante Misterioso";
    let dadosDoCartao;

    try{
        const response = await fetch(serve, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({nome : nome})
        });

        if (!response.ok) throw new Error('Servidor Offline');
        dadosDoCartao = await response.json();
    } catch(Error){
        console.warn("Backend indisponivelusando geração local.", Error);
        dadosDoCartao = geratorLocal(nome);
    }

    renderisador(dadosDoCartao);
});


