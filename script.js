const player = (tileType) => {
    let score = 0;
    const getScore = () => score;
    const incrementScore = () => score++;
    const getTileType = () => tileType;
    return {getScore, incrementScore, getTileType}
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
        // If there's already a tile there, don't replace it, return immediately
        if (gameBoard[x][y]) {
            console.log("NOPE");
            return
        }
        gameBoard[x][y] = `${player.getTileType()}`;
        printBoard();
        checkGameOver(x, y, player);
    };

    const checkGameOver = (x, y, player) => {
        // A win can only happen at the current move so check the current row, col
        // and diagonal (both ways) for the a win
        let tileType = player.getTileType();
        let rowsNeededToWin = 0;
        let colsNeededToWin = 0;
        let diagsNeededToWin = 0;
        let reverseDiagsNeededToWin = 0;
        let boardLength = gameBoard.length;
        for (let i = 0; i < boardLength; i++) {
            if (gameBoard[x][i] == tileType) rowsNeededToWin++;
            if (gameBoard[i][y] == tileType) colsNeededToWin++;
            if (gameBoard[i][i] == tileType) diagsNeededToWin++;
            if (gameBoard[i][boardLength - 1 - i] == tileType) reverseDiagsNeededToWin++;
            console.log(`i ${i}`);
            
        }
        console.log(reverseDiagsNeededToWin);
        if (rowsNeededToWin == boardLength ||
            colsNeededToWin == boardLength || 
            diagsNeededToWin == boardLength ||
            reverseDiagsNeededToWin == boardLength) {
                console.log(`Player ${tileType} Wins!`);
                player.incrementScore();
        }

    };

    const reset = () => {

    };

    return {getBoard, placeTile, printBoard, checkGameOver, reset}
})();

const controller = (function() {

    const player1 = player("X");
    const player2 = player("O");
    let activePlayer = player1;
    let ties = 0;
    let gameOver = {
        over: false,
        winner: "none",
    }

    const getActivePlayer = () => activePlayer;
    const getTies = () => ties;
    const getGameOver = () => gameOver;
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const playRound = () => {
        console.log("Round Start!");
        let input = prompt("Enter in (zero-indexed) tile coordinates (x y):").split(" ");
        let x = input[0];
        let y = input[1];
        gameBoard.placeTile(getActivePlayer(), x, y);
        switchPlayerTurn();
    }
    
    const play = () => {
        // while (true) {
            // while (!(gameOver.over)) {
                 //playRound();
            // }
        // }

        for (let i = 0; i < 9; i++) {
            playRound();
        }

    }

    return {play, getActivePlayer, getTies}
})();
controller.play();