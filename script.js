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

const cargoMestre = ["Especialista ", "Consultor ", "Diretor ", "Analista ", "Arquiteto ", "Gerente "];
const deUso = [" em ", " de "];
const tipo = [" Aperto ", " Mãos Virtuais ", " Ideias ", " Cartões ", " Sorrisos ", " Primeiras ", " Criatividade "];
const detalhe = [" Brilhantes", " Improváveis", " Digitais", " Impressões", " Instantânea"];

let contador = 0;

const botaoInterativo = document.getElementById("btn-interativo");
const mensagem = document.getElementById("mensagem");
const cartaoGerado = document.getElementById("cartao-gerado");
const mineCartao = document.getElementById("lateral");

botaoInterativo.addEventListener("click", function () {
    let extendido = gerator(10) + 1;
    const nomeDigitado = prompt("Digite o nome para o cartão:");
    const nome = nomeDigitado && nomeDigitado.trim() !== "" ? nomeDigitado.trim() : "Visitante Misterioso";
    const colors = [geratorColor(), geratorColor()];
    const gradienteC = {cores: colors[0] + " e " +colors[1]};

    let cargo = cargoMestre[gerator(cargoMestre.length)] + deUso[0] + tipo[gerator(tipo.length)];
    if(extendido % 2 == 0){
        cargo += deUso[1] + tipo[gerator(tipo.length)];
    }
    cargo += detalhe[gerator(detalhe.length)];

    contador = contador + 1;
    mensagem.innerHTML = "O botão foi clicado " + contador + " vez(es).";
    cartaoGerado.innerHTML = `
        <article class="cartao-digital" style="background: linear-gradient(135deg,${colors[0]},${colors[1]});">
            <h3>${nome}</h3>
            <p>${cargo}</p>
            <p>Paleta: ${gradienteC.cores}</p>
            <p>Cartão de visitas digital gerado automaticamente.</p>
            <span class="numero-cartao">Cartão nº ${contador}</span>
        </article>
    `;

    mineCartao.innerHTML = `
        <article class="cartao-digital mini-cartao" style="background: linear-gradient(135deg,${colors[0]},${colors[1]});">
            <h3>${nome}</h3>
            <p>${cargo}</p>
        </article>
    `;
});
