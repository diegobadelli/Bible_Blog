// js/script.js

// Função para buscar o versículo do dia
async function carregarVersiculoDoDia() {
    const versiculoElemento = document.getElementById('versiculo-conteudo');
    
    try {
        // Passo 1: Buscar dados da API Almeida
        const resposta = await fetch('https://bible-api.com/data/almeida/random');
        
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
        // Passo 5: Tratar erros
        console.error("Falha ao carregar versículo:", erro);
        versiculoElemento.innerHTML = `
            <p class="erro">😕 Não foi possível carregar o versículo hoje.</p>
            <button onclick="carregarVersiculoDoDia()">Tentar novamente</button>
        `;
    }
}

// Função de compartilhamento
function compartilharVersiculo() {
    const texto = document.querySelector('.texto-versiculo')?.textContent || "Versículo inspirador da Bíblia";
    const referencia = document.querySelector('.referencia-versiculo')?.textContent || "";
    const mensagem = `${texto} ${referencia} - Veja mais em ${window.location.href}`;

    if (navigator.share) {
        navigator.share({
            title: 'Versículo do Dia',
            text: mensagem
        });
    } else {
        alert('Copie para compartilhar:\n' + mensagem);
    }
}

// Iniciar ao carregar a página
document.addEventListener('DOMContentLoaded', carregarVersiculoDoDia);

// Funções para os quizzes
function verificarResposta(historiaId, resposta) {
  const resultados = {
    1: {
      correta: 2,
      mensagem: "Isso mesmo! 🎉 Choveu por 40 dias e 40 noites!",
    },
    2: { correta: 2, mensagem: "Exato! Davi usou uma funda e 5 pedrinhas! 💪" },
    3: { correta: 1, mensagem: "Correto! Só o samaritano ajudou! ❤️" },
  };

  const resultadoElemento = document.getElementById(`resultado-${historiaId}`);
  if (resposta === resultados[historiaId].correta) {
    resultadoElemento.innerHTML = `<span style="color: green;">${resultados[historiaId].mensagem}</span>`;
  } else {
    resultadoElemento.innerHTML = `<span style="color: red;">Ops! Tente novamente! 😊</span>`;
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
    prompt("Copie o link para compartilhar:", mensagem);
  }
}
