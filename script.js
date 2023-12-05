class Player {
    #score = 0;
    #tileType = "X";
    constructor(tileType) {
        this.#tileType = tileType;
    }

    getScore() {
        return this.#score;
    }

    getTileType() {
        return this.#tileType;
    }

    incrementScore() {
        this.#score++;
    }

    resetScore() {
        this.#score = 0;
    }
}

const player = (tileType) => {
    let score = 0;
    const getScore = () => score;
    const incrementScore = () => score++;
    const getTileType = () => tileType;
    const resetScore = () => score = 0;
    return {getScore, incrementScore, getTileType, resetScore};
}

const gameBoard = (function() {
    let gameBoard = [["", "", ""],
                     ["", "", ""],
                     ["", "", ""]];

    const getBoard = () => gameBoard;

    const printBoard = () => {
        let rowText = "["
        for(let i = 0; i < gameBoard.length; i++) {
            for(let o = 0; o < gameBoard[i].length; o++) {
                if (!gameBoard[i][o]) {
                    rowText += " ,";
                    continue;
                }
                rowText += gameBoard[i][o] + ",";
            }
            console.log(rowText + "]");
            rowText = "[";
        }
    }

    const placeTile = (player, x, y) => {
        gameBoard[x][y] = `${player.getTileType()}`;
        //printBoard();
    };

    const resetBoard = () => {
        gameBoard = [["", "", ""],
                    ["", "", ""],
                    ["", "", ""]];
    };

    return {getBoard, placeTile, printBoard, resetBoard}
})();

const gameController = (function() {

    const player1 = new Player("X");
    const player2 = new Player("O");

    let activePlayer = player1;
    let ties = 0;
    let gameOver = {
        over: false,
        winner: "none",
        winningTiles: [],
    }

    const getActivePlayer = () => activePlayer;
    const getTies = () => ties;
    const getGameOver = () => gameOver;
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const checkGameOver = (board, x, y, player) => {
        // A win can only happen at the current move so check the current row, col
        // and diagonal (both ways) for the a win
        let tileType = player.getTileType();
        let rowsNeededToWin = {count: 0, tiles: []};
        let colsNeededToWin = {count: 0, tiles: []};
        let diagsNeededToWin = {count: 0, tiles: []};
        let reverseDiagsNeededToWin = {count: 0, tiles: []};
        let boardLength = board.length;
        for (let i = 0; i < boardLength; i++) {
            if (board[x][i] == tileType) {
                rowsNeededToWin.count++;
                rowsNeededToWin.tiles.push([x, i]);
            }
            if (board[i][y] == tileType) {
                colsNeededToWin.count++;
                colsNeededToWin.tiles.push([i, y]);
            } 
            if (board[i][i] == tileType) {
                diagsNeededToWin.count++;
                diagsNeededToWin.tiles.push([i, i]);
            }
            if (board[i][boardLength - 1 - i] == tileType) {
                reverseDiagsNeededToWin.count++;
                reverseDiagsNeededToWin.tiles.push([i, boardLength - 1 - i]);
            }
        }
        switch(boardLength) {
            case rowsNeededToWin.count:
                player.incrementScore();
                return {over: true, winner: player, winningTiles: rowsNeededToWin.tiles};

            case colsNeededToWin.count:
                player.incrementScore();
                return {over: true, winner: player, winningTiles: colsNeededToWin.tiles};

            case diagsNeededToWin.count:
                player.incrementScore();
                return {over: true, winner: player, winningTiles: diagsNeededToWin.tiles};

            case reverseDiagsNeededToWin.count:
                player.incrementScore();
                return {over: true, winner: player, winningTiles: reverseDiagsNeededToWin.tiles};
        }
        // If no player has won, but all 9 tiles are filled, it's a tie
        let filledTiles = 0
        for (let i = 0; i < boardLength; i++) {
            for (let o = 0; o < boardLength; o++) {
                if (board[i][o]) {
                    filledTiles++;
                }
            }
        }
        if (filledTiles == 9) {
            ties++;
            return {over: true, winner: "tie", winningTiles: ""};
        } 
        return {over: false, winner: "none", winningTiles: ""};
    };

    const nextRound = () => {
        activePlayer = player1;
        gameBoard.resetBoard();
        gameOver = {
            over: false,
            winner: "none",
        }
    }

    const resetGame = () => {
        nextRound();
        player1.resetScore();
        player2.resetScore();
        ties = 0;
    }

    const playRound = (x, y) => {
        gameBoard.placeTile(getActivePlayer(), x, y);
        gameOver = checkGameOver(gameBoard.getBoard(), x, y, getActivePlayer());
        switchPlayerTurn();
    }
    return {getActivePlayer, getTies, getGameOver, playRound, nextRound, resetGame};
})();

const displayController = (function() {

    const playerTurnImage = document.querySelector(".turnImg");
    const boardDiv = document.querySelector(".boardGrid");
    const pageResetButton = document.querySelector(".resetButton");
    const gameOverModal = document.querySelector(".gameOverModal");
    const gameOverTieModal = document.querySelector(".gameOverTieModal");
    const modalResetButton = document.querySelector(".modalResetButton");
    const modalNextRoundButton = document.querySelector(".nextRoundButton");
    const modalResetButtonTie = document.querySelector(".modalResetButtonTie");
    const modalNextRoundButtonTie = document.querySelector(".nextRoundButtonTie");

    const updateScreen = (tile) => {
        // Place the opposing tile of the active player as the active player
        // is switched at the end playRound();
        const tileImage = tile.firstElementChild;
        if (gameController.getActivePlayer().getTileType() == "X") {
            tileImage.src = "images/OFilled.svg";
            playerTurnImage.src = "images/XGray.svg";
        } else {
            tileImage.src = "images/XFilled.svg";
            playerTurnImage.src = "images/OGray.svg";
        }

        if (gameController.getGameOver().over) {

            // Update player score
            const winningPlayer = gameController.getGameOver().winner;
            if (winningPlayer != "tie") {
                const winningPlayerScoreDiv = document.querySelector(`.${winningPlayer.getTileType()}score`);
                winningPlayerScoreDiv.textContent = winningPlayer.getScore();
            } else {
                const tieScoreDiv = document.querySelector(".tiesScore");
                tieScoreDiv.textContent = gameController.getTies();
            }

            // If there's no tie, highlight winning tiles (a row, col or diagonal)
            // so the player knows they he/she won
            let numWinningTiles = gameController.getGameOver().winningTiles.length;
            if (numWinningTiles) {
                for (let i = 0; i < numWinningTiles; i++) {
                    let x = gameController.getGameOver().winningTiles[i][0];
                    let y = gameController.getGameOver().winningTiles[i][1];
                    const tileDiv = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                    const tileDivImg = tileDiv.firstElementChild;
                    tileDiv.style.backgroundColor = winningPlayer.getTileType() == "X"
                    ? "rgb(29, 160, 156)" : "rgb(173, 111, 0)";
                    tileDivImg.src = `images/${winningPlayer.getTileType()}White.svg`;
                }
            } 

            // Render game over modal
            setTimeout(() => {
                if (winningPlayer != "tie") {
                    const winnerIcon = document.querySelector(".winnerIcon");
                    const nextRoundButton = document.querySelector(".nextRoundButton");
                    winnerIcon.src = `images/${winningPlayer.getTileType()}Filled.svg`;
                    nextRoundButton.style.backgroundColor = winningPlayer.getTileType() == "X" 
                    ? "rgb(29, 160, 156)" : "rgb(173, 111, 0)";
                    gameOverModal.classList.add("showModal");
                } else {
                    gameOverTieModal.classList.add("showModal");
                }
            }, 500);
        }
    }    

    function clickBoardTile() {
        gameController.playRound(this.dataset.x, this.dataset.y);
        if (gameController.getGameOver().over) {
            // Disable remaining tiles so the player cannot click them
            // while the game over modal is active
            const gridTiles = Array.from(boardDiv.children);
            gridTiles.forEach(tile => {
                tile.removeEventListener("click", clickBoardTile);
                tile.removeEventListener("mouseenter", hoverOverBoardTile);
                tile.removeEventListener("mouseout", hoverOutOfBoardTile);
            })
        }
        // Prevent players from filling in tiles that are already taken
        this.removeEventListener("click", clickBoardTile);
        this.removeEventListener("mouseenter", hoverOverBoardTile);
        this.removeEventListener("mouseout", hoverOutOfBoardTile);
        updateScreen(this);
    }

    function hoverOverBoardTile() {
        const tileImage = this.firstElementChild;
        if (gameController.getActivePlayer().getTileType() == "X") {
            tileImage.src = "images/XUnfilled.svg";
        } else {
            tileImage.src = "images/OUnfilled.svg";
        }
    }

    function hoverOutOfBoardTile() {
        const tileImage = this.firstElementChild;
        tileImage.src = "";
    }

    const goToNextRound = () => {
        gameController.nextRound();
        playerTurnImage.src = "images/XGray.svg";
        const gridTiles = Array.from(boardDiv.children);
        gridTiles.forEach(tile => {
            tile.style.backgroundColor = "#081e28";
            const tileImage = tile.firstElementChild;
            tileImage.src = "";
        })
        gameOverModal.classList.remove("showModal");
        gameOverTieModal.classList.remove("showModal");
        setupListeners();
    }

    // Resetting the game is identical to going to the next round but the player
    // scores are reset as well
    const resetGame = () => {
        goToNextRound();
        gameController.resetGame();
        const scores = Array.from(document.querySelectorAll(".score"));
        scores.forEach(score => {
            score.textContent = 0;
        });
    }

    const setupListeners = () => {
        const gridTiles = Array.from(boardDiv.children);
        gridTiles.forEach(tile => {
            tile.addEventListener("click", clickBoardTile);
            tile.addEventListener("mouseenter", hoverOverBoardTile);
            tile.addEventListener("mouseout", hoverOutOfBoardTile);
        })
        pageResetButton.addEventListener("click", goToNextRound);
        modalResetButton.addEventListener("click", resetGame);
        modalNextRoundButton.addEventListener("click", goToNextRound);
        modalResetButtonTie.addEventListener("click", resetGame)
        modalNextRoundButtonTie.addEventListener("click",goToNextRound);
    }
    return {setupListeners}
})();
displayController.setupListeners();