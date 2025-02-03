let timer;
let segundos = 0;
let pecasCorretas = 0;
let dificuldadeAtual = 4; // 4, 9 ou 16 peças
const somAcerto = document.getElementById("som-acerto");
const somVitoria = document.getElementById("som-vitoria");

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
  const melhorTempo = localStorage.getItem("melhorTempo") || Infinity;
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
  const melhorTempo = localStorage.getItem("melhorTempo");
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

// Banco de Perguntas
const perguntas = [
  {
    pergunta: "O que Deus prometeu a Abraão em Gênesis 12:2?",
    opcoes: [
      "Fazer dele uma grande nação",
      "Dar-lhe riquezas infinitas",
      "Protegê-lo de todos os perigos",
    ],
    correta: 0,
    referencia: "Gênesis 12:2",
  },
  {
    pergunta: "Qual promessa Deus fez após o dilúvio?",
    opcoes: [
      "Nunca mais destruir a terra com água",
      "Dar sabedoria aos humanos",
      "Enviar um salvador imediatamente",
    ],
    correta: 0,
    referencia: "Gênesis 9:11",
  },
  {
    pergunta: "O que Jeremias 29:11 diz sobre os planos de Deus?",
    opcoes: [
      "São planos para o bem e não para o mal",
      "Exigem sacrifícios humanos",
      "São secretos e incompreensíveis",
    ],
    correta: 0,
    referencia: "Jeremias 29:11",
  },
  {
    pergunta: "Qual promessa Jesus fez em João 14:3?",
    opcoes: [
      "Preparar um lugar para nós no céu",
      "Dar vida fácil na terra",
      "Responder todas as perguntas",
    ],
    correta: 0,
    referencia: "João 14:3",
  },
  {
    pergunta: "O que Filipenses 4:19 promete sobre as necessidades?",
    opcoes: [
      "Deus suprirá todas elas",
      "Devemos resolver sozinhos",
      "São consequência do pecado",
    ],
    correta: 0,
    referencia: "Filipenses 4:19",
  },
];

let perguntaAtual = 0;
let pontuacao = 0;

function iniciarQuiz() {
  document.getElementById("feedback").style.display = "none";
  mostrarPergunta();
}

function mostrarPergunta() {
  const quest = perguntas[perguntaAtual];

  // Atualizar pergunta
  document.getElementById("pergunta").innerHTML = `
        ${quest.pergunta} <br>
        <small>${quest.referencia}</small>
    `;

  // Criar opções
  const opcoesDiv = document.getElementById("opcoes");
  opcoesDiv.innerHTML = "";

  quest.opcoes.forEach((opcao, index) => {
    const botao = document.createElement("button");
    botao.className = "opcao";
    botao.innerHTML = opcao;
    botao.onclick = () => verificarResposta(index);
    opcoesDiv.appendChild(botao);
  });

  // Atualizar progresso
  document.getElementById("barra-progresso").style.width = `${
    (perguntaAtual / perguntas.length) * 100
  }%`;
  document.getElementById("pontuacao").textContent = pontuacao;
}

function verificarResposta(resposta) {
  const quest = perguntas[perguntaAtual];
  const opcoes = document.querySelectorAll(".opcao");
  const somCorreto = document.getElementById("som-correto");
  const somIncorreto = document.getElementById("som-incorreto");

  opcoes.forEach((opcao, index) => {
    opcao.style.pointerEvents = "none"; // Desativar cliques
    if (index === quest.correta) {
      opcao.classList.add("correta");
    } else if (index === resposta && index !== quest.correta) {
      opcao.classList.add("errada");
    }
  });

  if (resposta === quest.correta) {
    pontuacao++;
    somCorreto.play();
  } else {
    somIncorreto.play();
  }

  document.getElementById("feedback").style.display = "block";
  document.querySelector(".botao-proxima").style.display = "block";
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
  document.getElementById("quiz-container").innerHTML = `
        <div class="resultado-final">
            <h3>🎉 Quiz Concluído!</h3>
            <p>Sua pontuação: ${pontuacao}/${perguntas.length}</p>
            <button onclick="reiniciarQuiz()">🔁 Jogar Novamente</button>
            <p class="versiculo">"Sejam fortes e corajosos. Não tenham medo... pois o Senhor, o seu Deus, os acompanhará." <br>
            <em>(Josué 1:9)</em></p>
        </div>
    `;
}

function reiniciarQuiz() {
  perguntaAtual = 0;
  pontuacao = 0;
  iniciarQuiz();
}

// Iniciar ao carregar
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
