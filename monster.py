from spirit import *


class Player(Fairy):
    def __init__(self, screen):
        Fairy.__init__(self)
        self.screen = screen
        self.all_bullet = pygame.sprite.Group()
        self.ran = [0, 4, 0, 1, 1]
        self.life = 6
        self.weapon_id = 1
        self.speed = 0.5
        self.rect = self.image.get_rect()
        self.rect.topleft = [random.randrange(Fairy.len, Fairy.SCREEN_X - Fairy.len, 80),
                             random.randrange(30, Fairy.SCREEN_Y, 20)]

    def control(self):
        super()._boundary()
        super()._move()
        key_pressed = pygame.key.get_pressed()
        if key_pressed[pygame.K_w]:
            if not self.jumping:
                self.jumping = True

        if key_pressed[pygame.K_a]:
            self.facing_right = False
            self.rect.left -= self.speed
        elif key_pressed[pygame.K_d]:
            self.facing_right = True
            self.rect.left += self.speed
        elif key_pressed[pygame.K_f]:
            pass
            # 控制子弹发射的频率
            # rrr = random.randint(1, 5)
            # if self.weapon_id == 1:
            #     if rrr == 3:
            #         b = Bullet(self.direction, self.rect)
            #         self.all_bullet.add(b)
            # elif self.weapon == 2:
            #     if rrr == 2:
            #         b2 = Biao(self.direction, self.rect)
            #         self.all_bullet.add(b2)

        elif key_pressed[pygame.K_q]:
            self.weapon_id -= 1
            if self.weapon_id <= 1:
                self.weapon_id = 1

        elif key_pressed[pygame.K_z]:
            self.weapon_id += 1

    def display(self):
        super()._write('Weapon:'+str(self.weapon_id), 20, 140)
        self.screen.blit(self.image, self.rect)
        for i in self.all_bullet:
            i.move_straight_forward()
        self.all_bullet.draw(self.screen)

        # # 水平移动
        # self.rect.x += self.vel_x
        # 垂直移动
        # self.rect.y += self.vel_y
        # # 检查平台碰撞
        # platform_hit = pygame.sprite.spritecollide(self, platforms, False)
        # for platform in platform_hit:
        #     if self.vel_x > 0:  # 向右移动
        #         self.rect.right = platform.rect.left
        #     elif self.vel_x < 0:  # 向左移动
        #         self.rect.left = platform.rect.right
        # for platform in platform_hit:
        #     if self.vel_y > 0:  # 下落
        #         self.rect.bottom = platform.rect.top
        #         self.vel_y = 0
        #         self.jumping = False
        #     elif self.vel_y < 0:  # 上升
        #         self.rect.top = platform.rect.bottom
        #         self.vel_y = 0


class Common(Fairy):
    def __init__(self,screen):
        Fairy.__init__(self)
        self.screen = screen
        self.image = pygame.image.load('./dir-w.png')
        self.ran = [0, 4, 0]
        self.speed = random.randint(1, 5)
        self.rect = self.image.get_rect()
        self.rect.topleft = [Fairy.len+random.random() * (Fairy.SCREEN_X-Fairy.len),
                             random.random() * Fairy.SCREEN_Y]
        self.all_bullet = pygame.sprite.Group()

    def ai(self):
        super()._boundary()
        self.ran[0] += 1
        if self.ran[0] % 30 == 0:
            bb = Bullet(self.direction, self.rect)
            self.all_bullet.add(bb)
        elif self.ran[1] % 4 == 0:
            self.image = pygame.image.load('./dir-w.png')
            self.direction = 'w'
            self.rect.top -= self.speed
            if self.ran[0] % 20 == 0:
                self.ran[1] = random.randint(4,7)
        elif self.ran[1] % 4 == 1:
            self.image = pygame.transform.rotate(pygame.image.load('./dir-w.png'), 180)
            self.direction = 's'
            self.rect.top += self.speed
            if self.ran[0] % 20 == 0:
                self.ran[1] = random.randint(4,7)
        elif self.ran[1] % 4 == 2:
            self.image = pygame.transform.rotate(pygame.image.load('./dir-w.png'), 90)
            self.direction = 'a'
            self.rect.left -= self.speed
            if self.ran[0] % 20 == 0:
                self.ran[1] = random.randint(4,7)
        elif self.ran[1] % 4 == 3:
            self.image = pygame.transform.rotate(pygame.image.load('./dir-w.png'), -90)
            self.direction = 'd'
            self.rect.left += self.speed
            if self.ran[0] % 20 == 0:
                self.ran[1] = random.randint(4,7)

    def display(self):
        self.screen.blit(self.image, self.rect)
        for i in self.all_bullet:
            i.move_straight_forward()
        self.all_bullet.draw(self.screen)

