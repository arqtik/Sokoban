document.onkeydown = checkInput;

let gameEnd = false;
let tileClassUnderPlayer = Tiles.Space; // Remembers which tile is under player so that it can be replace back when player moves
let amountOfGoals = 0;

function generateTiles(map) {
    let main = document.getElementById('tile-grid');
    setGridProperties(map.width, map.height);

    for (let i = 0; i < map.height; i++) {
        for (let j = 0; j < map.width; j++) {
            let tile = document.createElement('div');
            tile.id = 'x' + j + 'y' + i;

            switch (map.mapGrid[i][j][0]) {
                case " ":
                    tile.className = Tiles.Space;
                    //tile.className = Tiles.Space.concat(' ', 'tile-debug-border');
                    break;
                case "W":
                    tile.className = Tiles.Wall;
                    break;
                case "G":
                    tile.className = Tiles.Goal;
                    amountOfGoals++;
                    break;
                case "B":
                    tile.className = Entities.Block;
                    break;
                case "P":
                    tile.className = Entities.Character;
                    break;
            }

            main.appendChild(tile);
        }
    }
}

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

function tryMoveBlock(blockX, blockY, dirX, dirY) {
    let tileInDirection = getTileByCoordinates(blockX + dirX, blockY + dirY);

    if (tileInDirection.className === Tiles.Wall ||
        tileInDirection.className === Entities.Block ||
        tileInDirection.className === Entities.BlockDone) {
        return false;
    }

    let blockToMoveTile = getTileByCoordinates(blockX, blockY);

    if (tileInDirection.className === Tiles.Goal) {
        tileInDirection.className = Entities.BlockDone;
    } else {
        tileInDirection.className = Entities.Block;
    }

    if (blockToMoveTile.className === Entities.BlockDone) {
        blockToMoveTile.className = Tiles.Goal;
    } else {
        blockToMoveTile.className = Tiles.Space;
    }

    return true;
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

function getVector2FromTileId(tileId) {
    tileId = tileId.slice(1, tileId.length)
    let vector2 = tileId.split('y');
    vector2[0] = parseInt(vector2[0]);
    vector2[1] = parseInt(vector2[1]);
    return vector2;
}

function getPlayerElement() {
    return document.getElementsByClassName(Entities.Character)[0];
}

function getTileByCoordinates(x, y) {
    let tileId = 'x' + x + 'y' + y;
    return document.getElementById(tileId);
}

// Set grid css variables to match the map width and height
function setGridProperties(width, height) {
    var root = document.querySelector(':root');

    root.style.setProperty(GridProperties.Width, width);
    root.style.setProperty(GridProperties.Height, height);
}