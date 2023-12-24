// Define HTML elements 
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore"); 

// Define game variables 
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood(); 
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false; 

// Draw game map, snake, food 
function draw() {
    // rest board every time 
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore(); 
}

// Draw snake 
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement("div", "snake"); // creation of the snake 
        setPosition(snakeElement, segment); // putting the snake on the page 
        board.appendChild(snakeElement);
    })
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element; 
}

// Set the position of snake or food 
function setPosition(element, position) {
    element.style.gridColumn = position.x; 
    element.style.gridRow = position.y; 
}

// Draw food function (appear on page)
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement("div", "food");
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// getting Food coordinates
function foodCoordinates() {
    const x = Math.floor(Math.random() * gridSize) + 1; // + 1 becaused grid starts at 1
    const y = Math.floor(Math.random() * gridSize) + 1; // + 1 becaused grid starts at 1
    return {x,y};
}

// Generate food (only creation, does not appear on page)
function generateFood() {
    while(true) {
        const newCoord = foodCoordinates();
        if (!snake.some(segment => segment.x === newCoord.x && segment.y === newCoord.y)) {
            return newCoord;
        } 
    }
}

// Moving the snake 
function move() {
    const head = {...snake[0]}; // use position but don't alter the original position
    switch (direction) {
        case "right":
            head.x++;
            break;
        case "left":
            head.x--;
            break;
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
    } 

    snake.unshift(head); // putting the new coordinates at the start of the snake dictionary 

    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); 
        increaseSpeed(); 
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop(); // no growth observed 
    }
}

function startGame() {
    gameStarted = true; // Keep track of a running game 
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval (() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

// Create key press event listener 
// .code and .key are inbuilt 
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === "Space") || 
        (!gameStarted && event.key === " ")
    ) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp": 
                direction = direction  === "down" ? direction : "up";
                break;
            case "ArrowDown": 
                direction = direction  === "up" ? direction : "down";
                break;
            case "ArrowRight": 
                direction = direction  === "left" ? direction : "right";
                break;
            case "ArrowLeft": 
                direction = direction === "right" ? direction : "left";
                break;
        }
    }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
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

    // head going beyond 
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame(); 
    }

    // collision with own body 
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}]
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0")
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, "0");
    } 
    highScoreText.style.display = "block"
}
