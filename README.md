运行：uvicorn main:app --reload  地址:127.0.0.1:8000
FastAPI 自动生成了 API 文档:
Swagger UI：http://127.0.0.1:8000/docs
ReDoc：http://127.0.0.1:8000/redoc

做个战棋游戏（先做纯前端的，可以试试webGL或webGPU）
做个示例小游戏（用websocket联机）

v1.4:保持现在的html引用css，js的路径，就能正常访问了！
而且之前app=fastapi（）不小心写了两遍，所以会出现一点问题

v1.5:封装好了database类，并且其单元测试成功.
pycharm右侧点击数据库就可以查看数据库内容了，目前就一个数据库，一个items表
（另一个表是sqlite系统自己创建的）

v1.6:前后端协作进行CRUD操作，同时数据还要分页