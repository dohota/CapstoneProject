const board = document.getElementById('gameBoard');
const size = 8; // 8x8棋盘
let selectedUnit = null;

// 初始化棋盘格子
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.addEventListener('click', onCellClick);
    board.appendChild(cell);
  }
}

// 放一个单位在 (0,0)
const startCell = getCell(0, 0);
const unit = document.createElement('div');
unit.classList.add('unit');
startCell.appendChild(unit);

function getCell(x, y) {
  return board.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

// 点击格子事件
function onCellClick(e) {
  const cell = e.currentTarget;

  // 如果点击的是自己的单位
  if (cell.querySelector('.unit')) {
    clearHighlights();
    selectedUnit = cell.querySelector('.unit');
    highlightMoves(cell.dataset.x, cell.dataset.y);
    return;
  }

  // 如果点击的是高亮格子，移动单位
  if (cell.classList.contains('highlight') && selectedUnit) {
    cell.appendChild(selectedUnit);
    selectedUnit = null;
    clearHighlights();
  }
}

// 高亮可移动范围 (示例：上下左右各一格)
function highlightMoves(x, y) {
  const moves = [
    [parseInt(x)-1, parseInt(y)],
    [parseInt(x)+1, parseInt(y)],
    [parseInt(x), parseInt(y)-1],
    [parseInt(x), parseInt(y)+1]
  ];

  moves.forEach(([mx, my]) => {
    if (mx >=0 && mx < size && my >=0 && my < size) {
      getCell(mx, my).classList.add('highlight');
    }
  });
}

function clearHighlights() {
  board.querySelectorAll('.highlight').forEach(cell => cell.classList.remove('highlight'));
}
