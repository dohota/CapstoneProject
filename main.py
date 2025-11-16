import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocket, WebSocketDisconnect
from sql.models import Database

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


@app.delete("/intro")
def del_index(user_id: int):
    d3 = Database()
    deleted_count = d3.delete_field(user_id)
    # 如果删除的记录数大于 0，表示删除成功
    if deleted_count > 0:
        print("User ID:" + str(user_id) + "has deleted successfully")
    else:
        print("cannot find User ID:" + str(user_id) )


@app.put("/intro")
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


@app.get("/intro/{num}")
async def read_item(num: int):
    return {"people_id": num}


@app.get("/conlang")
def read_index():
    return FileResponse("static/conlang.html")


@app.get("/chess")
async def read_index():
    return FileResponse("static/warchess.html")


@app.get("/world")
def read_index():
    return FileResponse("static/rimworld.html")


@app.get("/game")
def read_index():
    return FileResponse("static/smallgame.html")


clients = []


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.append(ws)
    try:
        while True:
            data = await ws.receive_text()
            print("收到前端数据:", data)
            # 可以广播给其他客户端
            for client in clients:
                if client != ws:
                    await client.send_text(data)
    except WebSocketDisconnect:
        clients.remove(ws)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
