# Плашки глав: тёмная каменная полоса + крупное светлое имя + римская цифра.
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PACK = Path(r"C:\Users\User\curseforge\minecraft\Instances\____ _ _____ 2\global_packs\required_resources\sevenfold_questbook")
OUT = PACK / "assets" / "sevenfold" / "textures" / "questbook" / "plaques"
OUT.mkdir(parents=True, exist_ok=True)
F_PIX = r"C:\Users\User\Documents\AgentHere\pack-title\fonts\Silkscreen-Bold.ttf"
F_SER = r"C:\Windows\Fonts\georgiai.ttf"

GOLD = (206, 166, 52); HI = (250, 228, 152); DIM = (118, 90, 22)
PLATE = (22, 20, 18); PLATE2 = (36, 32, 28)
W, H = 1024, 190

CHAPTERS = [
    ("the_first_breath", "I", "ПЕРВОЕ ДЫХАНИЕ", "с чего начинается путь"),
    ("the_hearing", "II", "СЛУХ", "прокачка и дерево навыков"),
    ("familiars", "III", "ФАМИЛЬЯРЫ", "второй голос"),
    ("the_eyes", "IV", "ГЛАЗА", "двенадцать трофеев и страховка"),
    ("magic", "V", "МАГИЯ", "голоса и школы"),
    ("kitchen", "VI", "КУХНЯ", "рацион и сытость"),
    ("rats", "VII", "КРЫСЫ", "для любителей крысок"),
    ("dragons", "VIII", "ДРАКОНЫ", "гнездовья и сталь"),
    ("gates", "IX", "ВРАТА И ВЛАДЫКИ", "боссы и награды"),
    ("tales", "X", "ПРЕДАНИЯ", "лор, который открывается сам"),
]

for fname, num, title, sub in CHAPTERS:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # каменная полоса
    band = [14, 26, W - 14, H - 26]
    d.rounded_rectangle(band, radius=14, fill=PLATE + (238,), outline=GOLD + (235,), width=3)
    d.rounded_rectangle([band[0] + 5, band[1] + 5, band[2] - 5, band[3] - 5], radius=11,
                        outline=DIM + (140,), width=1)
    # верхний блик и нижняя тень
    d.line([(band[0] + 16, band[1] + 4), (band[2] - 16, band[1] + 4)], fill=(255, 244, 214, 60), width=2)
    d.line([(band[0] + 16, band[3] - 4), (band[2] - 16, band[3] - 4)], fill=(0, 0, 0, 120), width=2)

    ft = ImageFont.truetype(F_PIX, 46)
    fn = ImageFont.truetype(F_PIX, 24)
    fs = ImageFont.truetype(F_SER, 24)

    cy = H // 2
    # медальон с номером
    rx, r = 76, 32
    d.polygon([(rx, cy - r), (rx + r, cy), (rx, cy + r), (rx - r, cy)],
              fill=(16, 15, 14, 245), outline=GOLD + (255,))
    nw = d.textlength(num, font=fn)
    d.text((rx - nw / 2, cy - 15), num, font=fn, fill=HI + (255,))

    # название: тень, обводка, заливка
    tw = d.textlength(title, font=ft)
    tx = 130 + (W - 130 - 30 - tw) / 2
    ty = cy - 46
    d.text((tx + 3, ty + 3), title, font=ft, fill=(0, 0, 0, 220))
    d.text((tx, ty), title, font=ft, fill=(246, 240, 226, 255), stroke_width=2, stroke_fill=(58, 44, 16, 200))

    # подпись
    sw = d.textlength(sub, font=fs)
    d.text(((W + 100 - sw) / 2, cy + 14), sub, font=fs, fill=(176, 164, 143, 240))

    # золотые точки по краям полосы
    for x in (band[0] + 14, band[2] - 14):
        d.ellipse([x - 4, cy - 4, x + 4, cy + 4], fill=GOLD + (220,))

    glow = img.filter(ImageFilter.GaussianBlur(6))
    img.alpha_composite(glow)
    img.save(OUT / (fname + ".png"), optimize=True)
    print("  ", fname)
