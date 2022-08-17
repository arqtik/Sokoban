document.onkeydown = checkInput;

let gameEnd = false;
let tileClassUnderPlayer = Tiles.Space; // Remembers which tile is under player so that it can be replace back when player moves

function checkInput(input) {
    // Disable input if holding key or game over
    if (input.repeat || gameEnd) { return }

    /*
        37: Left
        38: Up
        39: Right
        40: Down
    */

    switch (input.keyCode) {
        case 37:
            input.preventDefault();
            movePlayer(-1, 0)
            break;
        case 38:
            input.preventDefault();
            movePlayer(0, -1)
            break;
        case 39:
            input.preventDefault();
            movePlayer(1, 0)
            break;
        case 40:
            input.preventDefault();
            movePlayer(0, 1)
            break;
    }
}

// Move player in direction
function movePlayer(x, y) {
    let currentPlayerTile = getPlayerElement();
    let playerPos = getVector2FromTileId(currentPlayerTile.id);
    let nextMoveTile = getTileByCoordinates(playerPos[0] + x, playerPos[1] + y);

    if (nextMoveTile.className === Tiles.Wall) {
        return;
    }

    let canMove = true;

    if (nextMoveTile.className === Entities.Block || nextMoveTile.className === Entities.BlockDone) {
        canMove = tryMoveBlock(playerPos[0] + x, playerPos[1] + y, x, y);
    }

    if (canMove) {
        currentPlayerTile.className = tileClassUnderPlayer;
        tileClassUnderPlayer = nextMoveTile.className;
        nextMoveTile.className = Entities.Character;
    }

    checkWinCondition();
}

function checkWinCondition() {
    let doneBlockTiles = document.getElementsByClassName(Entities.BlockDone);
    doneBlockTiles = doneBlockTiles.length;

    if (doneBlockTiles === amountOfGoals) {
        console.log("Player won!");
        gameEnd = true;
        document.getElementById("end-screen").classList.remove("hidden");
    }
}