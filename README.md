运行：uvicorn main:app --reload  地址:127.0.0.1:8000
FastAPI 自动生成了 API 文档:
Swagger UI：http://127.0.0.1:8000/docs
ReDoc：http://127.0.0.1:8000/redoc

pycharm右侧点击数据库就可以查看数据库内容了，目前就一个数据库，一个items表
（另一个表是sqlite系统自己创建的）

每次增删改都会调用get请求加载全部内容（可能这样性能不够好）
增加：post：前端给后端发，数据库更新
删除：delete：前端给后端发，数据库更新
改：put，前端给后端发，数据库更新
查：get：前端给后端发一个数字表示不同类型的查找，后端返回前端查找内容
（也可以先拿到数据库全部内容存在前端，然后再筛选
数据分页：暂时没想好怎么搞
v2.2:
实现了很大地图的滚动，但是仔细发现地图还是有边界的
（不知道以后能不能像MC那样无限地图）
缺点：现在就一个html和一个js，后期应该需要多个js+一个html
 * 核心概念：
 * 1. World Space (世界坐标): 单位在游戏世界里的绝对像素位置。
 * 2. Screen Space (屏幕坐标): 最终画在 Canvas 上的位置。
 * * 公式：
 * ScreenX = WorldX - CameraX + ScreenCenterX
 * WorldX  = ScreenX - ScreenCenterX + CameraX

v2.3:写成了面向对象的形式，便于多文件，而且项目更加清晰

