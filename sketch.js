const canvas = {
  background: "#264653",
  height: 500,
  width: 900,
};

let fruit = null;
let speed = 20;
let start = null;
let gameIsOver = false;

const setFruitPosition = () => {
  const x = Math.floor((Math.random() * canvas.width - 10) / 10) * 10;
  const y = Math.floor((Math.random() * canvas.height - 10) / 10) * 10;
  fruit = {
    x: x < 10 ? 10 : x,
    y: y < 10 ? 10 : y,
  };
};

let snake = Array.from(Array(10)).map((_, i) => ({
  x: 250 + 10,
  y: 250,
}));

const Directions = {
  Up: {
    keyCode: 40,
    axis: "y",
    move: 10,
  },
  Down: {
    keyCode: 38,
    axis: "y",
    move: -10,
  },
  Left: {
    keyCode: 37,
    axis: "x",
    move: -10,
  },
  Right: {
    keyCode: 39,
    axis: "x",
    move: 10,
  },
};

let Direction = Directions.Right;

const gameOver = () => {
  const highScore = localStorage.getItem("high-score");
  const score = snake.length - 10;
  if (score > highScore) {
    localStorage.setItem("high-score", score);
  }
  snake = [];

  strokeWeight(2);
  rect(250, 150, 400, 250, 20);
  strokeWeight(0);
  textSize(35);
  text("GAME OVER!", 350, 200);
  textSize(12);
  text(`Score = ${score}`, 350, 225);
  textSize(12);
  text(`High Score = ${localStorage.getItem("high-score")}`, 350, 245);
  gameIsOver = true;
  noLoop();
};

const handleFruitCollision = () => {
  const head = snake[0];
  if (head.x === fruit.x && head.y === fruit.y) {
    setFruitPosition();
    snake.push({ ...snake[snake.length - 1] });
    speed += 0.5;
  }
};

const handleWallCollision = () => {
  const head = snake[0];
  if (
    head.x === 0 ||
    head.x === canvas.width ||
    head.y === 0 ||
    head.y === canvas.height
  ) {
    gameOver();
  }
};

const handleBodyCollision = () => {
  const head = snake[0];
  const matchingCoords = snake
    .slice(1)
    .filter(({ x, y }) => x === head.x && y === head.y);
  if (!!matchingCoords.length) {
    gameOver();
  }
};

function setup() {
  const { height, width } = canvas;
  createCanvas(width, height);
  frameRate(speed);

  strokeWeight(10);
  setFruitPosition();

  start = createDiv("Press an arrow key to begin");
  start.class("start-message");
  start.position(0, 0);
  start.size(canvas.width, canvas.height);
  noLoop();
}

function draw() {
  background(canvas.background);
  stroke("#f1faee");
  circle(fruit.x, fruit.y, 1);
  frameRate(speed);

  snake = snake.map(({ x, y }, i) => {
    if (i === 0) {
      const newX = Direction.axis === "x" ? x + Direction.move : x;
      const newy = Direction.axis === "y" ? y + Direction.move : y;
      stroke("#e76f51");
      line(newX, newy, newX, newy);
      return { x: newX, y: newy };
    }
    stroke("#f4a261");
    const { x: newX, y: newY } = snake[i - 1];
    line(newX, newY, newX, newY);
    return { x: newX, y: newY };
  });

  handleFruitCollision();
  handleWallCollision();
  handleBodyCollision();
}

function keyPressed() {
  for (let x in Directions) {
    const direction = Directions[x];
    if (direction.keyCode === keyCode) {
      start.remove();
      Direction = direction;

      if (gameIsOver) {
        gameIsOver = false;
        speed = 20;
        strokeWeight(10);
        snake = Array.from(Array(10)).map((_, i) => ({
          x: 250 + 10,
          y: 250,
        }));
        setFruitPosition();
      }
      loop();
    }
  }
}
