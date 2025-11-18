const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {x: 200, y: 200, size: 20};

// 存储所有玩家的位置
let players = {};

// 更新画面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制所有玩家
  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = 'blue';
    ctx.fillRect(p.x, p.y, player.size, player.size);
  }
}

// 键盘控制移动
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp': player.y -= 8; break;
    case 'ArrowDown': player.y += 8; break;
    case 'ArrowLeft': player.x -= 9; break;
    case 'ArrowRight': player.x += 9; break;
  }
  draw();
  sendPosition(); // 发送位置到后端
});


// 连接 WebSocket 服务器
const socket = new WebSocket('ws://localhost:8000/ws');
// 连接打开
socket.addEventListener('open', () => {
  console.log('已连接 WebSocket');
});
draw();
// 接收消息
socket.addEventListener('message', (event) => {
  try {
    const message = JSON.parse(event.data); // 解析服务器传来的消息
    if (message.type === 'update_positions') {
      players = message.players; // 更新所有玩家的位置信息
      console.log(message.players);
      draw(); // 更新画面
    }
  } catch (e) {
    console.error('消息解析错误:', e);
  }
});

// 发送玩家位置
function sendPosition() {
  if (socket.readyState === WebSocket.OPEN) {
    const data = {type: 'move', x: player.x, y: player.y};
    socket.send(JSON.stringify(data)); // 发送位置更新
  }else {
    console.log('WebSocket连接已关闭，无法发送消息');
  }
}
