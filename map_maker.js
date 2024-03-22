var elSelected = null;
var tileSelected = null;
var timeRemaining = 28;
var currentElement = null;
var currentMission = null;

var mountains = [
    "-----------",
    "-m---------",
    "-----------",
    "--------m--",
    "-----------",
    "---m-------",
    "-----------",
    "-----------",
    "---------m-",
    "-----m-----",
    "-----------"
]

//const seasons = ["Spring", "Summer","Autumn","Winter"]

function displayMission() {
    var missionIndex = Math.floor(Math.random() * missions.basic.length);
    currentMission = missions.basic[missionIndex];
    document.getElementById("missionDescription").textContent = "Current Mission: " + currentMission.title;
}

window.onload = function(){
    setMountains();
    displayRandomElement();
   // displayBorderlandsMission()
    displayMission()
    document.getElementById("timeRemaining").textContent = "Time Remaining: " + timeRemaining;
}


function setMountains() {
    for (let r = 0; r < 11; r++) {
        for (let c = 0; c < 11; c++) {
            let tile = document.createElement("div");
            tile.id = `tile-${r}-${c}`;
            tile.classList.add("tile");
            if (mountains[r][c] === 'm') {
                tile.classList.add("mountain");
            }
            tile.addEventListener('click', function() {
                if (timeRemaining <= 0 || !currentElement) return; 
                if (isValidPlacement(this, currentElement)) {
                    placeElement(this, currentElement);
                }
            });
            document.getElementById("board").append(tile);
        }
    }
}


function rotate(matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index])).reverse();
}


function flip(matrix) {
    return matrix.reverse();
}


function rotateElement(element) {
    element.shape = rotate(element.shape);
    element.rotation = (element.rotation + 90) % 360;
}


function flipElement(element) {
    element.shape = flip(element.shape);
    element.mirrored = !element.mirrored;
}


function displayRandomElement() {
    const randomIndex = Math.floor(Math.random() * elements.length);
    currentElement = elements[randomIndex];
    displayElement(currentElement);
}

function displayElement(element) {
    const currentElem = document.getElementById('currentElem');
    currentElem.innerHTML = '';

    const elementContainer = document.createElement('div');
    elementContainer.className = 'element-container';

    const timeDisplay = document.createElement('div');
    timeDisplay.textContent = "Time: " + element.time;
    timeDisplay.className = 'time-display';
    elementContainer.appendChild(timeDisplay);

    const shapeContainer = document.createElement('div');
    shapeContainer.className = 'shape-container';
    element.shape.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'shape-row';
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'shape-cell';
            if (cell === 1) {
                cellDiv.classList.add('on', element.type);
            }
            rowDiv.appendChild(cellDiv);
        });
        shapeContainer.appendChild(rowDiv);
    });
    elementContainer.appendChild(shapeContainer);

    currentElem.appendChild(elementContainer);
}


document.getElementById('rotate').addEventListener('click', function() {
    if (currentElement) {
        rotateElement(currentElement);
        displayElement(currentElement);
    }
});

document.getElementById('flip').addEventListener('click', function() {
    if (currentElement) {
        flipElement(currentElement);
        displayElement(currentElement);
    }
});




function checkBorderlands() {
    let points = 0;
    let rowCounts = Array(11).fill(0);
    let colCounts = Array(11).fill(0);

    for (let r = 0; r < 11; r++) {
        for (let c = 0; c < 11; c++) {
            let tile = document.getElementById(`tile-${r}-${c}`);
            if (tile.style.backgroundImage !== '' && !tile.classList.contains('mountain')) {
                rowCounts[r]++;
                colCounts[c]++;
            }
        }
    }

    
    rowCounts.forEach(count => {
        if (count === 11) {
            points += 6;
        }
    });

  
    colCounts.forEach(count => {
        if (count === 11) {
            points += 6; 
        }
    });

    return points;
}

function checkSleepyValley() {
    let points = 0;

    for (let r = 0; r < 11; r++) {
        let forestCount = 0;
        for (let c = 0; c < 11; c++) {
            let tile = document.getElementById(`tile-${r}-${c}`);
            if (tile.classList.contains('forest')) {
                forestCount++;
            }
        }
        if (forestCount === 3) {
            points += 4;
        }
    }

    return points;
}

function checkEdgeOfTheForest() {
    let points = 0;

    
    for (let c = 0; c < 11; c++) {
        let topTile = document.getElementById(`tile-0-${c}`);
        let bottomTile = document.getElementById(`tile-10-${c}`);
        if (topTile.classList.contains('forest')) {
            points++;
        }
        if (bottomTile.classList.contains('forest')) {
            points++;
        }
    }

    
    for (let r = 1; r < 10; r++) {
        let leftTile = document.getElementById(`tile-${r}-0`);
        let rightTile = document.getElementById(`tile-${r}-10`);
        if (leftTile.classList.contains('forest')) {
            points++;
        }
        if (rightTile.classList.contains('forest')) {
            points++;
        }
    }

    return points;
}


function checkWateringPotatoes() {
    let points = 0;

 
    for (let r = 0; r < 11; r++) {
        for (let c = 0; c < 11; c++) {
            let tile = document.getElementById(`tile-${r}-${c}`);

           
            if (tile.classList.contains('water')) {
                let neighbors = [
                    document.getElementById(`tile-${r-1}-${c}`),   
                    document.getElementById(`tile-${r+1}-${c}`),   
                    document.getElementById(`tile-${r}-${c-1}`),   
                    document.getElementById(`tile-${r}-${c+1}`)    
                ];

              
                for (let neighbor of neighbors) {
                    if (neighbor && neighbor.classList.contains('farm')) {
                        points += 2;
                        break;
                    }
                }
            }
        }
    }

    return points;
}



function checkSurroundedMountains() {
    let points = 0;

    for (let r = 0; r < 11; r++) {
        for (let c = 0; c < 11; c++) {
            let tile = document.getElementById(`tile-${r}-${c}`);

            
            if (tile && tile.classList.contains('mountain')) {
                let neighbors = [
                    r > 0 ? document.getElementById(`tile-${r-1}-${c}`) : null,   
                    r < 10 ? document.getElementById(`tile-${r+1}-${c}`) : null,  
                    c > 0 ? document.getElementById(`tile-${r}-${c-1}`) : null,  
                    c < 10 ? document.getElementById(`tile-${r}-${c+1}`) : null   
                ];

                if (neighbors.every(neighbor => neighbor && neighbor.style.backgroundImage !== '')) {
                    points++;
                }
            }
        }
    }

    return points;
}



const elements = [
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false        
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,0],
                [1,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,1],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[0,1,0],
                [1,1,1],
                [0,1,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [1,0,0],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,0,0],
                [1,1,1],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,1]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,0],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
]


function getElementImage(type) {
    switch (type) {
        case 'water':
            return "url('water_tile.png')";
        case 'town':
            return "url('village_tile.png')";
        case 'forest':
            return "url('forest_tile.png')";
        case 'farm':
            return "url('plains_tile.png')";
        default:
            return 'none'; 
    }
}


function placeElement(tile, element) {
    const startRow = parseInt(tile.id.split("-")[1]);
    const startCol = parseInt(tile.id.split("-")[2]);

    for (let i = 0; i < element.shape.length; i++) {
        for (let j = 0; j < element.shape[i].length; j++) {
            if (element.shape[i][j] === 1) {
                let targetRow = startRow + i;
                let targetCol = startCol + j;
                let targetTile = document.getElementById(`tile-${targetRow}-${targetCol}`);
                if (targetTile && !targetTile.classList.contains('mountain')) {
                    targetTile.classList.add(element.type); 
                    targetTile.style.backgroundImage = getElementImage(element.type);
                }
            }
        }
    }
    updateTime(element.time);
    if (timeRemaining > 0) {
        displayRandomElement(); 
    }
}

function isValidPlacement(tile, element) {
    const startRow = parseInt(tile.id.split("-")[1]);
    const startCol = parseInt(tile.id.split("-")[2]);

    let shape = element.shape;

   
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                let targetRow = startRow + i;
                let targetCol = startCol + j;
                if (targetRow >= 11 || targetCol >= 11) return false; 
                let targetTile = document.getElementById(`tile-${targetRow}-${targetCol}`);
                if (!targetTile || targetTile.classList.contains('mountain') || targetTile.style.backgroundImage !== '') {
                    return false; 
                }
            }
        }
    }
    return true; 
}


function updateTime(timeUsed) {
    timeRemaining -= timeUsed;
    document.getElementById("timeRemaining").textContent = "Time Remaining: " + timeRemaining;
    if (timeRemaining <= 0) {
        endGame();
    }
}



function endGame() {
    let points = 0;
    let mountainPoints = checkSurroundedMountains();
    if (currentMission.title === "Borderlands") {
        points = checkBorderlands();
    } else if (currentMission.title === "Sleepy valley") {
        points = checkSleepyValley();
    } else if (currentMission.title === "Edge of the forest") {
        points = checkEdgeOfTheForest();
    } else if (currentMission.title === "Watering potatoes") {
        points = checkWateringPotatoes();
    }
    let fpoints = mountainPoints + points
   
    alert("Game Over! You scored " + points + " points in the " + currentMission.title + " mission. Addisionally, got "+mountainPoints+" points for surrounding mountains.");
    document.getElementById("totalPoints").textContent = "Total Points: " + fpoints;
}




const missions = 
{
  "basic": [
    {
      "title": "Edge of the forest",
      "description": "You get one point for each forest field adjacent to the edge of your map."
    },
    {
      "title": "Sleepy valley",
      "description": "For every row with three forest fields, you get four points."
    },
    {
      "title": "Watering potatoes",
      "description": "You get two points for each water field adjacent to your farm fields."
    },
    {
      "title": "Borderlands",
      "description": "For each full row or column, you get six points."
    }
  ]
}
