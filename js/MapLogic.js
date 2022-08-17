let amountOfGoals = 0; // Amount of goals the map has, required for win condition

function generateTilesFromMap(map) {
    removeTilesFromGrid();
    setGridProperties(map.width, map.height);

    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            let tile = document.createElement('div');
            tile.id = 'x' + x + 'y' + y;

            switch (map.mapGrid[y][x][0]) {
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

            TileGrid.appendChild(tile);
        }
    }
}

function GenerateTiles(width, height, bordersActive = false) {
    removeTilesFromGrid();
    setGridProperties(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let tile = document.createElement('div');
            tile.id = 'x' + x + 'y' + y;
            tile.className = Tiles.Space;

            TileGrid.appendChild(tile);
        }
    }

    setTileBorders(bordersActive);
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

function removeTilesFromGrid() {
    TileGrid.innerHTML = '';
}

function setTileBorders(active) {
    var tiles = Array.from(TileGrid.children);

    if (active) {
        tiles.forEach(tile => {
            tile.classList.add("tile-border");
        });
    } else {
        tiles.forEach(tile => {
            tile.classList.remove("tile-border");
        });
    }
}