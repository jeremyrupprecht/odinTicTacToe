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

class GameBoard {
    #gameBoard = [["", "", ""],
                  ["", "", ""],
                  ["", "", ""]];
    
    constructor() {
        this.#gameBoard = [["", "", ""],
                           ["", "", ""],
                           ["", "", ""]];
    }

    getBoard() {
        return this.#gameBoard;
    }

    printBoard() {
        let rowText = "["
        let board = this.getBoard();
        for(let i = 0; i < board.length; i++) {
            for(let o = 0; o < board[i].length; o++) {
                if (!board[i][o]) {
                    rowText += " ,";
                    continue;
                }
                rowText += board[i][o] + ",";
            }
            console.log(rowText + "]");
            rowText = "[";
        }
    }

    placeTile(player, x, y) {
        this.#gameBoard[x][y] = `${player.getTileType()}`;
        this.printBoard();
    }

    resetBoard() {
        this.#gameBoard = [["", "", ""],
                          ["", "", ""],
                          ["", "", ""]];
    } 
}

class GameController {
    #player1 = new Player("X");
    #player2 = new Player("O");
    #board = new GameBoard();
    #activePlayer = this.#player1;
    #ties = 0;
    #gameOver = {
        over: false,
        winner: "none",
        winningTiles: [],
    }

    getActivePlayer() {
        return this.#activePlayer;
    }

    getTies() {
        return this.#ties;
    }

    getGameOver() {
        return this.#gameOver;
    }

    switchPlayerTurn() {
        this.#activePlayer = this.#activePlayer === this.#player1 ? this.#player2 : this.#player1;
    }

    checkGameOver(x, y) {
        // A win can only happen at the current move so check the current row, col
        // and diagonal (both ways) for the a win
        const player = this.getActivePlayer();
        const board = this.#board.getBoard();
        let tileType = player.getTileType();
        let rowsNeededToWin = {count: 0, tiles: []};
        let colsNeededToWin = {count: 0, tiles: []};
        let diagsNeededToWin = {count: 0, tiles: []};
        let reverseDiagsNeededToWin = {count: 0, tiles: []};
        const boardLength = board.length;
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
            this.#ties++;
            return {over: true, winner: "tie", winningTiles: ""};
        } 
        return {over: false, winner: "none", winningTiles: ""};
    }

    nextRound() {
        this.#activePlayer = this.#player1;
        this.#board.resetBoard();
        this.#gameOver = {
            over: false,
            winner: "none",
        }
    }

    resetGame() {
        this.nextRound();
        this.#player1.resetScore();
        this.#player2.resetScore();
        this.#ties = 0;
    }

    playRound(x, y) {
        this.#board.placeTile(this.getActivePlayer(), x, y);
        this.#gameOver = this.checkGameOver(x, y);
        this.switchPlayerTurn();
    }
}

class DisplayController {
    #gameController = new GameController();
    #playerTurnImage = document.querySelector(".turnImg");
    #boardDiv = document.querySelector(".boardGrid");
    #pageResetButton = document.querySelector(".resetButton");
    #gameOverModal = document.querySelector(".gameOverModal");
    #gameOverTieModal = document.querySelector(".gameOverTieModal");
    #modalResetButton = document.querySelector(".modalResetButton");
    #modalNextRoundButton = document.querySelector(".nextRoundButton");
    #modalResetButtonTie = document.querySelector(".modalResetButtonTie");
    #modalNextRoundButtonTie = document.querySelector(".nextRoundButtonTie");

    updateScreen = (tile) => {
        // Place the opposing tile of the active player as the active player
        // is switched at the end playRound();
        const tileImage = tile.firstElementChild;
        if (this.#gameController.getActivePlayer().getTileType() == "X") {
            tileImage.src = "images/OFilled.svg";
            this.#playerTurnImage.src = "images/XGray.svg";
        } else {
            tileImage.src = "images/XFilled.svg";
            this.#playerTurnImage.src = "images/OGray.svg";
        }

        if (this.#gameController.getGameOver().over) {

            // Update player score
            const winningPlayer = this.#gameController.getGameOver().winner;
            if (winningPlayer != "tie") {
                const winningPlayerScoreDiv = document.querySelector(`.${winningPlayer.getTileType()}score`);
                winningPlayerScoreDiv.textContent = winningPlayer.getScore();
            } else {
                const tieScoreDiv = document.querySelector(".tiesScore");
                tieScoreDiv.textContent = this.#gameController.getTies();
            }

            // If there's no tie, highlight winning tiles (a row, col or diagonal)
            // so the player knows they he/she won
            let numWinningTiles = this.#gameController.getGameOver().winningTiles.length;
            if (numWinningTiles) {
                for (let i = 0; i < numWinningTiles; i++) {
                    let x = this.#gameController.getGameOver().winningTiles[i][0];
                    let y = this.#gameController.getGameOver().winningTiles[i][1];
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
                    winnerIcon.src = `images/${winningPlayer.getTileType()}Filled.svg`;
                    this.#modalNextRoundButton.style.backgroundColor = winningPlayer.getTileType() == "X" 
                    ? "rgb(29, 160, 156)" : "rgb(173, 111, 0)";
                    this.#gameOverModal.classList.add("showModal");
                } else {
                    this.#modalNextRoundButtonTie.style.backgroundColor = "rgb(42, 65, 76)";
                    this.#gameOverTieModal.classList.add("showModal");
                }
            }, 500);
        }
    }    

    clickBoardTile = (event) => {
        const tile = event.currentTarget;
        this.#gameController.playRound(tile.dataset.x, tile.dataset.y);

        if (this.#gameController.getGameOver().over) {
            // Disable remaining tiles so the player cannot click them
            // while the game over modal is active
            const gridTiles = Array.from(this.#boardDiv.children);
            gridTiles.forEach(gTile => {
                gTile.removeEventListener("click", this.clickBoardTile);
                gTile.removeEventListener("mouseenter", this.hoverOverBoardTile);
                gTile.removeEventListener("mouseout", this.hoverOutOfBoardTile);
            })
        }

        // Prevent players from filling in tiles that are already taken
        tile.removeEventListener("click", this.clickBoardTile);
        tile.removeEventListener("mouseenter", this.hoverOverBoardTile);
        tile.removeEventListener("mouseout", this.hoverOutOfBoardTile);
        this.updateScreen(tile);
    }

    hoverOverBoardTile = (event) => {
        const tileImage = event.currentTarget.firstElementChild;
        if (this.#gameController.getActivePlayer().getTileType() == "X") {
            tileImage.src = "images/XUnfilled.svg";
        } else {
            tileImage.src = "images/OUnfilled.svg";
        }
    }

    hoverOutOfBoardTile = (event) => {
        const tileImage = event.currentTarget.firstElementChild;
        tileImage.src = "";
    }

    goToNextRound = () => {
        this.#gameController.nextRound();
        this.#playerTurnImage.src = "images/XGray.svg";
        const gridTiles = Array.from(this.#boardDiv.children);
        gridTiles.forEach(tile => {
            tile.style.backgroundColor = "#081e28";
            const tileImage = tile.firstElementChild;
            tileImage.src = "";
        })
        this.#gameOverModal.classList.remove("showModal");
        this.#gameOverTieModal.classList.remove("showModal");
        this.setupListeners();
    }

    // Resetting the game is identical to going to the next round but the player
    // scores are reset as well
    resetGame = () => {
        this.goToNextRound();
        this.#gameController.resetGame();
        const scores = Array.from(document.querySelectorAll(".score"));
        scores.forEach(score => {
            score.textContent = 0;
        });
    }

    setupListeners() {
        const gridTiles = Array.from(this.#boardDiv.children);
        gridTiles.forEach(tile => {
            tile.addEventListener("click", this.clickBoardTile);
            tile.addEventListener("mouseenter", this.hoverOverBoardTile);
            tile.addEventListener("mouseout", this.hoverOutOfBoardTile);
        })
        this.#pageResetButton.addEventListener("click", this.goToNextRound);
        this.#modalResetButton.addEventListener("click", this.resetGame);
        this.#modalNextRoundButton.addEventListener("click", this.goToNextRound);
        this.#modalResetButtonTie.addEventListener("click", this.resetGame)
        this.#modalNextRoundButtonTie.addEventListener("click", this.goToNextRound);
    }

}

const display = new DisplayController();
display.setupListeners();