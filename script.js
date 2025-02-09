const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "cyan", "magenta", "lime", "teal", "indigo", "gold", "silver", "navy", "maroon", "olive", "turquoise"]; 
let targetColor = "";
let score = 0;
let timeLeft = 30;
let gameOver = false;
let timer;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let playerName = "";

function savePlayerName() {
    playerName = document.getElementById("playerName").value.trim();
    if (playerName) {
        document.getElementById("playerInput").classList.add("hidden");
        document.getElementById("gameContainer").classList.remove("hidden");
        startNewGame();
    } else {
        alert("Please enter your name to start the game.");
    }
}

function shuffleColors() {
    return colors.sort(() => Math.random() - 0.5).slice(0, 6);
}

function pickNewTargetColor(shuffledColors) {
    targetColor = shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
    document.getElementById("colorBox").style.backgroundColor = targetColor;
}

function handleGuess(color, button) {
    if (gameOver) return;
    document.querySelectorAll(".color-button").forEach(btn => btn.classList.remove("correct", "wrong"));
    
    if (color === targetColor) {
        document.getElementById("message").textContent = "Correct! 🎉";
        document.getElementById("message").setAttribute("data-testid", "gameStatus");
        button.classList.add("correct");
        score++;
    } else {
        document.getElementById("message").textContent = "Wrong! Try again.";
        document.getElementById("message").setAttribute("data-testid", "gameStatus");
        button.classList.add("wrong");
        score = Math.max(0, score - 1);
    }
    
    document.getElementById("score").textContent = score;
    setTimeout(startRound, 500);
}

function startRound() {
    const shuffledColors = shuffleColors();
    pickNewTargetColor(shuffledColors);
    
    const buttonContainer = document.getElementById("colorButtons");
    buttonContainer.innerHTML = "";
    
    shuffledColors.forEach(color => {
        const button = document.createElement("button");
        button.classList.add("color-button");
        button.style.backgroundColor = color;
        button.setAttribute("data-testid", "colorOption");
        button.onclick = () => handleGuess(color, button);
        buttonContainer.appendChild(button);
    });
}

function startNewGame() {
    clearInterval(timer);
    if (score > 0) {
        highScores.push({ name: playerName, score: score });
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }
    
    gameOver = false;
    score = 0;
    timeLeft = 30;
    document.getElementById("message").textContent = "Guess the correct color!";
    document.getElementById("score").textContent = score;
    document.getElementById("time").textContent = timeLeft;
    
    timer = setInterval(() => {
        if (timeLeft <= 1) {
            clearInterval(timer);
            gameOver = true;
            document.getElementById("message").textContent = `Game Over! Final Score: ${score}`;
        }
        document.getElementById("time").textContent = --timeLeft;
    }, 1000);
    
    startRound();
}

function showHighScores() {
    const highScoresList = document.getElementById("highScores");
    highScoresList.innerHTML = "";
    highScores.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}`;
        highScoresList.appendChild(li);
    });
}
