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

    const placeTile = (player, x, y) => {
        gameBoard[x][y] = `${player.getTileType()}`;
        printBoard();
        checkGameOver();
    };
    const printBoard = () => {
        console.log(gameBoard);
    }

    const checkGameOver = () => {

    };
    const reset = () => {

    };
    return {getBoard, placeTile, printBoard, checkGameOver, reset}
})();

const controller = (function() {

    const player1 = player("X");
    const player2 = player("O");
    let ties = 0;
    let gameOver = {
        over: false,
        winner: "none",
    }
    let activePlayer = player1;

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
                 playRound();
            // }
        // }

    }

    return {play, getActivePlayer}
})();
controller.play();