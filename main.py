import json
from typing import List
import uvicorn
from fastapi import FastAPI, Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocket, WebSocketDisconnect
from models import Database

app = FastAPI() # docs_url=None, redoc_url=None, openapi_url=None)
# 静态文件托管构建好的前端页面
app.mount("/static", StaticFiles(directory="static"), name="static")
# 允许前端本地开发环境的跨域访问（开发阶段用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 注意生产环境应改为具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/favicon.ico")
def get_favicon():
    return FileResponse("static/favicon.ico")


@app.get("/")
def read_index():
    return FileResponse("static/mainpage.html")


@app.get("/intro")
def read_index():
    return FileResponse("static/personal.html")


@app.get("/intro/{user_id}")
def read_index():
    d1 = Database()
    data = d1.search_all()
    return {"data": data}
    # FastAPI 会自动将 列表、字典等 转换为 JSON 格式


@app.post("/intro")
def create_index(name: str, age: int):
    d2 = Database()
    # 调用 create_field 插入新数据
    result = d2.create_field(name, age)
    # 如果插入成功，返回成功消息
    if result is None:
        print("failed to create!")
    print("success!!")


@app.delete("/intro/{user_id}")
def del_index(user_id: int):
    d3 = Database()
    deleted_count = d3.delete_field(user_id)
    # 如果删除的记录数大于 0，表示删除成功
    if deleted_count > 0:
        print("User ID:" + str(user_id) + "has deleted successfully")
    else:
        print("cannot find User ID:" + str(user_id) )


@app.put("/intro/{user_id}")
def update_index(user_id: int, name: str = None, age: int = None):
    d4 = Database()
    # 更新数据
    updated_count = d4.update_field(user_id, name, age)
    # 如果更新的记录数大于 0，表示更新成功
    if updated_count > 0:
        print("User ID:" + str(user_id) + "has updated successfully")
        # return {"message": f"User with ID {user_id} updated successfully"}
    else:
        print("User ID:" + str(user_id) + "not found or no changes made")
        # return {"message": f"User with ID {user_id} not found or no changes made"}


@app.get("/conlang")
def read_index():
    return FileResponse("static/conlang.html")


@app.get("/chess")
async def read_index():
    return FileResponse("static/war.html")


@app.get("/chess2")
async def read_index():
    return FileResponse("static/warchess.html")


@app.get("/world")
def read_index():
    return FileResponse("static/rimworld.html")


@app.get("/game")
def read_index():
    return FileResponse("static/smallgame.html")


# 自定义静态文件响应（禁用缓存）
@app.get("/static/{filename}")
async def serve_static_file(filename: str):
    file_path = Path("static") / filename
    if file_path.exists() and file_path.is_file():
        response = FileResponse(file_path)
        # 设置缓存控制头，禁用缓存
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
        return response
    else:
        return {"error": "File not found"}


# 存储所有连接的 WebSocket 客户端
connected_clients: List[WebSocket] = []

# 存储每个客户端的位置信息
players_position = {}


# WebSocket 路由: 所有客户端都通过它连上服务端
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # 接受连接
    await websocket.accept()
    # 将连接的 WebSocket 添加到列表中
    connected_clients.append(websocket)
    print(f"新连接: {websocket.client}")

    try:
        while True:
            # 接收来自客户端的消息
            data = await websocket.receive_text()

            # 解析玩家的位置信息
            try:
                message = eval(data)  # 将JSON字符串解析成字典
                if message.get('type') == 'move':
                    player_id = websocket.client  # 假设WebSocket客户端是玩家的唯一标识
                    players_position[player_id] = (message['x'], message['y'])

                    # 广播给所有连接的客户端
                    await broadcast_player_positions()
            except Exception as e:
                print(f"消息处理失败: {e}")

    except WebSocketDisconnect:
        # 如果断开连接，将该客户端从列表中移除
        connected_clients.remove(websocket)
        print(f"连接断开: {websocket.client}")

        # 删除断开连接的玩家位置
        player_id = websocket.client
        if player_id in players_position:
            del players_position[player_id]

        # 广播更新后的所有玩家位置
        await broadcast_player_positions()


async def broadcast_player_positions():
    # 将所有玩家的位置广播到所有连接的客户端
    message = {
        "type": "update_positions",
        "players": players_position
    }
    # 将每个客户端的位置发送给所有连接的客户端
    for client in connected_clients:
        await client.send_text(json.dumps(message))


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
