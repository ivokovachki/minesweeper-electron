const game = document.getElementById("game");

const width = 10;
const height = 10;
const mineCount = 10;

// Game state
let board = [];
let mines = [];
let gameOver = false;
let cellsRevealed = 0;
const totalCells = width * height;

// Unicode characters for flag and mine
const FLAG = '\uD83D\uDEA9'; // Flag emoji (🚩)
const MINE = '\uD83D\uDCA3'; // Bomb emoji (💣)

function createBoard() {
  // Initialize empty board
  board = Array(height).fill().map(() => Array(width).fill(0));
  
  // Place mines randomly
  mines = [];
  let minesPlaced = 0;
  
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    
    // Check if mine already exists at this position
    const exists = mines.some(mine => mine.x === x && mine.y === y);
    
    if (!exists) {
      mines.push({ x, y });
      minesPlaced++;
    }
  }
  
  // Calculate numbers for adjacent cells
  for (const mine of mines) {
    // For each mine, increment the count of all adjacent cells
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = mine.x + dx;
        const ny = mine.y + dy;
        
        // Skip if out of bounds or if it's the mine itself
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        if (dx === 0 && dy === 0) continue;
        
        // Increment the count
        board[ny][nx]++;
      }
    }
  }
}

function createCell(x, y) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.x = x;
  cell.dataset.y = y;
  
  // Left click to reveal cell
  cell.addEventListener("click", () => {
    if (gameOver) return;
    revealCell(x, y);
  });
  
  // Right click to flag cell
  cell.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (gameOver) return;
    
    if (cell.textContent === FLAG) {
      cell.textContent = "";
    } else if (!cell.classList.contains("revealed")) {
      cell.textContent = FLAG;
    }
  });
  
  return cell;
}

function revealCell(x, y) {
  // Get the cell element
  const cellElement = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  
  // If cell is already revealed or flagged, do nothing
  if (cellElement.classList.contains("revealed") || cellElement.textContent === FLAG) {
    return;
  }
  
  // Mark cell as revealed
  cellElement.classList.add("revealed");
  cellElement.style.backgroundColor = "white";
  cellsRevealed++;
  
  // Check if it's a mine
  const isMine = mines.some(mine => mine.x === x && mine.y === y);
  
  if (isMine) {
    // Game over - show all mines
    cellElement.textContent = MINE;
    cellElement.style.backgroundColor = "red";
    gameOver = true;
    revealAllMines();
    setTimeout(() => {
      alert("Game Over! You hit a mine.");
    }, 100);
    return;
  }
  
  // Display number if it has adjacent mines
  const adjacentMines = board[y][x];
  if (adjacentMines > 0) {
    cellElement.textContent = adjacentMines;
    // Set color based on number
    const colors = ["", "blue", "green", "red", "purple", "maroon", "turquoise", "black", "gray"];
    cellElement.style.color = colors[adjacentMines];
  } else {
    // If no adjacent mines, recursively reveal adjacent cells
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        
        // Skip if out of bounds
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        
        revealCell(nx, ny);
      }
    }
  }
  
  // Check if player has won
  if (cellsRevealed === totalCells - mineCount) {
    gameOver = true;
    revealAllMines(true); // Mark all mines with flags
    setTimeout(() => {
      alert("Congratulations! You've won!");
    }, 100);
  }
}

function revealAllMines(won = false) {
  for (const mine of mines) {
    const cellElement = document.querySelector(`[data-x="${mine.x}"][data-y="${mine.y}"]`);
    if (!cellElement.classList.contains("revealed")) {
      if (won) {
        cellElement.textContent = FLAG;
      } else {
        cellElement.textContent = MINE;
      }
    }
  }
}

function init() {
  // Clear the game board
  game.innerHTML = "";
  gameOver = false;
  cellsRevealed = 0;
  
  // Create the game board
  createBoard();
  
  // Create and append cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = createCell(x, y);
      game.appendChild(cell);
    }
  }
  
  // Add reset button
  const resetButton = document.createElement("button");
  resetButton.textContent = "New Game";
  resetButton.style.marginTop = "20px";
  resetButton.addEventListener("click", init);
  
  // Only append the button if it doesn't already exist
  const existingButton = document.querySelector("button");
  if (!existingButton) {
    document.body.appendChild(resetButton);
  }
}

init();