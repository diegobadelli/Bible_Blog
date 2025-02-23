document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("pastorGameCanvas");
  const ctx = canvas.getContext("2d");

  // ✅ Fix canvas dimensions
  canvas.width = 400;
  canvas.height = 300;

  // ✅ Shepherd character
  const shepherd = { x: 50, y: 130, width: 40, height: 40, speed: 5 };
  const sheep = [];
  const dangers = [];
  let score = 0;

  // ✅ Load images
  const shepherdImg = new Image();
  shepherdImg.src = "assets/images/pastor.webp";
  shepherdImg.onload = () => console.log("Shepherd image loaded!");

  const sheepImg = new Image();
  sheepImg.src = "assets/images/ovelha.webp";
  sheepImg.onload = () => console.log("Sheep image loaded!");

  const wolfImg = new Image();
  wolfImg.src = "assets/images/lobo.webp";
  wolfImg.onload = () => console.log("Wolf image loaded!");

  // ✅ Movement controls
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && shepherd.y > 0) shepherd.y -= shepherd.speed;
    if (
      event.key === "ArrowDown" &&
      shepherd.y < canvas.height - shepherd.height
    )
      shepherd.y += shepherd.speed;
    if (event.key === "ArrowLeft" && shepherd.x > 0)
      shepherd.x -= shepherd.speed;
    if (
      event.key === "ArrowRight" &&
      shepherd.x < canvas.width - shepherd.width
    )
      shepherd.x += shepherd.speed;
  });

  // ✅ Spawn sheep
  function spawnSheep() {
    if (Math.random() < 0.02) {
      sheep.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        speed: 2,
      });
    }
  }

  // ✅ Spawn wolves (dangers)
  function spawnDangers() {
    if (Math.random() < 0.01) {
      dangers.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        width: 40,
        height: 40,
        speed: 3,
      });
    }
  }

  // ✅ Update game state
  function update() {
    sheep.forEach((s, index) => {
      s.x -= s.speed;
      if (s.x < -s.width) sheep.splice(index, 1);
    });

    dangers.forEach((d, index) => {
      d.x -= d.speed;
      if (d.x < -d.width) dangers.splice(index, 1);
    });

    // ✅ Shepherd saves sheep
    sheep.forEach((s, index) => {
      if (
        shepherd.x < s.x + s.width &&
        shepherd.x + shepherd.width > s.x &&
        shepherd.y < s.y + s.height &&
        shepherd.y + shepherd.height > s.y
      ) {
        score++;
        document.getElementById("score").innerText = score;
        sheep.splice(index, 1);
      }
    });

    // ✅ Shepherd gets caught by a wolf
    dangers.forEach((d) => {
      if (
        shepherd.x < d.x + d.width &&
        shepherd.x + shepherd.width > d.x &&
        shepherd.y < d.y + d.height &&
        shepherd.y + shepherd.height > d.y
      ) {
        document.getElementById("gameOverMessage").style.display = "block";
        resetGame();
      }
    });
  }

  document
    .getElementById("restartButton")
    .addEventListener("click", function () {
      document.getElementById("gameOverMessage").style.display = "none";
      score = 0;
      document.getElementById("score").innerText = score;
      sheep.length = 0;
      dangers.length = 0;
      shepherd.x = 50;
      shepherd.y = 200;
    });

  // ✅ Draw everything
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Shepherd
    ctx.drawImage(
      shepherdImg,
      shepherd.x,
      shepherd.y,
      shepherd.width,
      shepherd.height
    );

    // Sheep
    sheep.forEach((s) => {
      ctx.drawImage(sheepImg, s.x, s.y, s.width, s.height);
    });

    // Wolves (dangers)
    dangers.forEach((d) => {
      ctx.drawImage(wolfImg, d.x, d.y, d.width, d.height);
    });
  }

  // ✅ Reset game
  function resetGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    sheep.length = 0;
    dangers.length = 0;
    shepherd.x = 50;
    shepherd.y = 130;
  }

  // ✅ Game loop
  function gameLoop() {
    update();
    draw();
    spawnSheep();
    spawnDangers();
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", function (event) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault(); // Stops page scrolling
    }
  });

  // ✅ Start game
  gameLoop();
});
