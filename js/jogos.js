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
    explicacao:
      "Daniel foi lançado na cova dos leões após se recusar a adorar uma imagem do rei, mas foi salvo por Deus.",
  },
  {
    categoria: "Novo Testamento",
    pergunta: "Qual apóstolo negou Jesus três vezes antes do amanhecer?",
    opcoes: ["Pedro", "João", "Tiago"],
    correta: 0,
    referencia: "Mateus 26:69-75",
    explicacao:
      "Pedro negou Jesus três vezes, conforme predito por Jesus, mas se arrependeu depois da ressurreição.",
  },
  {
    categoria: "Antigo Testamento",
    pergunta: "Quem foi o primeiro rei de Israel?",
    opcoes: ["Davi", "Saul", "Salomão"],
    correta: 1,
    referencia: "1 Samuel 10:1",
    explicacao:
      "Saul foi o primeiro rei de Israel, ungido por Samuel conforme a vontade de Deus.",
  }
  // Adicione mais perguntas conforme necessário
];

let perguntaAtual = 0;
let pontuacao = 0;
let nivel = 1;

document.addEventListener("DOMContentLoaded", () => {
  const somAcerto = document.getElementById("som-acerto");
  const somVitoria = document.getElementById("som-vitoria");
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
  document.getElementById(".quiz-container").innerHTML = `
    <div class="resultado-final">
      <h3>🎉 Quiz Concluído!</h3>
      <p>Sua pontuação: ${pontuacao}/${perguntas.length}</p>
      <p>Melhor pontuação: ${localStorage.getItem("melhorPontuacao")}</p>
      <button onclick="reiniciarQuiz()">🔁 Jogar Novamente</button>
    </div>
  `;
}

function reiniciarQuiz() {
  perguntaAtual = 0;
  pontuacao = 0;
  iniciarQuiz();
}


document.addEventListener("DOMContentLoaded", iniciarQuiz);

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

// Iniciar jogo ao carregar
document.addEventListener("DOMContentLoaded", criarGradeMemoria);
