const controller = (function() {
    
    const gameBoard = (function() {
        let gameBoard = [[]];
        const checkGameOver = () => {

        };
        const reset = () => {

        };
        const getBoard = () => gameBoard;
        const printBoard = () => {
            console.log(gameBoard);
        }
        const placeTile = (player, x, y) => {
            
        };
    })();
    
    const player = (tileType) => {
        let score = 0;
        const getScore = () => score;
        const incrementScore = () => score++;
        const getTileType = () => tileType;
        return {getScore, incrementScore, getTileType}
    }

    const playRound = () => {
        
    }
    
    const play = () => {
        // while (true) {

        // }
    }

    // gameboard object already exists...
    const player1 = player("X");
    const player2 = player("O");
    let ties = 0;
    let turn = "X";
    let gameOver = {
        over: false,
        winner: "none",
    }

    return {play}
})();
controller.play();