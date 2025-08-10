from SpriteSheet import *
from button import Button  # fixed Button class you have now
import pygame
from pygame.math import Vector2
import sys
import time

background_image = pygame.image.load("IMG/stages/castle.png")
WIDTH, HEIGHT = 1050, 800
FPS = 60

GROUND_Y = HEIGHT - 20

GRAVITY = 1800
MOVE_SPEED = 30  
JUMP_SPEED = 700  

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

CHARACTERS = [
    ("Fighter", "IMG/sprites/Fighter/Idle.png"),
    ("Lightning-Mage", "IMG/sprites/Lightning-Mage/Idle.png"),
    ("Samurai", "IMG/sprites/Samurai/Idle.png"),
    ("Fire-Wizard", "IMG/sprites/Fire-Wizard/Idle.png"),
    ("Soldier", "IMG/sprites/Soldier/Idle.png"),
    ("Wanderer-Magican", "IMG/sprites/Wanderer-Magican/Idle.png")
]

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
        self.on_ground = True  # add this, needed for jumping

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
            self.animate("/Dead.png")
            self.alive = False

def resolve_attacks(p1, p2):
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

def get_first_frame(spritesheet_path, frame_width, frame_height, scale=1.0):
    sheet = pygame.image.load(spritesheet_path).convert_alpha()
    frame_surface = pygame.Surface((frame_width, frame_height), pygame.SRCALPHA)
    frame_surface.blit(sheet, (0, 0), pygame.Rect(0, 0, frame_width, frame_height))
    if scale != 1.0:
        new_size = (int(frame_width * scale), int(frame_height * scale))
        frame_surface = pygame.transform.scale(frame_surface, new_size)
    return frame_surface

def initialise_buttons(exclude_characters=[]):
    buttons = []
    start_x = 200
    start_y = 200
    padding_x = 300
    padding_y = 300

    font = pygame.font.SysFont("Consolas", 20)
    frame_w, frame_h = 130, 130
    scale = 1.5

    for i, (name, img_path) in enumerate(CHARACTERS):
        if name in exclude_characters:
            continue
        image = get_first_frame(img_path, frame_w, frame_h, scale)
        x = start_x + (i % 3) * padding_x
        y = start_y + (i // 3) * padding_y
        btn = Button(
            image=image,
            pos=(x, y),
            text_input=name,
            font=font,
            base_colour=WHITE,
            hovering_colour=YELLOW
            )
        buttons.append(btn)
    return buttons

def character_select_screen(screen):
    pygame.display.set_caption("Select Your Character")
    clock = pygame.time.Clock()
    selected_characters = []
    turn = 1  # Player 1 first

    while True:
        screen.fill(BLACK)
        font = pygame.font.SysFont("Consolas", 30)
        prompt = f"PLEASE SELECT YOUR CHARACTER PLAYER {turn}"
        text_surface = font.render(prompt, True, WHITE)
        screen.blit(text_surface, (50, 50))

        buttons = initialise_buttons(exclude_characters=selected_characters)

        mouse_pos = pygame.mouse.get_pos()

        for btn in buttons:
            btn.change_colour(mouse_pos)
            btn.update(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.MOUSEBUTTONDOWN:
                for btn in buttons:
                    if btn.check_for_input(mouse_pos):
                        selected_characters.append(btn.text_input)
                        print(f"Player {turn} chose {btn.text_input}")
                        turn += 1
                        if turn > 2:
                            return selected_characters  # both players picked

        pygame.display.flip()
        clock.tick(FPS)

def play_fighting_music():
    # Play music, volume settings
    pygame.mixer.music.load("sound_effects/OG_street_fighter_music.mp3")
    pygame.mixer.music.play(-1)  # loop
    pygame.mixer.music.set_volume(0.4)

class MainMenu:
    def __init__(self, screen):
        self.screen = screen
        self.font = pygame.font.SysFont("Consolas", 50)
        self.start_button = Button(
            image=None,
            pos=(WIDTH // 2, HEIGHT // 2),
            text_input="Press to start the game",
            font=self.font,
            base_colour=WHITE,
            hovering_colour=YELLOW
        )

    def run(self):
        clock = pygame.time.Clock()

        while True:
            self.screen.fill(BLACK)
            mouse_pos = pygame.mouse.get_pos()

            self.start_button.change_colour(mouse_pos)
            screen.blit(self.start_button.text, self.start_button.text_rect)

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()

                if event.type == pygame.MOUSEBUTTONDOWN:
                    if self.start_button.check_for_input(mouse_pos):
                        return

            pygame.display.flip()
            clock.tick(FPS)

def main(screen):
    pygame.display.set_caption("Street-Fighter-Inspired (prototype)")
    clock = pygame.time.Clock()

    selected_chars = character_select_screen(screen)
    player1_char, player2_char = selected_chars[0], selected_chars[1]

    p1 = Player(pos=(100, GROUND_Y), colour=BLUE, controls=CONTROLS["p1"], character_choice=player1_char, facing_right=True)
    p2 = Player(pos=(WIDTH - 150, GROUND_Y), colour=RED, controls=CONTROLS["p2"], character_choice=player2_char, facing_right=False)
    play_fighting_music()
    round_over = False
    round_winner = None

    while True:
        screen.fill(BLACK)
        dt = clock.tick(FPS) / 1000.0
        scaled_image = pygame.transform.scale(background_image, (WIDTH, HEIGHT))
        screen.blit(scaled_image, (0, 0))

        for e in pygame.event.get():
            if e.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

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
                    p1.animate("/Idle.png")
                    p2.animate("/Idle.png")
                    round_over = False
                    round_winner = None

                elif e.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()

        # holding keys
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

        pygame.draw.rect(screen, (30, 30, 40), (0, GROUND_Y + 1, WIDTH, HEIGHT - GROUND_Y))

        p1.draw(screen)
        p2.draw(screen)

        draw_health_bar(screen, 40, 20, 380, 26, p1.health, MAX_HEALTH, BLUE)
        draw_health_bar(screen, WIDTH - 420, 20, 380, 26, p2.health, MAX_HEALTH, RED)

        # Names
        font = pygame.font.SysFont("Consolas", 30)
        screen.blit(font.render("PLAYER 1", True, WHITE), (40, 46))
        screen.blit(font.render("PLAYER 2", True, WHITE), (WIDTH - 420, 46))

        # Draw simple round state
        if round_over:
            draw_text_center(screen, f"{round_winner} WINS!", 48, WIDTH//2, HEIGHT//2 - 40, GREEN)
            draw_text_center(screen, "Press R to rematch", 20, WIDTH//2, HEIGHT//2 + 10, WHITE)
        else:
            # show controls hint
            draw_text_center(screen, "P1: A/D move W jump F/G attacks | P2: Arrows move Up jump K/L attacks", 18, WIDTH//2, HEIGHT - 18, WHITE)

        pygame.display.flip()

if __name__ == "__main__":
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT),pygame.FULLSCREEN )  # normal windowed mode for menu

    menu = MainMenu(screen)
    menu.run()  # Show the main menu first
    
    main(screen)  # After starting, run the game loop
