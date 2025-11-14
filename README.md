v1.0:简单的前后端模板，无交互，打算用TS
正式的v1.0：只用原生的前端（html，css，js，webGL，反正用vue之类的框架还是会编译成原生的前端文件），后端用fastapi+unicorn（http服务器），并且用后端来管理前端文件。这个项目就用来做一些小游戏，一些有趣的前端页面。

运行：uvicorn main:app --reload  地址:127.0.0.1:8000
FastAPI 自动生成了 API 文档,可以访问：
Swagger UI：http://127.0.0.1:8000/docs
ReDoc：http://127.0.0.1:8000/redoc