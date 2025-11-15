from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI() # docs_url=None, redoc_url=None, openapi_url=None)
# 允许前端本地开发环境的跨域访问（开发阶段用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 注意生产环境应改为具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 静态文件托管构建好的前端页面
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/favicon.ico")
def get_favicon():
    return FileResponse("static/favicon.ico")


@app.get("/")
def read_index():
    return FileResponse("static/mainpage.html")


@app.get("/hello")
def hello():
    return {"message": "Hello!!!!"}


@app.get("/hello/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}


# 一个后端“状态”
backend_state = {
    "count": 0,
    "last_msg": ""
}


class Data(BaseModel):
    msg: str
    time: str


@app.post("/update")
async def update_backend(data: Data):
    # 更新后端状态
    backend_state["count"] += 1
    backend_state["last_msg"] = data.msg

    print("收到前端的数据:", data)
    print("当前状态:", backend_state)

    return {"status": f"已更新 {backend_state['count']} 次"}
