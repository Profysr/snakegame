const board = document.querySelector("#game-board"),
  instructions = document.querySelector("#instruction-text"),
  logo = document.querySelector("#logo"),
  scoreContent = document.querySelector("#score"),
  highScoreContent = document.querySelector("#highScore");

// Define Game Variable
let gridSize = 20;
let direction = "left";
let gameSpeedDelay = 200;
let gameInterval;
let gameStarted = false;
let score = 0;
let highScore = 0;

// Define Positions
let snake = [{ x: 10, y: 10 }];
let food = generateFood();

// draw game map, snake, food
function draw() {
  board.innerHTML = "";
  if (gameStarted) {
    drawSnake();
    drawFood();
  }
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(elem, position) {
  elem.style.gridColumn = position.x;
  elem.style.gridRow = position.y;
}

function generateFood() {
  const x = Math.ceil(Math.random() * gridSize);
  const y = Math.ceil(Math.random() * gridSize);
  return { x, y };
}

// Testing
// draw();

function move() {
  let temp = { ...snake[0] };
  // Reference karne se jo bhi change hum karein ge wo snake variable mei bhi show hoga
  //   let temp1 = snake[0];
  //   console.log(temp1.x++);
  //   console.log(snake[0].x);

  switch (direction) {
    case "up":
      temp.y--;
      break;
    case "down":
      temp.y++;
      break;
    case "left":
      temp.x--;
      break;
    case "right":
      temp.x++;
      break;
  }

  snake.unshift(temp);

  if (temp.x === food.x && temp.y === food.y) {
    food = generateFood();
    increaseSpeed();
    updateScore();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Testing the Move
// gameInterval = setInterval(() => {
//   move();
//   draw();
// }, gameSpeedDelay);

function startGame() {
  gameStarted = true;
  instructions.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress Events Handling
function handleKeyPress(ev) {
  if (
    (!gameStarted && ev.code === "Space") ||
    (!gameStarted && ev.key === " ")
  ) {
    startGame();
  } else {
    switch (ev.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  //   console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructions.style.display = "block";
  logo.style.display = "block";
}

function updateScore() {
  score = snake.length - 1;
  scoreContent.textContent = score.toString().padStart(3, "0");
}

function updateHighScore() {
  score = snake.length - 1;
  if (score > highScore) {
    highScore = score;
    highScoreContent.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreContent.style.display = "block";
}
