const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = 20;
let snake1 = [{ x: 10, y: 10 }];
let snake2 = [{ x: 5, y: 5 }];
let food = { x: 15, y: 15 };
let specialFood = null;
let dx1 = 0, dy1 = 0;
let dx2 = 0, dy2 = 0;
let score1 = 0, score2 = 0;
let highScore = localStorage.getItem('highScore') || 0;
let snakeColor1 = 'lime';
let snakeColor2 = 'blue';
let isSinglePlayer = true;
let gameOver = false;
let playerName = '';

document.getElementById('highScore').innerText = highScore;

document.getElementById('snakeColor1').addEventListener('change', (event) => {
    snakeColor1 = event.target.value;
});

document.getElementById('snakeColor2').addEventListener('change', (event) => {
    snakeColor2 = event.target.value;
});

document.getElementById('singlePlayerBtn').addEventListener('click', () => {
    playerName = document.getElementById('playerName').value;
    if (playerName) {
        isSinglePlayer = true;
        startGame();
    } else {
        alert('Kérlek, add meg a neved!');
    }
});

document.getElementById('multiPlayerBtn').addEventListener('click', () => {
    playerName = document.getElementById('playerName').value;
    if (playerName) {
        isSinglePlayer = false;
        startGame();
    } else {
        alert('Kérlek, add meg a neved!');
    }
});

document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
    startGame();
});

document.getElementById('backToMenuBtn').addEventListener('click', () => {
    showMenu();
});

document.getElementById('backToMenuBtnGameOver').addEventListener('click', () => {
    showMenu();
});

document.getElementById('adminBtn').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const password = document.getElementById('adminPassword').value;
    if (password === 'asd123') {
        document.getElementById('resetScoresBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('adminPassword').style.display = 'none';
    } else {
        alert('Hibás jelszó!');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('resetScoresBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('adminPassword').style.display = 'block';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
});

document.getElementById('resetScoresBtn').addEventListener('click', () => {
    localStorage.removeItem('scores');
    loadScores();
    alert('Pontszámok törölve!');
});

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('scoreBoard').style.display = 'flex';
    document.getElementById('skinSelector').style.display = 'flex';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    if (!isSinglePlayer) {
        document.getElementById('player2Score').style.display = 'block';
        document.getElementById('player2ColorLabel').style.display = 'block';
        document.getElementById('snakeColor2').style.display = 'block';
        document.getElementById('multiPlayerControls').style.display = 'block';
        document.getElementById('singlePlayerControls').style.display = 'none';
    } else {
        document.getElementById('player2Score').style.display = 'none';
        document.getElementById('player2ColorLabel').style.display = 'none';
        document.getElementById('snakeColor2').style.display = 'none';
        document.getElementById('singlePlayerControls').style.display = 'block';
        document.getElementById('multiPlayerControls').style.display = 'none';
    }
    canvas.width = canvas.height = gridSize * tileCount;
    gameOver = false;
    resetGame();
    drawGame();
}

function resetGame() {
    snake1 = [{ x: 10, y: 10 }];
    snake2 = [{ x: 5, y: 5 }];
    food = { x: 15, y: 15 };
    specialFood = null;
    dx1 = 0;
    dy1 = 0;
    dx2 = 0;
    dy2 = 0;
    score1 = 0;
    score2 = 0;
    document.getElementById('score1').innerText = score1;
    document.getElementById('score2').innerText = score2;
}

function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('scoreBoard').style.display = 'none';
    document.getElementById('skinSelector').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('singlePlayerControls').style.display = 'none';
    document.getElementById('multiPlayerControls').style.display = 'none';
    resetGame();
    loadScores();
}

function drawGame() {
    if (gameOver) return;
    updateSnake(snake1, dx1, dy1, 'score1');
    if (!isSinglePlayer) {
        updateSnake(snake2, dx2, dy2, 'score2');
    }
    if (checkCollision(snake1) || (!isSinglePlayer && checkCollision(snake2))) {
        endGame();
        return;
    }
    clearCanvas();
    drawFood();
    drawSpecialFood();
    drawSnake(snake1, snakeColor1);
    if (!isSinglePlayer) {
        drawSnake(snake2, snakeColor2);
    }
    setTimeout(drawGame, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(snake, color) {
    ctx.fillStyle = color;
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function updateSnake(snake, dx, dy, scoreId) {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        if (scoreId === 'score1') {
            score1++;
            document.getElementById('score1').innerText = score1;
        } else {
            score2++;
            document.getElementById('score2').innerText = score2;
        }
        placeFood();
        updateHighScore();
    } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        if (scoreId === 'score1') {
            score1 += 5;
            document.getElementById('score1').innerText = score1;
        } else {
            score2 += 5;
            document.getElementById('score2').innerText = score2;
        }
        specialFood = null;
        updateHighScore();
    } else {
        snake.pop();
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawSpecialFood() {
    if (specialFood) {
        ctx.fillStyle = 'gold';
        ctx.fillRect(specialFood.x * gridSize, specialFood.y * gridSize, gridSize, gridSize);
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    if (Math.random() < 0.1) { // 10% esély a speciális étel megjelenésére
        specialFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}
function checkCollision(snake) {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }
    return false;
}

function updateHighScore() {
    const currentHighScore = Math.max(score1, score2);
    if (currentHighScore > highScore) {
        highScore = currentHighScore;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }
}

function endGame() {
    gameOver = true;
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('skinSelector').style.display = 'none';
    document.getElementById('backToMenuBtn').style.display = 'none'; // Eltünteti a menü gombot
    document.getElementById('singlePlayerControls').style.display = 'none';
    document.getElementById('multiPlayerControls').style.display = 'none';
    saveScore(playerName, score1);
}

function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    const existingScore = scores.find(s => s.name === name);
    if (existingScore) {
        if (score > existingScore.score) {
            existingScore.score = score;
        }
    } else {
        scores.push({ name, score });
    }
    localStorage.setItem('scores', JSON.stringify(scores));
    loadScores();
}

function loadScores() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    const scoreTableBody = document.querySelector('#scoreTable tbody');
    scoreTableBody.innerHTML = '';
    scores.forEach(score => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        nameCell.textContent = score.name;
        scoreCell.textContent = score.score;
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        scoreTableBody.appendChild(row);
    });
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy1 === 0) { dx1 = 0; dy1 = -1; }
            break;
        case 'ArrowDown':
            if (dy1 === 0) { dx1 = 0; dy1 = 1; }
            break;
        case 'ArrowLeft':
            if (dx1 === 0) { dx1 = -1; dy1 = 0; }
            break;
        case 'ArrowRight':
            if (dx1 === 0) { dx1 = 1; dy1 = 0; }
            break;
        case 'w':
            if (dy2 === 0) { dx2 = 0; dy2 = -1; }
            break;
        case 's':
            if (dy2 === 0) { dx2 = 0; dy2 = 1; }
            break;
        case 'a':
            if (dx2 === 0) { dx2 = -1; dy2 = 0; }
            break;
        case 'd':
            if (dx2 === 0) { dx2 = 1; dy2 = 0; }
            break;
    }
});

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            if (dx1 === 0) { dx1 = -1; dy1 = 0; }
        } else {
            if (dx1 === 0) { dx1 = 1; dy1 = 0; }
        }
    } else {
        if (yDiff > 0) {
            if (dy1 === 0) { dx1 = 0; dy1 = -1; }
        } else {
            if (dy1 === 0) { dx1 = 0; dy1 = 1; }
        }
    }

    xDown = null;
    yDown = null;
}

canvas.width = canvas.height = gridSize * tileCount;
loadScores();