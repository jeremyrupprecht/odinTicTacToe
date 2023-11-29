const controller = (function() {
    
    const gameBoard = (function() {

    })();
    
    const player = (tileType) => {
        score = 0;
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