import os
import math
import random
import subprocess

WIDTH = 600
HEIGHT = 400

STYLES = {
    "tropical-modern": ["#f6efe6", "#c9a97c", "#3a9d86", "#2f2b23", "#c96244"],
    "contemporary-thai": ["#f1e8dd", "#6b4b2a", "#2a2a2a", "#4b6b57", "#bfa57a"],
    "resort-minimal": ["#f4f1eb", "#d9d1c3", "#b4a996", "#7f7569", "#4e4a45"],
    "rustic-minimal": ["#f3efe8", "#d2c6b4", "#8b7f73", "#5f544c", "#a67c52"],
    "mid-century-tropical": ["#f2e8d8", "#d6b38e", "#8c5f3c", "#5a6b5f", "#c56b4e"],
    "eco-modern": ["#eef2e8", "#c7d0bf", "#8b9a86", "#4b5a4c", "#a89b7a"],
}

SECTION_COUNTS = {
    "architecture": 8,
    "materials-texture": 12,
    "landscape-outdoor-living": 8,
    "interior-mood-details": 8,
}


def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def lerp(a, b, t):
    return int(a + (b - a) * t)


def make_buffer(color):
    row = bytes(color) * WIDTH
    return bytearray(row * HEIGHT)


def set_pixel(buf, x, y, color):
    if x < 0 or y < 0 or x >= WIDTH or y >= HEIGHT:
        return
    idx = (y * WIDTH + x) * 3
    buf[idx : idx + 3] = bytes(color)


def draw_rect(buf, x, y, w, h, color):
    x0 = max(0, x)
    y0 = max(0, y)
    x1 = min(WIDTH, x + w)
    y1 = min(HEIGHT, y + h)
    row = bytes(color) * (x1 - x0)
    for yy in range(y0, y1):
        idx = (yy * WIDTH + x0) * 3
        buf[idx : idx + (x1 - x0) * 3] = row


def draw_circle(buf, cx, cy, r, color):
    r2 = r * r
    for y in range(cy - r, cy + r + 1):
        for x in range(cx - r, cx + r + 1):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r2:
                set_pixel(buf, x, y, color)


def apply_vertical_gradient(buf, top, bottom):
    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        color = (
            lerp(top[0], bottom[0], t),
            lerp(top[1], bottom[1], t),
            lerp(top[2], bottom[2], t),
        )
        row = bytes(color) * WIDTH
        idx = y * WIDTH * 3
        buf[idx : idx + WIDTH * 3] = row


def add_noise(buf, rng, density, color):
    total = int(WIDTH * HEIGHT * density)
    for _ in range(total):
        x = rng.randrange(0, WIDTH)
        y = rng.randrange(0, HEIGHT)
        set_pixel(buf, x, y, color)


def generate_architecture(palette, variant, rng):
    sky = palette[0]
    ground = palette[1]
    accent = palette[2]
    buf = make_buffer(sky)
    apply_vertical_gradient(buf, sky, (255, 255, 255))
    draw_rect(buf, 0, int(HEIGHT * 0.65), WIDTH, int(HEIGHT * 0.35), ground)

    base_y = int(HEIGHT * 0.35)
    widths = [int(WIDTH * 0.25), int(WIDTH * 0.28), int(WIDTH * 0.22)]
    offsets = [int(WIDTH * 0.1), int(WIDTH * 0.4), int(WIDTH * 0.7)]
    for i, w in enumerate(widths):
        h = int(HEIGHT * (0.25 + 0.1 * ((variant + i) % 3)))
        draw_rect(buf, offsets[i], base_y - h, w, h, accent)
        draw_rect(
            buf,
            offsets[i] + int(w * 0.2),
            base_y - int(h * 0.6),
            int(w * 0.6),
            int(h * 0.2),
            sky,
        )
    return buf


def generate_landscape(palette, variant, rng):
    sky = palette[0]
    foliage = palette[2]
    pool = palette[3]
    deck = palette[1]
    buf = make_buffer(sky)
    apply_vertical_gradient(buf, sky, (245, 250, 248))
    draw_rect(buf, 0, int(HEIGHT * 0.55), WIDTH, int(HEIGHT * 0.45), foliage)
    draw_rect(
        buf,
        int(WIDTH * 0.12),
        int(HEIGHT * 0.62),
        int(WIDTH * 0.5),
        int(HEIGHT * 0.2),
        pool,
    )
    draw_rect(
        buf,
        int(WIDTH * 0.65),
        int(HEIGHT * 0.65),
        int(WIDTH * 0.25),
        int(HEIGHT * 0.18),
        deck,
    )
    for _ in range(6 + variant):
        draw_circle(
            buf,
            rng.randrange(0, WIDTH),
            rng.randrange(int(HEIGHT * 0.45), HEIGHT),
            rng.randrange(6, 18),
            palette[2],
        )
    return buf


def generate_interior(palette, variant, rng):
    warm = palette[0]
    accent = palette[4]
    buf = make_buffer(warm)
    apply_vertical_gradient(buf, warm, palette[1])
    draw_rect(
        buf,
        int(WIDTH * 0.15),
        int(HEIGHT * 0.2),
        int(WIDTH * 0.7),
        int(HEIGHT * 0.5),
        (255, 255, 255),
    )
    draw_rect(
        buf,
        int(WIDTH * 0.18),
        int(HEIGHT * 0.25),
        int(WIDTH * 0.25),
        int(HEIGHT * 0.3),
        accent,
    )
    draw_rect(
        buf,
        int(WIDTH * 0.5),
        int(HEIGHT * 0.3),
        int(WIDTH * 0.28),
        int(HEIGHT * 0.25),
        palette[2],
    )
    add_noise(buf, rng, 0.002, palette[3])
    return buf


def generate_material(palette, variant, rng):
    base = palette[0]
    mid = palette[1]
    accent = palette[2]
    deep = palette[3]
    warm = palette[4]
    buf = make_buffer(base)

    if variant == 1:  # teak slats
        for x in range(0, WIDTH, 18):
            draw_rect(buf, x, 0, 10, HEIGHT, warm)
        add_noise(buf, rng, 0.01, mid)
    elif variant == 2:  # limestone
        apply_vertical_gradient(buf, base, mid)
        add_noise(buf, rng, 0.02, accent)
    elif variant == 3:  # rattan weave
        for x in range(0, WIDTH, 22):
            draw_rect(buf, x, 0, 6, HEIGHT, mid)
        for y in range(0, HEIGHT, 22):
            draw_rect(buf, 0, y, WIDTH, 6, accent)
    elif variant == 4:  # plaster
        apply_vertical_gradient(buf, base, warm)
        add_noise(buf, rng, 0.03, mid)
    elif variant == 5:  # linen weave
        for x in range(0, WIDTH, 14):
            draw_rect(buf, x, 0, 2, HEIGHT, mid)
        for y in range(0, HEIGHT, 14):
            draw_rect(buf, 0, y, WIDTH, 2, mid)
    elif variant == 6:  # terrazzo
        add_noise(buf, rng, 0.05, accent)
        for _ in range(900):
            draw_circle(
                buf,
                rng.randrange(0, WIDTH),
                rng.randrange(0, HEIGHT),
                rng.randrange(2, 6),
                warm,
            )
    elif variant == 7:  # bronze hardware
        draw_rect(buf, 0, 0, WIDTH, HEIGHT, deep)
        for x in range(0, WIDTH, 26):
            draw_rect(buf, x, 0, 4, HEIGHT, warm)
        add_noise(buf, rng, 0.01, mid)
    elif variant == 8:  # basalt stone
        draw_rect(buf, 0, 0, WIDTH, HEIGHT, deep)
        add_noise(buf, rng, 0.04, mid)
    elif variant == 9:  # charred timber
        draw_rect(buf, 0, 0, WIDTH, HEIGHT, deep)
        for x in range(0, WIDTH, 16):
            draw_rect(buf, x, 0, 8, HEIGHT, accent)
    elif variant == 10:  # travertine
        for y in range(0, HEIGHT, 24):
            tone = (
                lerp(base[0], mid[0], (y % 48) / 48),
                lerp(base[1], mid[1], (y % 48) / 48),
                lerp(base[2], mid[2], (y % 48) / 48),
            )
            draw_rect(buf, 0, y, WIDTH, 12, tone)
    elif variant == 11:  # clay tile
        for y in range(0, HEIGHT, 36):
            for x in range(0, WIDTH, 36):
                draw_rect(buf, x, y, 30, 30, warm)
        add_noise(buf, rng, 0.01, mid)
    else:  # cane panels
        for y in range(0, HEIGHT, 20):
            for x in range(0, WIDTH, 20):
                draw_rect(buf, x + (y // 20 % 2) * 6, y, 12, 12, accent)
        add_noise(buf, rng, 0.008, mid)
    return buf


def write_ppm(path, buf):
    with open(path, "wb") as f:
        f.write(f"P6\n{WIDTH} {HEIGHT}\n255\n".encode("ascii"))
        f.write(buf)


def generate_all():
    root = os.path.join(os.getcwd(), "public", "moodboard")
    for style_slug, palette in STYLES.items():
        palette_rgb = [hex_to_rgb(color) for color in palette]
        for section, count in SECTION_COUNTS.items():
            dir_path = os.path.join(root, style_slug, section)
            os.makedirs(dir_path, exist_ok=True)
            for idx in range(1, count + 1):
                rng = random.Random(hash((style_slug, section, idx)))
                if section == "architecture":
                    buf = generate_architecture(palette_rgb, idx, rng)
                elif section == "landscape-outdoor-living":
                    buf = generate_landscape(palette_rgb, idx, rng)
                elif section == "interior-mood-details":
                    buf = generate_interior(palette_rgb, idx, rng)
                else:
                    buf = generate_material(palette_rgb, idx, rng)

                ppm_path = os.path.join(dir_path, f"{idx:02d}.ppm")
                jpg_path = os.path.join(dir_path, f"{idx:02d}.jpg")
                write_ppm(ppm_path, buf)
                subprocess.run(
                    ["sips", "-s", "format", "jpeg", ppm_path, "--out", jpg_path],
                    check=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                os.remove(ppm_path)


if __name__ == "__main__":
    generate_all()
