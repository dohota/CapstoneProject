from SpriteSheet import *
import pygame
from pygame.math import Vector2
import sys
import time

background_image = pygame.image.load("IMG/stages/castle.png")
WIDTH, HEIGHT = 1050, 800
FPS = 60

GROUND_Y = HEIGHT - 20

GRAVITY = 1800  # px/s^2
MOVE_SPEED = 30  # px/s
JUMP_SPEED = 700  # px/s

PLAYER_W, PLAYER_H = 48, 64
ATTACK_DURATION = 0.18
ATTACK_COOLDOWN = 0.4
LIGHT_DAMAGE = 8
HEAVY_DAMAGE = 16
MAX_HEALTH = 100

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (200, 40, 40)
BLUE = (60, 120, 200)
GREEN = (40, 200, 80)
GREY = (40, 40, 40)
YELLOW = (240, 230, 80)

CONTROLS = {
    "p1": {"left": pygame.K_a, "right": pygame.K_d, "jump": pygame.K_w, "light": pygame.K_f, "heavy": pygame.K_g, "crouch": pygame.K_s},
    "p2": {"left": pygame.K_LEFT, "right": pygame.K_RIGHT, "jump": pygame.K_UP, "light": pygame.K_KP1, "heavy": pygame.K_KP2, "crouch": pygame.K_DOWN,
           "light_alt": pygame.K_k, "heavy_alt": pygame.K_l}
}

class Player:
    def __init__(self, pos, colour, controls, character_choice, facing_right=True):
        self.pos = Vector2(pos)
        self.vel = Vector2(0, 0)
        self.w, self.h = PLAYER_W, PLAYER_H
        
        self.number_frames = 3
        self.character_choice = character_choice
        self.sprite_animation = "/idle.png"
        sprite_path = "IMG/sprites/" + character_choice + self.sprite_animation
        self.sheet = SpriteSheet(sprite_path)

        self.frame_w, self.frame_h = 130, 130

        self.frames = [self.sheet.get_image(i, self.frame_w, self.frame_h, scale=1.5) for i in range(4)]

        self.frame_index = 0
        self.image = self.frames[self.frame_index]

        self.frame_time = 0.1
        self.frame_speed = 1000000  # seconds per frame

        self.colour = colour
        self.controls = controls
        self.facing_right = facing_right

        self.health = MAX_HEALTH
        self.alive = True

        # Attack state
        self.attacking = False
        self.attack_time = 0.0
        self.attack_type = None
        self.attack_cooldown = 0.0
        self.lock_movement = False

        self.crouching = False
        self.state = "idle"

    def animate(self, animation):
        self.animating = True
        self.frame_index = 0
        sprite_path = "IMG/sprites/" + self.character_choice + animation
        self.sheet = SpriteSheet(sprite_path)
        self.frames = [self.sheet.get_image(i,self.frame_w, self.frame_h, scale=1.5) for i in range(4)]
        self.image = self.frames[self.frame_index]
                
        self.frame_speed = 0.1
        self.frame_time = 0.45

    def rect(self):
        return pygame.Rect(int(self.pos.x), int(self.pos.y - self.h), self.w, self.h)

    def attack_hitbox(self):
        """Return a rect for the attack hitbox based on facing and attack type."""
        if not self.attacking:
            return None
        reach = 36 if self.attack_type == "light" else 56
        width = reach
        height = int(self.h * (0.4 if self.crouching else 0.7))
        y_offset = int(self.h * 0.4) if not self.crouching else int(self.h * 0.2)
        if self.facing_right:
            x = self.pos.x + self.w
        else:
            x = self.pos.x - width
        y = self.pos.y - y_offset - height
        return pygame.Rect(int(x), int(y), int(width), int(height))

    def start_attack(self, atk_type):
        now = time.time()
        if self.attack_cooldown > 0 or self.attacking or not self.alive:
            return
        self.attacking = True
        self.attack_time = now
        self.attack_type = atk_type
        self.attack_cooldown = ATTACK_COOLDOWN
        self.lock_movement = True if atk_type == "heavy" else False

    def update(self, dt, keys):
        self.frame_time += dt
        if self.frame_time >= self.frame_speed:
            self.frame_time = 0
            self.frame_index += 1

            if self.frame_index >= len(self.frames):
                self.frame_index = 0

                if self.state in ("jumping", "attacking", "crouching"):
                    if keys[self.controls["left"]] or keys[self.controls["right"]]:
                        self.state = "running"
                        self.animate("/Run.png")
                    else:
                        self.state = "idle"
                        self.animate("/Idle.png")

            self.image = self.frames[self.frame_index]

        # Apply cooldown timers
        if self.attack_cooldown > 0:
            self.attack_cooldown = max(0.0, self.attack_cooldown - dt)
        if self.attacking:
            if time.time() - self.attack_time >= ATTACK_DURATION:
                self.attacking = False
                self.attack_type = None
                self.lock_movement = False

        move = 0
        if not self.lock_movement:
            if keys[self.controls["left"]]:
                move -= 1
            if keys[self.controls["right"]]:
                move += 1
        self.crouching = keys[self.controls["crouch"]]

        self.vel.x = move * MOVE_SPEED

        # Facing logic
        if move > 0:
            self.facing_right = True
        elif move < 0:
            self.facing_right = False

        if keys[self.controls["jump"]] and self.on_ground and not self.crouching:
            self.vel.y = -JUMP_SPEED
            self.on_ground = False

        self.vel.y += GRAVITY * dt

        self.pos += self.vel * dt

        # Floor collision
        if self.pos.y >= GROUND_Y:
            self.pos.y = GROUND_Y
            self.vel.y = 0
            self.on_ground = True

        self.pos.x = max(0, min(WIDTH - self.w, self.pos.x))


    def draw(self, surf):
        img = self.image
        if not self.facing_right:
            img = pygame.transform.flip(self.image, True, False)
        rect = img.get_rect()
        rect.midbottom = (self.pos.x + self.w // 2, int(self.pos.y))
        surf.blit(img, rect)

        hb = self.attack_hitbox()
        if hb:
            pygame.draw.rect(surf, (255, 0, 0, 50), hb, 2)

    def take_damage(self, amount):
        if not self.alive:
            return
        self.health = max(0, self.health - amount)
        if self.health <= 0:
            self.alive = False

def resolve_attacks(p1, p2):
    """Check attack hitboxes and apply damage."""
    # p1 hits p2?
    for attacker, defender in ((p1, p2), (p2, p1)):
        hb = attacker.attack_hitbox()
        if hb and defender.rect().colliderect(hb):
            dmg = LIGHT_DAMAGE if attacker.attack_type == "light" else HEAVY_DAMAGE
            if attacker.attacking:
                defender.take_damage(dmg)
                attacker.attacking = False
                attacker.attack_type = None
                attacker.lock_movement = False

def draw_health_bar(surf, x, y, w, h, current, maximum, colour):
    pygame.draw.rect(surf, GREY, (x, y, w, h))
    ratio = current / maximum
    inner_w = int((w - 4) * ratio)
    pygame.draw.rect(surf, colour, (x + 2, y + 2, inner_w, h - 4))
    pygame.draw.rect(surf, BLACK, (x, y, w, h), 2)

def draw_text_center(surf, text, size, x, y, colour=WHITE):
    font = pygame.font.SysFont("Consolas", size)
    r = font.render(text, True, colour)
    rect = r.get_rect(center=(x, y))
    surf.blit(r, rect)

def main():
    pygame.init()
    pygame.mixer.music.load("sound_effects/OG_street_fighter_music.mp3")
    pygame.mixer_music.play()
    pygame.mixer_music.set_volume(0.04)
    
    Character_select_screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.FULLSCREEN)
    Characters_selected = []
    while len(Characters_selected) < 2:
        Characters_selected.append(1)
        #Character_select_screen.blit()
    Fighting_screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.FULLSCREEN)

    pygame.display.set_caption("Street-Fighter-Inspired (prototype)")
    clock = pygame.time.Clock()

    #initialise the players
    p1 = Player(pos=(100, GROUND_Y), colour=BLUE, controls=CONTROLS["p1"], character_choice="Fighter", facing_right=True)

    p2 = Player(pos=(WIDTH - 150, GROUND_Y), colour=RED, controls=CONTROLS["p2"], character_choice="Fire-Wizard", facing_right=False)

    round_over = False
    round_winner = None

    font = pygame.font.SysFont("Consolas", 20)

    while True:
        dt = clock.tick(FPS) / 1000.0
        scaled_image = pygame.transform.scale(background_image, (WIDTH, HEIGHT))
        Fighting_screen.blit(scaled_image, (0, 0))

        for e in pygame.event.get():
            if e.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            # single key presses
            if e.type == pygame.KEYDOWN:

                if e.key == p1.controls["jump"]:
                    p1.state = "jumping" 
                    p1.pos.y -= 30
                    p1.animate("/Jump.png")

                elif e.key == p1.controls["crouch"]:
                    p1.state = "crouching"
                    p1.crouching = True
                    p1.animate("/Crouch.png")

                elif e.key == p1.controls["light"]:
                    p1.state = "attacking" 
                    p1.start_attack("light")
                    p1.animate("/light-attack.png")

                elif e.key == p1.controls["heavy"]:
                    p1.state = "attacking" 
                    p1.start_attack("heavy")
                    p1.animate("/heavy-attack.png")

                elif e.key == p2.controls["jump"]:
                    p2.state = "jumping" 
                    p2.pos.y -= 30
                    p2.animate("/Jump.png")

                elif e.key == p2.controls["crouch"]:
                    p2.state = "crouching"
                    p2.crouching = True
                    p2.animate("/Crouch.png")

                elif e.key == p2.controls.get("light") or e.key == p2.controls.get("light_alt"):
                    p2.state = "attacking" 
                    p2.start_attack("light")
                    p2.animate("/light-attack.png")

                elif e.key == p2.controls.get("heavy") or e.key == p2.controls.get("heavy_alt"):
                    p2.state = "attacking"
                    p2.start_attack("heavy")
                    p2.animate("/heavy-attack.png")

                elif e.key == pygame.K_r and round_over:
                    p1.health = MAX_HEALTH; p1.alive = True; p1.pos = Vector2(100, GROUND_Y); p1.vel = Vector2(0,0)
                    p2.health = MAX_HEALTH; p2.alive = True; p2.pos = Vector2(WIDTH - 150, GROUND_Y); p2.vel = Vector2(0,0)
                    round_over = False
                    round_winner = None

                elif e.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()

        # accounts for holding keys
        keys = pygame.key.get_pressed()

        if keys[p1.controls["left"]]:
            p1.pos.x -= 15
            if p1.state != "running": 
                p1.state = "running"
                p1.animate("/Run.png")
        elif keys[p1.controls["right"]]:
            p1.pos.x += 15
            if p1.state != "running":
                p1.state = "running"
                p1.animate("/Run.png")
        else:
            if p1.state not in ("idle", "jumping", "attacking", "crouching"):
                p1.state = "idle"
                p1.animate("/Idle.png")

        if keys[p2.controls["left"]]:
            p2.pos.x -= 15
            if p2.state != "running":
                p2.state = "running"
                p2.animate("/Run.png")
        elif keys[p2.controls["right"]]:
            p2.pos.x += 15
            if p2.state != "running":
                p2.state = "running"
                p2.animate("/Run.png")
        else:
            if p2.state not in ("idle", "jumping", "attacking", "crouching"):
                p2.state = "idle"
                p2.animate("/Idle.png")
        if not round_over:
            p1.update(dt, keys)
            p2.update(dt, keys)

            r1, r2 = p1.rect(), p2.rect()
            if r1.colliderect(r2):
                overlap = r1.clip(r2)
                if overlap.width < overlap.height:
                    if p1.pos.x < p2.pos.x:
                        p1.pos.x -= overlap.width / 2
                        p2.pos.x += overlap.width / 2
                    else:
                        p1.pos.x += overlap.width / 2
                        p2.pos.x -= overlap.width / 2

            resolve_attacks(p1, p2)

            if not p1.alive or not p2.alive:
                round_over = True
                round_winner = "Player 1" if p2.health == 0 else "Player 2" if p1.health == 0 else None
                round_end_time = time.time()

        pygame.draw.rect(Fighting_screen, (30, 30, 40), (0, GROUND_Y + 1, WIDTH, HEIGHT - GROUND_Y))

        # Draw players
        p1.draw(Fighting_screen)
        p2.draw(Fighting_screen)
        # Draw health bars
        draw_health_bar(Fighting_screen, 40, 20, 380, 26, p1.health, MAX_HEALTH, BLUE)
        draw_health_bar(Fighting_screen, WIDTH - 420, 20, 380, 26, p2.health, MAX_HEALTH, RED)
        # Names
        Fighting_screen.blit(font.render("PLAYER 1", True, WHITE), (40, 46))
        Fighting_screen.blit(font.render("PLAYER 2", True, WHITE), (WIDTH - 420, 46))

        # Draw simple round state
        if round_over:
            draw_text_center(Fighting_screen, f"{round_winner} WINS!", 48, WIDTH//2, HEIGHT//2 - 40, GREEN)
            draw_text_center(Fighting_screen, "Press R to rematch", 20, WIDTH//2, HEIGHT//2 + 10, WHITE)
        else:
            # show controls hint
            draw_text_center(Fighting_screen, "P1: A/D move W jump F/G attacks | P2: Arrows move Up jump K/L attacks", 18, WIDTH//2, HEIGHT - 18, WHITE)

        pygame.display.flip()

if __name__ == "__main__":
    main()