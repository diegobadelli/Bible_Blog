// js/script.js

window.addEventListener("scroll", function () {
  document
    .querySelector("header")
    .classList.toggle("shrink", window.scrollY > 50);
});



document.querySelectorAll("#navbar a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("navbar").classList.remove("active");
  });
});

// Array de orações (personalize conforme desejar)
const oracoes = [
  "Querido Deus, obrigado por este dia. Ajuda-me a ser bondoso com todos que encontrar hoje e a aprender algo novo. Amém! 🌟",
  "Senhor, obrigado pela minha família e amigos. Abençoa aqueles que estão passando por dificuldades hoje. 🙏",
  "Pai celestial, guia-me para fazer escolhas corretas hoje, mesmo quando for difícil. Que eu possa refletir o Teu amor. 💖",
  "Deus, obrigado pela natureza tão linda que criaste. Ensina-me a cuidar do nosso planeta e de todos os seres vivos. 🌍",
  "Jesus, ajuda-me a ser corajoso como Davi e a confiar em Ti em todas as situações. Obrigado por me amar sempre! ✨",
];

// Versículos de reserva caso a API esteja indisponível
const versiculosOffline = [
  {
    texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito",
    referencia: "João 3:16",
  },
  {
    texto: "O Senhor é meu pastor; nada me faltará",
    referencia: "Salmos 23:1",
  },
  {
    texto: "Tudo posso naquele que me fortalece",
    referencia: "Filipenses 4:13",
  },
  {
    texto: "Ensina a criança no caminho em que deve andar",
    referencia: "Provérbios 22:6",
  },
];

// IDs de vídeos do canal LionUp para exibir aleatoriamente
const lionUpVideos = [
  "s1ldFjCZx5w",
  "Hj1CczOCnG4",
  "dQw4w9WgXcQ",
];

function toggleMenu() {
  var navbar = document.getElementById("navbar");
  navbar.classList.toggle("active");
}


document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".fade-in");

  function checkVisibility() {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        element.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkVisibility);
  checkVisibility();
});


// Função para gerar oração aleatória
function gerarOracao() {
  const indice = Math.floor(Math.random() * oracoes.length);
  document.getElementById("texto-oracao").textContent = oracoes[indice];
}


// Gerar oração automática ao carregar a página + a cada 24h
function atualizarOracaoDiaria() {
  const hoje = new Date().getDate(); // Dia do mês (1-31)
  const indice = hoje % oracoes.length; // Usa o dia para escolher a oração
  document.getElementById("texto-oracao").textContent = oracoes[indice];
}

// Função para buscar o versículo do dia
async function carregarVersiculoDoDia() {
  const versiculoElemento = document.getElementById("versiculo-conteudo");

  try {
    // Passo 1: Buscar dados da API Almeida
    const resposta = await fetch("https://bible-api.com/data/almeida/random");

    // Verifica se a resposta da API está OK
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    // Passo 2: Converter para JSON
    const dados = await resposta.json();

    // Passo 3: Extrair informações do versículo
    const versiculo = dados.random_verse;
    const texto = versiculo.text;
    const referencia = `${versiculo.book} ${versiculo.chapter}:${versiculo.verse}`;

    // Passo 4: Atualizar o HTML
    versiculoElemento.innerHTML = `
          <p class="texto-versiculo">"${texto}"</p>
          <p class="referencia-versiculo">— ${referencia}</p>
      `;
  } catch (erro) {
    // Passo 5: Tratar erros com versículo local
    console.error("Falha ao carregar versículo:", erro);
    const indice = Math.floor(Math.random() * versiculosOffline.length);
    const versiculo = versiculosOffline[indice];
    versiculoElemento.innerHTML = `
          <p class="texto-versiculo">"${versiculo.texto}"</p>
          <p class="referencia-versiculo">— ${versiculo.referencia}</p>
          <p class="aviso-versiculo">Versículo offline</p>
      `;
  }
}

// Função de compartilhamento
function compartilharVersiculo() {
  const texto =
    document.querySelector(".texto-versiculo")?.textContent ||
    "Versículo inspirador da Bíblia";
  const referencia =
    document.querySelector(".referencia-versiculo")?.textContent || "";
  const mensagem = `${texto} ${referencia} - Veja mais em ${window.location.href}`;

  if (navigator.share) {
    navigator.share({
      title: "Versículo do Dia",
      text: mensagem,
    });
  } else {
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }
}

// Funções para os quizzes
function verificarResposta(historiaId, resposta) {
  const resultados = {
    1: { correta: 1, mensagem: "Isso! 🌱 Deus criou plantas no 3º dia!" },
    2: { correta: 2, mensagem: "Exato! Davi levou 5 pedrinhas! 🪨" },
    3: { correta: 2, mensagem: "Certo! Daniel orava 3 vezes ao dia! 🙏" },
    4: { correta: 2, mensagem: "Isso! O samaritano ajudou! ❤️" },
    5: { correta: 2, mensagem: "Correto! Choveu por 40 dias! 🌧️" },
    6: { correta: 2, mensagem: "Sim! Jesus nasceu em Belém! 🌟" },
    7: { correta: 2, mensagem: "Exato! A serpente enganou Eva! 🐍" },
    8: { correta: 1, mensagem: "Isso! O filho se chamava Isaque! 👶" },
    9: { correta: 2, mensagem: "Certo! Ana dedicou Samuel a Deus! ⛪" },
    10: { correta: 2, mensagem: "Exato! Deus chamou 3 vezes! 🌙" },
    11: { correta: 2, mensagem: "Sim! Maria aceitou com fé! 🙏" },
    12: { correta: 2, mensagem: "Isso! Moisés usou o cajado! 🪄" },
    13: { correta: 1, mensagem: "Certo! 7 voltas no 7º dia! 🎇" },
    14: { correta: 2, mensagem: "Exato! Jesus repreendeu o vento! 🌪️" },
    15: { correta: 2, mensagem: "Sim! 12 cestos de sobras! 🧺" },
    16: { correta: 2, mensagem: "Isso! O pai o abraçou! 💞" },
    17: { correta: 2, mensagem: "Certo! 2 vezes ao dia! 🕊️" },
    18: { correta: 1, mensagem: "Exato! 99 ovelhas ficaram! 🌾" },
    19: { correta: 2, mensagem: "Sim! Pedro duvidou! 😲" },
    20: { correta: 2, mensagem: "Correto! Lázaro estava morto há 4 dias! ⏳" },
  };

  const resultadoElemento = document.getElementById(`resultado-${historiaId}`);
  const botoes = document.querySelectorAll(`#historia-${historiaId} button`);

  // Desativa os botões após resposta
  botoes.forEach((botao) => (botao.disabled = true));

  if (resposta === resultados[historiaId].correta) {
    resultadoElemento.innerHTML = `<span class="resposta-correta">${resultados[historiaId].mensagem}</span>`;
    resultadoElemento.classList.add("animacao-correta");
  } else {
    resultadoElemento.innerHTML = `<span class="resposta-incorreta">❌ Ops! Tente novamente! 😊</span>`;
    resultadoElemento.classList.add("animacao-incorreta");
  }
}

// Compartilhar história
function compartilharHistoria(titulo) {
  const mensagem = `Leia a história "${titulo}" no Blog da Bíblia para Crianças: ${window.location.href}`;

  if (navigator.share) {
    navigator.share({
      title: titulo,
      text: mensagem,
    });
  } else {
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }
}

// Jogo Bíblico
function verificarRespostaJogo(resposta) {
  const resultado = document.getElementById("resultado-jogo");
  if (resposta === "noe") {
    resultado.innerHTML = "🎉 Correto! Noé construiu a arca!";
    resultado.style.color = "green";
  } else {
    resultado.innerHTML = "😅 Tente novamente! Dica: Ele tinha uma arca.";
    resultado.style.color = "red";
  }
}

// Escolhe aleatoriamente um vídeo do canal LionUp
function carregarLionUpVideo() {
  const iframe = document.querySelector(".lionup-videos iframe");
  if (!iframe) return;
  const indice = Math.floor(Math.random() * lionUpVideos.length);
  iframe.src = `https://www.youtube-nocookie.com/embed/${lionUpVideos[indice]}`;
}

// Iniciar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  carregarVersiculoDoDia(); // Carrega o versículo do dia
  atualizarOracaoDiaria(); // Carrega a oração do dia
  carregarLionUpVideo(); // Insere vídeo do canal
});
