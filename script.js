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
            
        }


    })();
    
    const player = (tileType) => {
        let score = 0;
        const getScore = () => score;
        const incrementScore = () => score++;
        const getTileType = () => tileType;
        return {getScore, incrementScore, getTileType}
    }

    const playRound = () => {
        // ....
    }
    
    const play = () => {
        // while (true) {

        // }
    }
    
    return {play}
})();
controller.play();