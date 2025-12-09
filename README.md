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
 * World Space (世界坐标): 单位在游戏世界里的绝对像素位置。
 * Screen Space (屏幕坐标): 最终画在 Canvas 上的位置。
 * ScreenX = WorldX - CameraX + ScreenCenterX
 * WorldX  = ScreenX - ScreenCenterX + CameraX
v2.7:每次进入终端请输入：source venv/bin/activate （激活虚拟环境）
两周没写这个代码，换了个macbook，vscode代替了pycharm，现在有点不习惯
该版本主要调整一下之前的问题，使得代码更加美观

实现滚轮滚动放大和缩小地图
充实游戏玩法，各种算子
实现多种3D地形
实现渲染-逻辑-数据的分离（各种数据用json储存）
并且还要模仿 文明6，各种战棋，维多利亚3
   
单人模式：只有一个玩家生存发展，对付电脑---类似矮人要塞/rimworld，模拟经营
多人模式：可以多个不同的玩家和电脑联机，----兵棋战斗类，至少两个玩家对抗
