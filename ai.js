var playerRed = "R";
var playerBrown = "B";
var currPlayer = playerBrown;
var gameOver = false;
var board;
var rows = 6;
var columns = 7;
var currColumns;
var gameMode = "human"; // Default to human vs human
var aiDifficulty = "medium"; // Default difficulty
const dropSound = new Audio('../assets/tile-drop.mp3');

window.onload = function() {
    setupModeSelection();
    setGame();
    playBGM();

    const verticalLabel = document.getElementById("vertical-label");
    if (verticalLabel) {
        verticalLabel.classList.add("show");
    }

    updateTurnDisplay(); // Initialize the turn display
}

function setupModeSelection() {
    let modeDiv = document.createElement("div");
    modeDiv.id = "mode-selection";
    modeDiv.style.textAlign = "center";
    modeDiv.style.marginBottom = "10px";

    let humanBtn = document.createElement("button");
    humanBtn.innerText = "Human vs Human";
    humanBtn.classList.add("human-button");
    humanBtn.addEventListener("click", () => {
        gameMode = "human";
        resetGame();
    });

    let aiBtn = document.createElement("button");
    aiBtn.innerText = "Human vs AI";
    aiBtn.classList.add("ai-button");
    aiBtn.addEventListener("click", () => {
        showDifficultyPopup();
    });

    modeDiv.appendChild(humanBtn);
    modeDiv.appendChild(aiBtn);
    let boardDiv = document.getElementById("board");
    if (boardDiv) {
        boardDiv.parentNode.insertBefore(modeDiv, boardDiv);
    } else {
        console.error("Board element not found, appending mode selection to body...");
        document.body.appendChild(modeDiv);
    }
}

function showDifficultyPopup() {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "difficulty-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";

    // Create title
    const title = document.createElement("h2");
    title.innerText = "Select AI Difficulty";
    title.style.color = "#ffffff";
    title.style.marginBottom = "20px";
    overlay.appendChild(title);

    // Difficulty buttons
    const difficulties = [
        { label: "Easy", value: "easy" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" }
    ];
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "20px";
    difficulties.forEach(diff => {
        const btn = document.createElement("button");
        btn.innerText = diff.label;
        btn.style.background = "linear-gradient(145deg, #00f3ff, #0066ff)";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "25px";
        btn.style.padding = "15px 30px";
        btn.style.fontSize = "1.2rem";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 4px 15px rgba(0, 243, 255, 0.3)";
        btn.style.transition = "all 0.3s ease";
        btn.addEventListener("click", () => {
            aiDifficulty = diff.value;
            document.body.removeChild(overlay);
            gameMode = "ai";
            resetGame();
            if (!gameOver && currPlayer === playerBrown) {
                aiMove();
            }
        });
        btnContainer.appendChild(btn);
    });
    overlay.appendChild(btnContainer);

    // Optionally, add a cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.style.marginTop = "30px";
    cancelBtn.style.background = "#444";
    cancelBtn.style.color = "#fff";
    cancelBtn.style.border = "none";
    cancelBtn.style.borderRadius = "25px";
    cancelBtn.style.padding = "10px 25px";
    cancelBtn.style.fontSize = "1rem";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.addEventListener("click", () => {
        document.body.removeChild(overlay);
    });
    overlay.appendChild(cancelBtn);

    document.body.appendChild(overlay);
}

function resetGame() {
    console.log("Resetting game...");
    let boardDiv = document.getElementById("board");
    if (boardDiv) {
        boardDiv.innerHTML = "";
    } else {
        console.error("Board element not found during reset!");
    }
    document.getElementById("winner").innerText = "";
    gameOver = false;
    // Randomize first player in AI mode
    if (gameMode === "ai") {
        currPlayer = Math.random() < 0.5 ? playerRed : playerBrown;
    } else {
        currPlayer = playerBrown;
    }
    setGame();
    updateTurnDisplay(); // Ensure the turn display is correct after setting up the game
    // If AI goes first, make its move
    if (gameMode === "ai" && currPlayer === playerBrown && !gameOver) {
        aiMove();
    }
}

function setGame() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' ');
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            let boardDiv = document.getElementById("board");
            if (!boardDiv) {
                console.error("Board element not found!");
                return;
            }
            boardDiv.append(tile); 
        }
        board.push(row);
    }
}

function updateTurnDisplay() {
    const winnerElement = document.getElementById("winner");
    if (!winnerElement) {
        console.error("Winner element not found!");
        return;
    }

    if (gameMode === "ai") {
        winnerElement.innerText = currPlayer === playerBrown ? "AI's Turn" : "Your Turn";
    } else {
        winnerElement.innerText = currPlayer === playerBrown ? "Ash's Turn" : "Maroon's Turn";
    }
}

function setPiece() {
    if (gameOver) return;

    dropSound.play();

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];
    if (r < 0) return;

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerBrown;
    } else {
        tile.classList.add("brown-piece");
        currPlayer = playerRed;
    }
    r--;
    currColumns[c] = r;

    checkWinner();

    updateTurnDisplay(); 
    
    if (!gameOver && gameMode === "ai" && currPlayer === playerBrown) {
        setTimeout(() => {
            aiMove();
            updateTurnDisplay(); // Update the turn display after AI move
        }, 500);
    }
}

function aiMove() {
    if (gameOver) return;

    let bestScore = -Infinity;
    let bestCol = -1;
    let depth;
    // Set depth based on difficulty
    if (aiDifficulty === "easy") {
        depth = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    } else if (aiDifficulty === "medium") {
        depth = Math.floor(Math.random() * 2) + 4; // 4 or 5
    } else { // hard
        depth = Math.floor(Math.random() * 2) + 6; // 6 or 7
    }

    // Check for immediate winning move
    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) {
            let r = currColumns[c];
            board[r][c] = playerBrown;
            currColumns[c]--;
            if (checkWinnerForMinimax() === playerBrown) {
                // Take the winning move immediately
                board[r][c] = ' ';
                currColumns[c]++;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                board[r][c] = playerBrown;
                tile.classList.add("brown-piece");
                dropSound.currentTime = 0;
                dropSound.play();
                currColumns[c]--;
                currPlayer = playerRed;
                checkWinner();
                updateTurnDisplay();
                return;
            }
            board[r][c] = ' ';
            currColumns[c]++;
        }
    }

    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) {
            let r = currColumns[c];
            board[r][c] = playerBrown;
            currColumns[c]--;
            let score = minimax(depth - 1, -Infinity, Infinity, false);
            board[r][c] = ' ';
            currColumns[c]++;
            if (score > bestScore) {
                bestScore = score;
                bestCol = c;
            }
        }
    }

    if (bestCol !== -1) {
        let r = currColumns[bestCol];
        board[r][bestCol] = playerBrown;
        let tile = document.getElementById(r.toString() + "-" + bestCol.toString());
        tile.classList.add("brown-piece");
        dropSound.currentTime = 0;
        dropSound.play();
        currColumns[bestCol]--;
        currPlayer = playerRed;
        checkWinner();
        updateTurnDisplay(); // Ensure turn display is updated after AI move
    }
}

function minimax(depth, alpha, beta, isMaximizing) {
    let result = checkWinnerForMinimax();
    if (result !== null) {
        if (result === playerBrown) return 1000;
        if (result === playerRed) return -1000;
        return 0; // Draw
    }
    if (depth === 0) {
        return evaluateBoard();
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let c = 0; c < columns; c++) {
            if (currColumns[c] >= 0) {
                let r = currColumns[c];
                board[r][c] = playerBrown;
                currColumns[c]--;
                let eval = minimax(depth - 1, alpha, beta, false);
                board[r][c] = ' ';
                currColumns[c]++;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let c = 0; c < columns; c++) {
            if (currColumns[c] >= 0) {
                let r = currColumns[c];
                board[r][c] = playerRed;
                currColumns[c]--;
                let eval = minimax(depth - 1, alpha, beta, true);
                board[r][c] = ' ';
                currColumns[c]++;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
}

function evaluateBoard() {
    let score = 0;

    function evaluateWindow(window) {
        let brownCount = window.filter(cell => cell === playerBrown).length;
        let redCount = window.filter(cell => cell === playerRed).length;
        let emptyCount = window.filter(cell => cell === ' ').length;

        if (brownCount === 4) return 100;
        if (brownCount === 3 && emptyCount === 1) return 50;
        if (brownCount === 2 && emptyCount === 2) return 10;
        if (redCount === 4) return -100;
        if (redCount === 3 && emptyCount === 1) return -80;
        return 0;
    }

    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let window = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]];
            score += evaluateWindow(window);
        }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let window = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
            score += evaluateWindow(window);
        }
    }

    // Diagonal
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
            score += evaluateWindow(window);
        }
    }

    // Anti-diagonal 
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let window = [board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]];
            score += evaluateWindow(window);
        }
    }

    return score;
}

function checkWinner() {
   
    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Diagonal (bottom-left to top-right)
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Anti-diagonal (top-left to bottom-right)
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Check for draw
    if (currColumns.every(col => col < 0)) {
        setWinner(0, 0);
    }
}

function checkWinnerForMinimax() {
    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    return board[r][c];
                }
            }
        }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    return board[r][c];
                }
            }
        }
    }

    // Diagonal
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    return board[r][c];
                }
            }
        }
    }

    // Anti-diagonal
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    return board[r][c];
                }
            }
        }
    }

    // Draw
    if (currColumns.every(col => col < 0)) {
        return 'draw';
    }

    return null;
}

function setWinner(r, c) {
    let winnerText = "";

    // Check for draw condition
    if (currColumns.every(col => col < 0)) {
        winnerText = "It's a Draw!";
    } else if (gameMode === "ai" && board[r][c] == playerBrown) {
        winnerText = "AI Wins!";
    } else if (board[r][c] == playerRed) {
        winnerText = "Maroon Wins!";
    } else if (board[r][c] == playerBrown) {
        winnerText = "Ash Wins!";
    }

    gameOver = true;

    // Pause background music if playing
    if (typeof bgmAudio !== 'undefined') {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }

    // Play game-over sound
    const gameOverSound = new Audio("../assets/game-over.mp3");
    gameOverSound.play();

    // Show game-over pop-up
    showGameOverPopup(winnerText);
}

// Function to display the game-over pop-up
function showGameOverPopup(winnerText) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "game-over-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";

    // Create game-over text
    const gameOverText = document.createElement("h1");
    gameOverText.innerText = "Game Over!";
    gameOverText.style.color = "#ffffff";
    gameOverText.style.fontSize = "3rem";
    gameOverText.style.marginBottom = "20px";

    // Create winner text
    const winnerMessage = document.createElement("p");
    winnerMessage.innerText = winnerText;
    winnerMessage.style.color = "#ffcc00";
    winnerMessage.style.fontSize = "1.5rem";
    winnerMessage.style.marginBottom = "30px";

    // Create play-again button
    const playAgainButton = document.createElement("button");
    playAgainButton.innerHTML = `<i class="fas fa-redo"></i> Play Again`;
    playAgainButton.style.background = "linear-gradient(145deg, #00f3ff, #0066ff)";
    playAgainButton.style.color = "#ffffff";
    playAgainButton.style.border = "none";
    playAgainButton.style.borderRadius = "25px";
    playAgainButton.style.padding = "15px 30px";
    playAgainButton.style.fontSize = "1.2rem";
    playAgainButton.style.cursor = "pointer";
    playAgainButton.style.boxShadow = "0 4px 15px rgba(0, 243, 255, 0.3)";
    playAgainButton.style.transition = "all 0.3s ease";

    playAgainButton.addEventListener("click", () => {
        window.location.reload();
    });

    // Append elements to overlay
    overlay.appendChild(gameOverText);
    overlay.appendChild(winnerMessage);
    overlay.appendChild(playAgainButton);

    // Append overlay to body
    document.body.appendChild(overlay);
}
