

// // 放一个单位在 (0,0)
// const startCell = getCell(0, 0);
// const unit = document.createElement('div');
// unit.classList.add('unit');
// startCell.appendChild(unit);
//
// function getCell(x, y) {
//   return board.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
// }
//
// // 点击格子事件
// function onCellClick(e) {
//   const cell = e.currentTarget;
//
//   // 如果点击的是自己的单位
//   if (cell.querySelector('.unit')) {
//     clearHighlights();
//     selectedUnit = cell.querySelector('.unit');
//     highlightMoves(cell.dataset.x, cell.dataset.y);
//     return;
//   }
//
//   // 如果点击的是高亮格子，移动单位
//   if (cell.classList.contains('highlight') && selectedUnit) {
//     cell.appendChild(selectedUnit);
//     selectedUnit = null;
//     clearHighlights();
//   }
// }
//
// // 高亮可移动范围 (示例：上下左右各一格)
// function highlightMoves(x, y) {
//   const moves = [
//     [parseInt(x)-1, parseInt(y)],
//     [parseInt(x)+1, parseInt(y)],
//     [parseInt(x), parseInt(y)-1],
//     [parseInt(x), parseInt(y)+1]
//   ];
//
//   moves.forEach(([mx, my]) => {
//     if (mx >=0 && mx < size && my >=0 && my < size) {
//       getCell(mx, my).classList.add('highlight');
//     }
//   });
// }
//
// function clearHighlights() {
//   board.querySelectorAll('.highlight').forEach(cell => cell.classList.remove('highlight'));
// }
// const board = document.getElementById('gameBoard');
// const hexSize = 30;  // 六角形的半径
// const hexWidth = Math.sqrt(3) * hexSize;  // 六角形的宽度
// const hexHeight = 2 * hexSize;  // 六角形的高度
//
// // // 初始化棋盘格子
// // for (let y = 0; y < 8; y++) {
// //   for (let x = 0; x < 8; x++) {
// //     const cell = document.createElement('div');
// //     cell.classList.add('cell');
// //     cell.dataset.x = x;
// //     cell.dataset.y = y;
// //     cell.addEventListener('click', onCellClick);
// //     board.appendChild(cell);
// //   }
// // }
// // 绘制单个六角形
// function drawHex(x, y) {
//   for (let y = 0; y < 8; y++) {  // 假设棋盘 8 行
//   for (let x = 0; x < 8; x++) {  // 假设棋盘 8 列
//     const hex = document.createElement('div');
//     hex.classList.add('hex');  // 为每个六角形元素添加一个类
//     hex.dataset.x = x;
//     hex.dataset.y = y;
//     // 计算六角形的位置，使用 `transform` 来确保六角形的定位
//     const offsetX = x * hexWidth;
//     const offsetY = y * (hexHeight * 0.75);  // 每两行六角形的垂直间距为 `hexHeight * 0.75`
//     // 对于奇数列的六角形，调整它们的水平位置
//     if (x % 2 === 1) {
//       hex.style.marginLeft = (hexWidth / 2) + 'px';  // 奇数列偏移
//     }
//     hex.style.position = 'absolute';
//     hex.style.left = offsetX + 'px';
//     hex.style.top = offsetY + 'px';
//     // 为六角形添加点击事件（可以根据需求修改）
//     hex.addEventListener('click', () => {
//       alert(`Hex at (${x}, ${y}) clicked!`);
//     });
//     board.appendChild(hex);
//   }
// }
// }
// // 绘制一个六角形网格
// function drawHexGrid(rows, cols) {
//   const offsetX = 50;
//   const offsetY = 50;
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const x = offsetX + col * hexWidth;
//       let y = offsetY + row * hexHeight;
//       // 使偶数行稍微偏移
//       if (col % 2 === 1) {
//         y += hexHeight / 2;
//       }
//       drawHex(x, y);
//     }
//   }
// }
// // 绘制网格
// drawHexGrid(10, 10);
// 获取六边形网格的容器
const hexGridContainer = document.getElementById('hex-grid');

// 设置六边形的尺寸和网格大小
const hexWidth = 60;  // 六边形的宽度
const hexHeight = 60; // 六边形的高度
const hexRadius = hexWidth / 2;  // 半径
const xCount = 10;   // 网格列数
const yCount = 10;   // 网格行数

// 每一行的偏移量
const offsetX = hexRadius * 2 * Math.sqrt(3) / 2;
const offsetY = hexHeight * 0.75;  // 垂直方向的偏移量

// 生成六边形网格
function generateHexGrid() {
    // 清空网格容器
    hexGridContainer.innerHTML = '';

    // 遍历每行
    for (let y = 0; y < yCount; y++) {
        const row = document.createElement('div');
        row.classList.add('row');

        // 遍历每列
        for (let x = 0; x < xCount; x++) {
            const hex = document.createElement('div');
            hex.classList.add('hex');

            // 根据列号，计算每个六边形的水平偏移量
            if (y % 2 === 0) {
                hex.style.marginLeft = `${x * offsetX}px`;
            } else {
                hex.style.marginLeft = `${(x * offsetX) + offsetX / 2}px`;
            }

            // 将每个六边形添加到行中
            row.appendChild(hex);
        }

        // 将每一行添加到网格容器
        hexGridContainer.appendChild(row);
    }
}

// 初始化六边形网格
generateHexGrid();
