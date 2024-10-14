const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ball = {
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 50,
  dx: 2,
  dy: -2,
};

const paddle = {
  height: 10,
  width: 75,
  x: (canvas.width - 75) / 2,
};

let keys = { right: false, left: false };
const bricks = [];
const brickConfig = {
  rowCount: 3,
  columnCount: 5,
  width: 150,
  height: 20,
  padding: 10,
  offsetTop: 30,
  offsetLeft: 30,
};

let bricksHit = 0;
let isGameOver = false;

for (let c = 0; c < brickConfig.columnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickConfig.rowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowLeft") keys.left = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowLeft") keys.left = false;
});

function collisionDetection() {
  for (let c = 0; c < brickConfig.columnCount; c++) {
    for (let r = 0; r < brickConfig.rowCount; r++) {
      const b = bricks[c][r];
      if (
        b.status === 1 &&
        ball.x > b.x &&
        ball.x < b.x + brickConfig.width &&
        ball.y > b.y &&
        ball.y < b.y + brickConfig.height
      ) {
        ball.dy = -ball.dy;
        b.status = 0;
        bricksHit++;

        if (bricksHit % 2 === 0) {
          ball.dx *= 1.1;
          ball.dy *= 1.1;
        }

        if (
          bricks.every((column) => column.every((brick) => brick.status === 0))
        ) {
          alert("That was great! Amazing");
          document.location.reload();
        }
      }
    }
  }
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawRect(x, y, width, height, color) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickConfig.columnCount; c++) {
    for (let r = 0; r < brickConfig.rowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX =
          c * (brickConfig.width + brickConfig.padding) +
          brickConfig.offsetLeft;
        const brickY =
          r * (brickConfig.height + brickConfig.padding) +
          brickConfig.offsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        drawRect(
          brickX,
          brickY,
          brickConfig.width,
          brickConfig.height,
          "#0095DD"
        );
      }
    }
  }
}

function draw() {
  if (!isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawCircle(ball.x, ball.y, ball.radius, "#0095DD");
    drawRect(
      paddle.x,
      canvas.height - paddle.height - 20,
      paddle.width,
      paddle.height,
      "#0095DD"
    );
    collisionDetection();

    if (
      ball.x + ball.dx > canvas.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    }

    const paddleTop = canvas.height - paddle.height - 20;
    if (ball.y + ball.dy > paddleTop - ball.radius && ball.y < paddleTop) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
        ball.y = paddleTop - ball.radius;
      }
    }

    if (ball.y + ball.dy > canvas.height - ball.radius) {
      isGameOver = true;
      alert("You fail...try again!");
      document.location.reload();
    }

    if (keys.right && paddle.x < canvas.width - paddle.width) {
      paddle.x += 7;
    } else if (keys.left && paddle.x > 0) {
      paddle.x -= 7;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
    requestAnimationFrame(draw);
  }
}

document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";
  draw();
});
