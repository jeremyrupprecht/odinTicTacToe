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
        printBoard();
    };

    const resetBoard = () => {
        gameBoard = [["", "", ""],
                    ["", "", ""],
                    ["", "", ""]];
    };

    return {getBoard, placeTile, printBoard, resetBoard}
})();

const gameController = (function() {

    const player1 = player("X");
    const player2 = player("O");
    let activePlayer = player1;
    let ties = 0;
    let gameOver = {
        over: false,
        winner: "none",
    }
    let playAgain = true;

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
        let rowsNeededToWin = 0;
        let colsNeededToWin = 0;
        let diagsNeededToWin = 0;
        let reverseDiagsNeededToWin = 0;
        let boardLength = board.length;
        for (let i = 0; i < boardLength; i++) {
            if (board[x][i] == tileType) rowsNeededToWin++;
            if (board[i][y] == tileType) colsNeededToWin++;
            if (board[i][i] == tileType) diagsNeededToWin++;
            if (board[i][boardLength - 1 - i] == tileType) reverseDiagsNeededToWin++;
        }
        if (rowsNeededToWin == boardLength ||
            colsNeededToWin == boardLength || 
            diagsNeededToWin == boardLength ||
            reverseDiagsNeededToWin == boardLength) {
                console.log(`Player ${tileType} Wins!`);
                player.incrementScore();
                return {over: true, winner: player};
        }
        return {over: false, winner: "none"};
    };

    const resetGame = () => {
        activePlayer = player1;
        gameBoard.resetBoard();
        gameOver = {
            over: false,
            winner: "none",
        }
        // console.log("RESET!");
    }

    const playRound = (x, y) => {
        gameBoard.placeTile(getActivePlayer(), x, y);
        gameOver = checkGameOver(gameBoard.getBoard(), x, y, getActivePlayer());
        switchPlayerTurn();
        // if (gameOver.over) {
        //     resetGame();
        // }
    }
    const play = () => {
        while (playAgain) {
            gameBoard.printBoard();
            while (!(gameOver.over)) {
                playRound();
            }
            console.log(`Scores: player ${player1.getTileType()}: ${player1.getScore()}, player ${player2.getTileType()}: ${player2.getScore()}`)
            console.log("The game is over...");
            let playAgainInput = prompt("Would you like to play again? (y/n):");
            playAgain = true ? playAgainInput == "y" : false;
            // resetGame();
        }
        console.log("quiting...");
    }

    return {getActivePlayer, getTies, playRound, getGameOver};
})();

const displayController = (function() {

    const playerTurnImage = document.querySelector(".turnImg");
    const boardDiv = document.querySelector(".boardGrid");
    const resetButton = document.querySelector(".resetButton");

    const updateScreen = (cell) => {
        // Place the opposing tile of the active player as the active player
        // is switched at the end playRound();
        const cellImage = cell.firstElementChild;
        if (gameController.getActivePlayer().getTileType() == "X") {
            cellImage.src = "images/Ofilled.svg";
            playerTurnImage.src = "images/Xgray.svg";
        } else {
            cellImage.src = "images/Xfilled.svg";
            playerTurnImage.src = "images/Ogray.svg";
        }

        console.log(gameController.getGameOver().over);
        if (gameController.getGameOver().over) {
            console.log("OVAAAA");
            // Render game over modal

            // Update player score
            const winningPlayer = gameController.getGameOver().winner;
            const winningPlayerScoreDiv = winningPlayer.getTileType() === "X"
            ? document.querySelector(".Xscore")
            : document.querySelector(".Oscore");
            winningPlayerScoreDiv.textContent = winningPlayer.getScore();

        }


    }    

    function clickBoardCell() {
        gameController.playRound(this.dataset.x, this.dataset.y);
        updateScreen(this);
        // Prevent players from filling in cells that are already taken
        this.removeEventListener("click", clickBoardCell);
        this.removeEventListener("mouseenter", hoverOverBoardCell);
        this.removeEventListener("mouseout", hoverOutOfBoardCell);
    }

    function hoverOverBoardCell() {
        const cellImage = this.firstElementChild;
        if (gameController.getActivePlayer().getTileType() == "X") {
            cellImage.src = "images/Xunfilled.svg";
        } else {
            cellImage.src = "images/Ounfilled.svg";
        }
    }

    function hoverOutOfBoardCell() {
        const cellImage = this.firstElementChild;
        cellImage.src = "";
    }

    const resetGame = () => {
        console.log("reset!");
    }

    const setupListeners = () => {
        const gridCells = Array.from(boardDiv.children);
        gridCells.forEach(cell => {
            cell.addEventListener("click", clickBoardCell);
            cell.addEventListener("mouseenter", hoverOverBoardCell);
            cell.addEventListener("mouseout", hoverOutOfBoardCell);
        })
        resetButton.addEventListener("click", resetGame);
    }

    return {updateScreen, setupListeners}

})();
displayController.setupListeners();