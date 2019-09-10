var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 7;
var ballSpeedY = 7;
var paddle1Y = 250;
var paddle2Y = 250;
var humanScore = document.getElementById("humanscore");
var humScore = 0;
var humanScore = document.getElementById("compscore");
var comScore = 0;
var reset = document.getElementById("reset");
var winScreen = false;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 120;
const WIN_SCORE = 10;

reset.addEventListener("click", function() {
  ballReset();
  humScore = 0;
  humanscore.textContent = humScore;
  comScore = 0;
  compscore.textContent = comScore;
});

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  var fps = 60;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000 / fps);
  canvas.addEventListener("mousemove", function(evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (humScore >= WIN_SCORE || comScore >= WIN_SCORE) {
    humScore = 0;
    comScore = 0;
    humanscore.textContent = humScore;
    compscore.textContent = comScore;
    winScreen = true;
    endClick();
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

//function reset() {
//  humscore = 0;
//  comscore = 0;
//  humanscore.textContent = humScore;
//  compscore.textContent = comScore;
//}

function drawEverything() {
  if (winScreen) {
    if ((humScore = WIN_SCORE)) {
      canvasContext.fillText("You Won!", 350, 300);
    } else if ((comScore = WIN_SCORE)) {
      canvasContext.fillText("The Computer Won!", 350, 300);
    }
    canvasContext.fillText("Click to Continue", 350, 500);
    return;
  }
  colorRect(0, 0, canvas.width, canvas.height, "#222");
  drawNet();
  //left Paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "#0095dd");
  //right ComputerPaddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "#0095dd"
  );
  //ball
  colorCircle(ballX, ballY, 10, "steelblue");
  canvasContext.fillText("", 100, 100);
}

function compMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY + 30) {
    paddle2Y += 7;
  } else if (paddle2YCenter > ballY - 30) {
    paddle2Y -= 7;
  }
}

function moveEverything() {
  if (winScreen) {
    return;
  }
  compMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.3;
    } else {
      humScore++;
      humanscore.textContent = humScore;
      ballReset();
    }
  }
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.3;
    } else {
      comScore++;
      compscore.textContent = comScore;
      ballReset();
    }
  }
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function drawNet() {
  for (var i = 10; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "RGB(16, 169, 77)");
  }
}

function endClick(evt) {
  if (winScreen) {
    humScore = 0;
    comScore = 0;
    winScreen = false;
  }
}