const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {x: 200, y: 200, size: 20};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// 键盘控制移动
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp': player.y -= 10; break;
    case 'ArrowDown': player.y += 10; break;
    case 'ArrowLeft': player.x -= 10; break;
    case 'ArrowRight': player.x += 10; break;
  }
  draw();
  sendPosition(); // 发送位置到后端
});

draw();

// 连接 WebSocket 服务器
const socket = new WebSocket('ws://localhost:8000/ws');

// 连接打开
socket.addEventListener('open', () => {
  console.log('已连接 WebSocket');
});

// 接收消息
socket.addEventListener('message', (event) => {
  console.log('收到服务器消息:', event.data);
});

// 发送玩家位置
function sendPosition() {
  const data = {type: 'move', x: player.x, y: player.y};
  socket.send(JSON.stringify(data));
}