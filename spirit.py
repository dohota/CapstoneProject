import pygame
import random


class Fairy(pygame.sprite.Sprite):
    len = 400
    SCREEN_X = 1400
    SCREEN_Y = 750
    sx = 800
    sy = 750
    START_BACK = (150, 250, 200)
    GAME_BACK = (200, 200, 250)

    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.life = 1
        self.speed = 0
        self.image = pygame.image.load('./player-w.png')
        #精灵类中就有image属性，用self.image比较好
        self.rect = self.image.get_rect()
        self.jumping = False
        self.facing_right = True
        self.vel_x = 0
        self.vel_y = 0

    def _boundary(self):
        # 地图左右贯通
        if self.rect.left <= Fairy.len-20:
            self.rect.left = Fairy.SCREEN_X + 10
        if self.rect.left >= Fairy.SCREEN_X + 20:
            self.rect.left = Fairy.len - 20

    def _move(self):
        if self.jumping:
            self.vel_y = -12



        if self.direction == 'w':
            self.rect.top -= self.speed
        elif self.direction == 'a':
            self.rect.left -= self.speed
        elif self.direction == 'd':
            self.rect.left += self.speed

    def _write(self,t,x:float,y:float):
        font = pygame.font.Font('./WenDaoXingYeSong-2.ttf',30)
        text = font.render(t, True, (255, 0, 0), None)
        r = text.get_rect()
        r.topleft = (x, y)
        self.screen.blit(text, r)

    def minus_life(self,x):
        self.life -= x
        if self.life <= 0:
            self.life = 0
            self.kill()