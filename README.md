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
每次进入终端请输入：source venv/bin/activate （激活虚拟环境）
这些操作都要cd CapstoneProject: 运行程序：python main.py。终止程序：在终端里control+c。git提交代码

v2.8:
实现了从外部加载常量（类似json），然后形成一个类
实现滚轮滚动放大和缩小地图
实现多种3D地形

该游戏有单人模式（偏向模拟经营，打ai，类似矮人要塞/rimworld/mc），也有多人模式（类似回合制的魔兽争霸，兵棋，文明6，维多利亚3）
之后项目大了肯定需要ecs架构。每个实体就只有一个id，通过挂载不同组件实现功能，便于生成大批量单位。系统用于处理各个组件
