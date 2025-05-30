const svg = document.getElementById("svgContainer");
const startBtn = document.getElementById("startBtn");
const hintBtn = document.getElementById("hintBtn");
const heightInput = document.getElementById("height");

let towers = [[], [], []];
let diskHeight = 20;
let diskMaxWidth = 120;
let towerX = [100, 300, 500];
let selectedTower = null;
let moves = [];

startBtn.addEventListener("click", () => {
  let height = parseInt(heightInput.value);
  towers = [[], [], []];
  for (let i = height; i >= 1; i--) {
    towers[0].push(i);
  }
  selectedTower = null;
  calculateMoves(height, 0, 2, 1);
  draw();
});

hintBtn.addEventListener("click", () => {
  if (moves.length > 0) {
    const [from, to] = moves.shift();
    moveDisk(from, to);
    draw();
  }
});

svg.addEventListener("click", (e) => {
  const x = e.offsetX;
  let clicked = towerX.findIndex((tx) => Math.abs(tx - x) < 60);
  if (clicked === -1) return;
  if (selectedTower === null) {
    if (towers[clicked].length === 0) return;
    selectedTower = clicked;
  } else {
    if (clicked !== selectedTower) {
      moveDisk(selectedTower, clicked);
      draw();
    }
    selectedTower = null;
  }
});

function draw() {
  svg.innerHTML = "";
  for (let t = 0; t < 3; t++) {
    for (let i = 0; i < towers[t].length; i++) {
      let disk = towers[t][i];
      let width = (diskMaxWidth * disk) / heightInput.value;
      let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", towerX[t] - width / 2);
      rect.setAttribute("y", 280 - i * diskHeight);
      rect.setAttribute("width", width);
      rect.setAttribute("height", diskHeight - 2);
      rect.setAttribute("fill", `hsl(${disk * 40}, 70%, 60%)`);
      rect.setAttribute("class", "disk");
      svg.appendChild(rect);
    }
  }
}

function moveDisk(from, to) {
  const disk = towers[from][towers[from].length - 1];
  if (!disk) return;
  if (towers[to].length === 0 || towers[to][towers[to].length - 1] > disk) {
    towers[to].push(towers[from].pop());
  } else {
    alert("Нельзя класть большой диск на меньший!");
  }
}

function calculateMoves(n, from, to, aux) {
  moves = [];
  function hanoi(n, from, to, aux) {
    if (n === 0) return;
    hanoi(n - 1, from, aux, to);
    moves.push([from, to]);
    hanoi(n - 1, aux, to, from);
  }
  hanoi(n, from, to, aux);
}
