import pygame
import sys
import random
import time


# 游戏时钟
clock = pygame.time.Clock()
FPS = 60


class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((30, 50))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.vel_x = random.choice([-2, 2])
        self.vel_y = 0
        self.jumping = False
        self.health = 50
        self.ai_timer = 0

    def update(self, platforms, player):
        # AI行为
        self.ai_timer += 1
        if self.ai_timer > 60:  # 每60帧改变一次行为
            self.ai_timer = 0
            # 简单的AI: 随机决定是否跳跃或改变方向
            if random.random() < 0.3:
                self.jump()
            if random.random() < 0.2:
                self.vel_x *= -1

        # 如果玩家在附近，向玩家移动
        if abs(self.rect.x - player.rect.x) < 200:
            if self.rect.x < player.rect.x:
                self.vel_x = 2
            else:
                self.vel_x = -2

        # 重力
        self.vel_y += 0.5

        # 水平移动
        self.rect.x += self.vel_x

        # 检查平台碰撞
        platform_hit = pygame.sprite.spritecollide(self, platforms, False)
        for platform in platform_hit:
            if self.vel_x > 0:  # 向右移动
                self.rect.right = platform.rect.left
                self.vel_x *= -1
            elif self.vel_x < 0:  # 向左移动
                self.rect.left = platform.rect.right
                self.vel_x *= -1

        # 垂直移动
        self.rect.y += self.vel_y

        # 检查平台碰撞
        platform_hit = pygame.sprite.spritecollide(self, platforms, False)
        for platform in platform_hit:
            if self.vel_y > 0:  # 下落
                self.rect.bottom = platform.rect.top
                self.vel_y = 0
                self.jumping = False
            elif self.vel_y < 0:  # 上升
                self.rect.top = platform.rect.bottom
                self.vel_y = 0

    def jump(self):
        if not self.jumping:
            self.vel_y = -10
            self.jumping = True


# 平台类
class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y, width, height):
        super().__init__()
        self.image = pygame.Surface((width, height))
        self.image.fill((100,100,80))
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y


# 创建精灵组
all_sprites = pygame.sprite.Group()
platforms = pygame.sprite.Group()
enemies = pygame.sprite.Group()

# 创建玩家
player = Player(100, 300)
all_sprites.add(player)

# 创建平台
ground = Platform(0, HEIGHT - 40, WIDTH, 40)
platforms.add(ground)
all_sprites.add(ground)

# 创建一些平台
platform_positions = [
    (100, 450, 200, 20),
    (400, 400, 200, 20),
    (200, 300, 200, 20),
    (500, 250, 200, 20),
    (100, 150, 200, 20)
]

for pos in platform_positions:
    p = Platform(*pos)
    platforms.add(p)
    all_sprites.add(p)

# 创建敌人
for i in range(3):
    enemy = Enemy(random.randint(100, WIDTH - 100), random.randint(100, HEIGHT - 200))
    enemies.add(enemy)
    all_sprites.add(enemy)

# 游戏循环
running = True
while running:
    # 保持游戏运行速度
    clock.tick(FPS)

    # 处理事件
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                player.jump()
            if event.key == pygame.K_f:
                if player.attack():
                    # 检查攻击是否命中敌人
                    for enemy in enemies:
                        if player.attack_rect.colliderect(enemy.rect):
                            enemy.health -= 10
                            if enemy.health <= 0:
                                enemy.kill()

    # 获取按键状态
    keys = pygame.key.get_pressed()
    player.vel_x = 0
    if keys[pygame.K_LEFT]:
        player.vel_x = -5
        player.facing_right = False
    if keys[pygame.K_RIGHT]:
        player.vel_x = 5
        player.facing_right = True

    # 更新
    player.update(platforms)

    for enemy in enemies:
        enemy.update(platforms, player)
        # 检查敌人是否碰到玩家
        if pygame.sprite.collide_rect(enemy, player):
            player.health -= 0.5  # 持续伤害
            if player.health <= 0:
                running = False

    # 渲染
    screen.fill(BLACK)

    # 绘制所有精灵
    all_sprites.draw(screen)

    # 绘制攻击范围(如果正在攻击)
    if player.attack_cooldown > 20:  # 攻击动画的前10帧
        pygame.draw.rect(screen, GREEN, player.attack_rect, 2)


class Page:

    def __init__(self):
        self.screen = pygame.display.set_mode((Fairy.sx,Fairy.sy))
        self.sound = Sound()

    def main(self):
        pygame.init()
        self.sound.back()
        pygame.display.set_caption("Hi Player")
        self.screen.fill(Fairy.START_BACK)
        self.write('Single Player',400, 20)
        self.write('Double Player', 400, 50)
        self.write('Web Player',400, 80)
        self.write('How to Play', 400, 120)
        while 1:
            time.sleep(0.1)
            pygame.display.update()
            for e in pygame.event.get():
                if e.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                if e.type == pygame.MOUSEBUTTONUP:
                    xx, yy = pygame.mouse.get_pos()  # 获取鼠标位置
                    if 400 <= xx <= 400 + 20 and 20 <= yy <= 20 + 10:
                        m = Logic()
                        m.start()

    def write(self,t,x:float,y:float):
        font = pygame.font.Font('E:/图片/WenDaoXingYeSong-2.ttf', 30)
        text = font.render(t, True, (255, 0, 0), None)
        r = text.get_rect()
        r.topleft = (x, y)
        self.screen.blit(text, r)

class Logic:
    #计时器的id（id是什么数字不重要）,好像id值不能重复
    id = 0
    id2 = 1
    #计算游戏是第几局/回合
    j = 1

    def __init__(self):
        pygame.display.set_caption("Monster Fight")
        self.screen = pygame.display.set_mode((Page.SCREEN_X,Page.SCREEN_Y),pygame.RESIZABLE)
        self.players = pygame.sprite.Group()
        self.enemys = pygame.sprite.Group()
        #self.maps = Map(self.screen)
        #self.sound = Sound()
        self.ran = [random.random()*10]
        self.rann = ['bedrock','brick','wool','stone']
        # 己方坦克有几条命
        self.life = 6
        # 计算一局游戏的存活时间，单位为秒
        self.timer = 0
        # 计算一局游戏的打怪数
        self.kill = 0

    def write(self,t,x:float,y:float):
        font = pygame.font.Font('E:/图片/WenDaoXingYeSong-2.ttf',30)
        text = font.render(t, True, (255, 0, 0), None)
        r = text.get_rect()
        r.topleft = (x, y)
        self.screen.blit(text, r)

    def player(self):
        #生成1个玩家
        p = Player(self.screen)
        self.players.add(p)

    def enemy(self,x=1):
        #生成x个Common敌人
        e = [Common(self.screen) for _ in range(x)]
        self.enemys.add(e)

    def restart(self):
        Logic.j += 1
        Logic.timer,Logic.score = 0, 0
        self.sound.horry()
        #清除所有子弹
        for i in self.players:
            i.all_bullet.empty()
        for j in self.enemys:
            j.all_bullet.empty()
        self.players.empty()#清除我方坦克
        self.enemys.empty()#清除敌方坦克
        self.maps.clear()#清除砖块
        mmmm = Page()
        mmmm.main()

    def minus_life(self,x=1):
        self.sound.boost()
        self.life -= x
        if self.life <= 0:
            self.restart()

    def ppp(self):
        pass

    def start(self):
        self.sound.back()
        self.player()
        # 绘制血条
        pygame.draw.rect(self.screen, RED, (10, 10, player.health * 2, 20))
        pygame.draw.rect(self.screen, WHITE, (10, 10, 200, 20), 2)
        self.maps.map1(random.randint(2, 10), random.randint(0, 2), 'bedrock')
        pygame.time.set_timer(Logic.id, random.randrange(3500, 8500, 100))
        pygame.time.set_timer(Logic.id2, 1000)
        while 1:
            self.screen.fill(Page.GAME_BACK)
            # 中文要借助外来字体显示
            self.write('玩家生命值:' + str(self.life), 20, 20)
            self.write('这是第' + str(Logic.j) + '轮游戏', 20, 50)
            self.write('游戏已经进行' + str(self.timer) + '秒', 20, 80)
            self.write('消灭' + str(self.kill) + '个怪物', 20, 110)
            for i in self.players:
                i.control()
                i.display()
            for j in self.enemys:
                j.ai()
                j.display()
            self.maps.display_all()
            time.sleep(0.07)  # 防止monster跑得太快
            pygame.display.update()
            for e in pygame.event.get():
                if e.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                elif e.type == Logic.id:
                    self.enemy()
                    self.maps.map1(2, -1, self.rann[random.randint(0, 3)])
                elif e.type == Logic.id2:
                    self.timer += 1
            self.ppp()


if __name__ == '__main__':
    m = Page()
    m.main()