# FunnyGame
# ├── src
# │   ├── main.py              # FastAPI 启动入口
# │   ├── database.py          # SQLite 相关
# │   ├── models.py            # 数据模型（Pydantic / ORM）
# │   ├── routers/             # 路由模块
# │   │   └── api.py
# │   └── static/              # 前端构建后的静态文件 (html/css/js)
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def read_index():
    return FileResponse("static/index.html")


@app.get("/api/hello")
def hello():
    return {"message": "Hello!!!!"} #json格式
