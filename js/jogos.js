let timer;
let segundos = 0;
let pecasCorretas = 0;
let dificuldadeAtual = 4; // 4, 9 ou 16 peças

document.addEventListener("DOMContentLoaded", () => {
  const somAcerto = document.getElementById("som-acerto");
  const somVitoria = document.getElementById("som-vitoria");
});

function iniciarTimer() {
  timer = setInterval(() => {
    segundos++;
    document.getElementById("tempo").textContent = `${Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0")}:${(segundos % 60).toString().padStart(2, "0")}`;
  }, 1000);
}

function arrastarInicio(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.posicaoCorreta);
  event.dataTransfer.effectAllowed = "move";
}

function arrastarSobre(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function criarPecas(dificuldade) {
  const tamanhoGrid = Math.sqrt(dificuldade);
  const pecasContainer = document.querySelector(".pecas-container");
  const areaMontagem = document.querySelector(".area-montagem");

  // Resetar
  pecasContainer.innerHTML = "";
  areaMontagem.innerHTML = "";

  // Criar peças
  for (let i = 0; i < dificuldade; i++) {
    // Peça
    const peca = document.createElement("div");
    peca.className = "peca peca-imagem";
    peca.draggable = true;
    peca.dataset.posicaoCorreta = i;

    // Cálculo correto das coordenadas
    const col = (i % tamanhoGrid) * (100 / tamanhoGrid);
    const lin = Math.floor(i / tamanhoGrid) * (100 / tamanhoGrid);

    peca.style.backgroundPosition = `${col}% ${lin}%`;
    peca.style.backgroundSize = `${tamanhoGrid * 100}% ${tamanhoGrid * 100}%`;

    peca.addEventListener("dragstart", arrastarInicio);
    pecasContainer.appendChild(peca);

    // Alvo
    const alvo = document.createElement("div");
    alvo.className = "alvo";
    alvo.dataset.posicao = i;
    alvo.addEventListener("dragover", arrastarSobre);
    alvo.addEventListener("drop", soltarPeca);
    areaMontagem.appendChild(alvo);
  }

  // Ajustar grid
  areaMontagem.style.gridTemplateColumns = `repeat(${tamanhoGrid}, 1fr)`;
  pecasContainer.style.gridTemplateColumns = `repeat(${tamanhoGrid}, 1fr)`;

  // Embaralhar
  for (let i = pecasContainer.children.length; i >= 0; i--) {
    pecasContainer.appendChild(
      pecasContainer.children[(Math.random() * i) | 0]
    );
  }
}

// Adicione esta função auxiliar
function verificarVitoria() {
  if (pecasCorretas === dificuldadeAtual) {
    clearInterval(timer);
    somVitoria.play();
    salvarRecorde();
    document.getElementById("mensagem").innerHTML = `
            🎉 Arca Completa! <small>"E Noé fez tudo como Deus ordenou."</small>
        `;
  }
}

function soltarPeca(event) {
  event.preventDefault();
  const posicaoCorreta = event.dataTransfer.getData("text/plain");
  const alvo = event.target.closest(".alvo");

  if (!alvo || alvo.hasChildNodes()) return;

  const peca = Array.from(document.querySelectorAll(".peca")).find(
    (p) => p.dataset.posicaoCorreta === posicaoCorreta
  );

  if (peca) {
    somAcerto.play();
    alvo.appendChild(peca);
    peca.style.cursor = "default";

    // Verificar posição correta
    if (alvo.dataset.posicao === posicaoCorreta) {
      pecasCorretas++;
      alvo.classList.add("correta");
      verificarVitoria();
    }
  }
}

function salvarRecorde() {
  const melhorTempo = Number(localStorage.getItem("melhorTempo")) || 99999;
  if (segundos < melhorTempo) {
    localStorage.setItem("melhorTempo", segundos);
    document.getElementById("melhor-tempo").textContent = `${Math.floor(
      segundos / 60
    )
      .toString()
      .padStart(2, "0")}:${(segundos % 60).toString().padStart(2, "0")}`;
  }
}

function reiniciarJogo() {
  clearInterval(timer);
  segundos = 0;
  pecasCorretas = 0;
  document.getElementById("tempo").textContent = "00:00";
  document.getElementById("mensagem").textContent = "";
  criarPecas(dificuldadeAtual);
  iniciarTimer();
}

function mudarDificuldade(novaDificuldade) {
  dificuldadeAtual = novaDificuldade;
  reiniciarJogo();
}

// Iniciar ao carregar
document.addEventListener("DOMContentLoaded", () => {
  const melhorTempo = Number(localStorage.getItem("melhorTempo")) || 99999;
  if (melhorTempo) {
    document.getElementById("melhor-tempo").textContent = `${Math.floor(
      melhorTempo / 60
    )
      .toString()
      .padStart(2, "0")}:${(melhorTempo % 60).toString().padStart(2, "0")}`;
  }
  criarPecas(4);
  iniciarTimer();
});

// Banco de Perguntas atualizado com categorias e níveis
const perguntas = [
  {
    categoria: "Antigo Testamento",
    pergunta: "Quem construiu a arca para sobreviver ao dilúvio?",
    opcoes: ["Moisés", "Noé", "Abraão"],
    correta: 1,
    referencia: "Gênesis 6:14",
    explicacao: "Deus ordenou que Noé construísse a arca para salvar sua família e os animais do dilúvio."
  },
  {
    categoria: "Novo Testamento",
    pergunta: "Quantos discípulos Jesus escolheu?",
    opcoes: ["7", "10", "12"],
    correta: 2,
    referencia: "Mateus 10:2-4",
    explicacao: "Jesus escolheu 12 discípulos para segui-lo e espalhar seus ensinamentos."
  },
  {
    categoria: "Antigo Testamento",
    pergunta: "Quem foi lançado na cova dos leões por se recusar a adorar a imagem do rei?",
    opcoes: ["Daniel", "Elias", "José"],
    correta: 0,
    referencia: "Daniel 6:16",
    explicacao: "Daniel foi lançado na cova dos leões após se recusar a adorar uma imagem do rei, mas foi salvo por Deus."
  },
  {
    categoria: "Novo Testamento",
    pergunta: "Qual apóstolo negou Jesus três vezes antes do amanhecer?",
    opcoes: ["Pedro", "João", "Tiago"],
    correta: 0,
    referencia: "Mateus 26:69-75",
    explicacao: "Pedro negou Jesus três vezes, conforme predito por Jesus, mas se arrependeu depois da ressurreição."
  },
  {
    categoria: "Antigo Testamento",
    pergunta: "Quem foi o primeiro rei de Israel?",
    opcoes: ["Davi", "Saul", "Salomão"],
    correta: 1,
    referencia: "1 Samuel 10:1",
    explicacao: "Saul foi o primeiro rei de Israel, ungido por Samuel conforme a vontade de Deus."
  }
];

let perguntaAtual = 0;
let pontuacao = 0;
let nivel = 1;
let quizOriginalContent; // Variável para armazenar o conteúdo original do quiz

document.addEventListener("DOMContentLoaded", () => {
  const somAcerto = document.getElementById("som-acerto");
  const somVitoria = document.getElementById("som-vitoria");

  // Salva o conteúdo original do quiz-container
  const quizContainer = document.getElementById("quiz-container");
  quizOriginalContent = quizContainer.innerHTML;

  iniciarQuiz();
});

function iniciarQuiz() {
  document.getElementById("feedback").style.display = "none";
  mostrarPergunta();
}

function mostrarPergunta() {
  const quest = perguntas[perguntaAtual];
  document.getElementById("pergunta").innerHTML = `${quest.pergunta} <br><small>${quest.referencia}</small>`;
  document.getElementById("categoria").textContent = `Categoria: ${quest.categoria}`;

  const opcoesDiv = document.getElementById("opcoes");
  opcoesDiv.innerHTML = "";

  quest.opcoes.forEach((opcao, index) => {
    const botao = document.createElement("button");
    botao.className = "opcao";
    botao.innerHTML = opcao;
    botao.onclick = () => verificarResposta(index);
    opcoesDiv.appendChild(botao);
  });

  // Limpa a explicação da pergunta anterior
  document.getElementById("explicacao").textContent = "";
  document.getElementById("barra-progresso").style.width = `${(perguntaAtual / perguntas.length) * 100}%`;
  document.getElementById("pontuacao").textContent = pontuacao;
}

function verificarResposta(resposta) {
  const ultimaPergunta = perguntaAtual === perguntas.length - 1;
  const quest = perguntas[perguntaAtual];
  const opcoes = document.querySelectorAll(".opcao");
  const somCorreto = document.getElementById("som-correto");
  const somIncorreto = document.getElementById("som-incorreto");

  opcoes.forEach((opcao, index) => {
    opcao.style.pointerEvents = "none";
    if (index === quest.correta) {
      opcao.classList.add("correta");
    } else if (index === resposta) {
      opcao.classList.add("errada");
    }
  });

  if (resposta === quest.correta) {
    pontuacao++;
    somCorreto.play();
  } else {
    somIncorreto.play();
    document.getElementById("explicacao").textContent = quest.explicacao;
  }

  document.getElementById("feedback").style.display = "block";
  if (ultimaPergunta) {
    setTimeout(finalizarQuiz, 1000);
  } else {
    document.querySelector(".botao-proxima").style.display = "block";
  }
}

function proximaPergunta() {
  perguntaAtual++;

  if (perguntaAtual < perguntas.length) {
    iniciarQuiz();
  } else {
    finalizarQuiz();
  }
}

function finalizarQuiz() {
  localStorage.setItem("melhorPontuacao", Math.max(pontuacao, Number(localStorage.getItem("melhorPontuacao")) || 0));
  document.getElementById("quiz-container").innerHTML = `
    <div class="resultado-final">
      <h3>🎉 Quiz Concluído!</h3>
      <p>Sua pontuação: ${pontuacao}/${perguntas.length}</p>
      <p>Melhor pontuação: ${localStorage.getItem("melhorPontuacao")}</p>
      <button onclick="reiniciarQuiz()">🔁 Jogar Novamente</button>
    </div>
  `;
}

function reiniciarQuiz() {
  const quizContainer = document.getElementById("quiz-container");

  // Restaura o conteúdo original do quiz
  quizContainer.innerHTML = quizOriginalContent;

  // Reinicia as variáveis
  perguntaAtual = 0;
  pontuacao = 0;

  // Reativa os event listeners
  document.querySelectorAll(".opcao").forEach((opcao) => {
    opcao.addEventListener("click", verificarResposta);
  });

  // Inicia o quiz novamente
  iniciarQuiz();
}

// Exemplo: Jogo da Memória
const personagens = ["davi", "golias", "noe", "moises", "maria", "jesus"];
let cartas = [...personagens, ...personagens]; // Duplica para formar pares

function criarGradeMemoria() {
  const grade = document.querySelector(".grade-memoria");
  cartas = cartas.sort(() => Math.random() - 0.5); // Embaralha

  cartas.forEach((personagem, index) => {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.personagem = personagem;
    carta.dataset.indice = index;
    carta.addEventListener("click", virarCarta);
    grade.appendChild(carta);
  });
}

function virarCarta(event) {
  const carta = event.target;
  carta.style.background = "#fff";
  carta.textContent = carta.dataset.personagem;
  // Lógica para verificar pares...
}


document.addEventListener("DOMContentLoaded", () => {
  const palavras = ["ESTRELA", "ÁRVORE", "TERRA", "ANIMAL", "HOMEM", "LUA", "MAR", "SOL"]
    .sort((a, b) => b.length - a.length); // Ordena do maior para menor
  const tamanhoGrade = 12;
  const tabela = document.querySelector(".tabela-palavras");
  const container = document.querySelector(".container"); // Adicionando um container para o botão
  let grade = [];
  let ocupado = [];

  function inicializarGrade() {
    tabela.innerHTML = ""; // Limpa a tabela
    grade = Array.from({ length: tamanhoGrade }, () =>
      Array.from({ length: tamanhoGrade }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );
    ocupado = Array.from({ length: tamanhoGrade }, () => Array(tamanhoGrade).fill(false));

    // Coloca as palavras na grade
    palavras.forEach(palavra => {
      if (!colocarPalavra(palavra)) {
        console.error(`Não foi possível colocar: ${palavra}`);
      }
    });

    // Renderiza a tabela
    grade.forEach((linha, i) => {
      const tr = document.createElement("tr");
      linha.forEach((letra, j) => {
        const td = document.createElement("td");
        td.textContent = letra;
        td.dataset.linha = i;
        td.dataset.coluna = j;
        tr.appendChild(td);
      });
      tabela.appendChild(tr);
    });
  }

  function colocarPalavra(palavra) {
    const direcoes = ["horizontal", "vertical"];
    for (let tentativa = 0; tentativa < 100; tentativa++) {
      const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
      let linha, coluna;

      if (direcao === "horizontal") {
        linha = Math.floor(Math.random() * tamanhoGrade);
        coluna = Math.floor(Math.random() * (tamanhoGrade - palavra.length + 1));
      } else {
        coluna = Math.floor(Math.random() * tamanhoGrade);
        linha = Math.floor(Math.random() * (tamanhoGrade - palavra.length + 1));
      }

      let podeColocar = true;
      for (let i = 0; i < palavra.length; i++) {
        const linhaAtual = direcao === "horizontal" ? linha : linha + i;
        const colunaAtual = direcao === "horizontal" ? coluna + i : coluna;

        if (ocupado[linhaAtual][colunaAtual] && grade[linhaAtual][colunaAtual] !== palavra[i]) {
          podeColocar = false;
          break;
        }
      }

      if (podeColocar) {
        for (let i = 0; i < palavra.length; i++) {
          const linhaAtual = direcao === "horizontal" ? linha : linha + i;
          const colunaAtual = direcao === "horizontal" ? coluna + i : coluna;

          grade[linhaAtual][colunaAtual] = palavra[i];
          ocupado[linhaAtual][colunaAtual] = true;
        }
        return true;
      }
    }
    return false;
  }

  let palavrasEncontradas = [];
  let selecionados = [];

  tabela.addEventListener("click", (e) => {
    if (e.target.tagName === "TD") {
      const linha = parseInt(e.target.dataset.linha);
      const coluna = parseInt(e.target.dataset.coluna);

      const index = selecionados.findIndex((celula) => celula.linha === linha && celula.coluna === coluna);
      if (index === -1) {
        selecionados.push({ linha, coluna });
        e.target.classList.add("selecionado");
      } else {
        selecionados.splice(index, 1);
        e.target.classList.remove("selecionado");
      }

      verificarPalavra(selecionados);
    }
  });

  function verificarPalavra(celulas) {
    if (celulas.length < 2) return;

    celulas.sort((a, b) => a.linha - b.linha || a.coluna - b.coluna);

    const direcao = celulas[0].linha === celulas[1].linha ? "horizontal" : "vertical";
    const valido = celulas.every((celula, i, arr) => {
      if (direcao === "horizontal") {
        return celula.linha === arr[0].linha && celula.coluna === arr[0].coluna + i;
      } else {
        return celula.coluna === arr[0].coluna && celula.linha === arr[0].linha + i;
      }
    });

    if (valido) {
      const palavra = celulas.map((celula) => grade[celula.linha][celula.coluna]).join("");
      if (palavras.includes(palavra) && !palavrasEncontradas.includes(palavra)) {
        palavrasEncontradas.push(palavra);
        celulas.forEach((celula) => {
          const td = tabela.rows[celula.linha].cells[celula.coluna];
          td.classList.add("encontrado");
        });

        adicionarPalavraEncontrada(palavra);
        selecionados = [];

        if (palavrasEncontradas.length === palavras.length) {
          mostrarBotaoReiniciar();
        }
      }
    }
  }

  function adicionarPalavraEncontrada(palavra) {
    const listaPalavras = document.getElementById("lista-palavras");
    const item = document.createElement("li");
    item.textContent = palavra;
    listaPalavras.appendChild(item);
  }
  function mostrarBotaoReiniciar() {
    let botao = document.getElementById("botao-reiniciar");
    let container = document.getElementById("botao-container"); // Novo container correto

    if (!botao) {
      botao = document.createElement("button");
      botao.id = "botao-reiniciar";
      botao.textContent = "Reiniciar Jogo";
      botao.addEventListener("click", reiniciarJogo);
      container.appendChild(botao); // Agora o botão será adicionado no local correto
    }
    botao.style.display = "block";
  }


  function reiniciarJogo() {
    palavrasEncontradas = [];
    selecionados = [];
    const listaPalavras = document.getElementById("lista-palavras");
    listaPalavras.innerHTML = "";
    let botao = document.getElementById("botao-reiniciar");
    if (botao) botao.style.display = "none";
    inicializarGrade();
  }

  inicializarGrade();
});
