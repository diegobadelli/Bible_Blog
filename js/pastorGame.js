document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("pastorGameCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size dynamically
  canvas.width = 950;
  canvas.height = 400;

  // Game settings
  const shepherd = { x: 50, y: 200, width: 40, height: 40, speed: 5 };
  const sheep = [];
  const dangers = [];
  const obstacles = [];
  const powerUps = [];
  let score = 0;
  let gameRunning = true;
  let difficulty = 1;

  // Load images
  const shepherdImg = new Image();
  shepherdImg.src = "assets/images/pastor.webp";

  const sheepImg = new Image();
  sheepImg.src = "assets/images/ovelha.webp";

  const wolfImg = new Image();
  wolfImg.src = "assets/images/lobo.webp";

  const rockImg = new Image();
  rockImg.src = "assets/images/rock.webp"; // New obstacle

  const powerUpImg = new Image();
  powerUpImg.src = "assets/images/powerup.webp"; // Speed boost

  // Handle keyboard movement
  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  document.addEventListener("keydown", (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = true;
      event.preventDefault(); // Prevent scrolling on arrow key press
    }
  });

  document.addEventListener("keyup", (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = false;
    }
  });

  // Handle touch movements for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }
    event.preventDefault();
  });

  canvas.addEventListener("touchmove", (event) => {
    if (event.touches.length === 1) {
      let touchX = event.touches[0].clientX;
      let touchY = event.touches[0].clientY;

      let deltaX = touchX - touchStartX;
      let deltaY = touchY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) shepherd.x += shepherd.speed;
        else shepherd.x -= shepherd.speed;
      } else {
        if (deltaY > 0) shepherd.y += shepherd.speed;
        else shepherd.y -= shepherd.speed;
      }

      touchStartX = touchX;
      touchStartY = touchY;
    }
    event.preventDefault();
  });

  // Spawn sheep
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

  function spawnDangers() {
    if (Math.random() < 0.005) {
      dangers.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        width: 35,
        height: 35,
        speed: 3,
      });
    }
  }

  function spawnObstacles() {
    if (Math.random() < 0.002) {
      obstacles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: 30,
        height: 30,
        img: rockImg,
        speed: 2,
      });
    }
  }

  function spawnPowerUps() {
    if (Math.random() < 0.005) {
      powerUps.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        width: 30,
        height: 30,
        speed: 2,
        active: true,
      });
    }
  }

  // Update game objects
  function update() {
    if (!gameRunning) return;

    if (keys.ArrowUp && shepherd.y > 0) shepherd.y -= shepherd.speed;
    if (keys.ArrowDown && shepherd.y < canvas.height - shepherd.height)
      shepherd.y += shepherd.speed;
    if (keys.ArrowLeft && shepherd.x > 0) shepherd.x -= shepherd.speed;
    if (keys.ArrowRight && shepherd.x < canvas.width - shepherd.width)
      shepherd.x += shepherd.speed;

    sheep.forEach((s, index) => {
      s.x -= s.speed;
      if (s.x < 0) sheep.splice(index, 1);
    });
    dangers.forEach((d, index) => {
      d.x -= d.speed;
      if (d.x < 0) dangers.splice(index, 1);
    });
    obstacles.forEach((o, index) => {
      o.x -= o.speed;
      if (o.x < 0) obstacles.splice(index, 1);
    });
    powerUps.forEach((p, index) => {
      p.x -= p.speed;
      if (p.x < 0) powerUps.splice(index, 1);
    });

    sheep.forEach((s, index) => {
      if (checkCollision(shepherd, s)) {
        score++;
        document.getElementById("score").innerText = score;
        sheep.splice(index, 1);
      }
    });

    dangers.forEach((d) => {
      if (checkCollision(shepherd, d)) {
        gameOver();
      }
    });

    obstacles.forEach((o) => {
      if (checkCollision(shepherd, o)) {
        gameOver();
      }
    });

    powerUps.forEach((p, index) => {
      if (checkCollision(shepherd, p) && p.active) {
        shepherd.speed += 2;
        setTimeout(() => {
          shepherd.speed -= 2;
        }, 5000);
        p.active = false;
        powerUps.splice(index, 1);
      }
    });
  }

  // Draw elements on canvas
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      shepherdImg,
      shepherd.x,
      shepherd.y,
      shepherd.width,
      shepherd.height
    );
    sheep.forEach((s) => ctx.drawImage(sheepImg, s.x, s.y, s.width, s.height));
    dangers.forEach((d) => ctx.drawImage(wolfImg, d.x, d.y, d.width, d.height));
    obstacles.forEach((o) => ctx.drawImage(o.img, o.x, o.y, o.width, o.height));
    powerUps.forEach((p) =>
      ctx.drawImage(powerUpImg, p.x, p.y, p.width, p.height)
    );
  }

  function checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function gameOver() {
    gameRunning = false;
    document.getElementById("gameOverMessage").style.display = "flex";
  }

  function gameLoop() {
    update();
    draw();
    spawnSheep();
    spawnDangers();
    spawnObstacles();
    spawnPowerUps();
    if (gameRunning) requestAnimationFrame(gameLoop);
  }

  document
    .getElementById("restartButton")
    .addEventListener("click", function () {
      document.getElementById("gameOverMessage").style.display = "none";
      score = 0;
      document.getElementById("score").innerText = score;
      sheep.length = 0;
      dangers.length = 0;
      obstacles.length = 0;
      powerUps.length = 0;
      shepherd.x = 50;
      shepherd.y = 200;
      gameRunning = true;
      gameLoop();
    });

  // Prevent scrolling while swiping
  document.addEventListener(
    "touchmove",
    function (event) {
      event.preventDefault();
    },
    { passive: false }
  );

  gameLoop();
});
