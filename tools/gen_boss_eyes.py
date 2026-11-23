# boss_eyes: глаза End Remastered как трофеи боссов + страховочные ритуалы.
#
# 1. Дроп: каждый глаз падает с конкретного босса, 1 ролл, 1 предмет,
#    один раз на игрока (условие "у убийцы нет ачивки", ачивка вешается на предмет).
# 2. Страховка: ритуал на Острове Истоков (alshanex_familiars:ritual_recipe).
#    У ритуала РОВНО 4 статуи (north/south/east/west на 2 блока), поэтому
#    рецепт = центр (глаз Эндера) + 4 предмета по 1 шт.
import json, sys, zipfile
from pathlib import Path

INST = Path(r"C:\Users\User\curseforge\minecraft\Instances\____ _ _____ 2")
MODS = INST / "mods"
DP = INST / "datapacks" / "boss_eyes"
HARDREC = INST / "datapacks" / "hard_recipes" / "data" / "eldritch_familiars" / "recipe"

# (маска jar, namespace, имя сущности, [(предмет, шанс)])
BOSSES = [
    ("darkdoppelganger*",      "darkdoppelganger",      "dark_doppelganger",     [("endrem:old_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "kobolediator",          [("endrem:rogue_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "ignis",                 [("endrem:nether_eye", 1.0)]),
    ("block_factorys_bosses*", "block_factorys_bosses", "yeti",                  [("endrem:cold_eye", 1.0)]),
    ("block_factorys_bosses*", "block_factorys_bosses", "pirate_captain",        [("endrem:black_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "ancient_remnant",       [("endrem:lost_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "netherite_monstrosity", [("endrem:cursed_eye", 1.0)]),
    ("block_factorys_bosses*", "block_factorys_bosses", "kraken",                [("endrem:exotic_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "the_harbinger",         [("endrem:evil_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "ender_guardian",        [("endrem:cryptic_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "scylla",                [("endrem:corrupted_eye", 1.0)]),
    ("L_Ender*",               "cataclysm",             "maledictus",            [("endrem:undead_soul", 1.0)]),
]

VANILLA = {
    "evoker":         [("endrem:magical_eye", 1.0)],
    "wither":         [("endrem:wither_eye", 1.0)],
    "elder_guardian": [("endrem:guardian_eye", 1.0)],
    "witch":          [("endrem:witch_pupil", 0.35)],
    "skeleton_horse": [("endrem:undead_soul", 0.30)],
}

# трофей конкретного босса для страховочного ритуала
TROPHY = {
    "endrem:old_eye":       "darkdoppelganger:doppelganger_ring",
    "endrem:rogue_eye":     "cataclysm:kobolediator_skull",
    "endrem:nether_eye":    "cataclysm:ignitium_ingot",
    "endrem:cold_eye":      "block_factorys_bosses:ice_gauntlet",
    "endrem:black_eye":     "block_factorys_bosses:pirate_saber",
    "endrem:lost_eye":      "cataclysm:remnant_skull",
    "endrem:cursed_eye":    "cataclysm:monstrous_horn",
    "endrem:exotic_eye":    "block_factorys_bosses:kraken_tooth",
    "endrem:evil_eye":      "cataclysm:witherite_block",
    "endrem:cryptic_eye":   "cataclysm:gauntlet_of_guard",
    "endrem:corrupted_eye": "cataclysm:essence_of_the_storm",
    "endrem:magical_eye":   "minecraft:totem_of_undying",
    "endrem:wither_eye":    "minecraft:nether_star",
    "endrem:guardian_eye":  "minecraft:heart_of_the_sea",
}

# премиум-предметы по убыванию ценности; в ритуал идут первые три, не совпадающие с трофеем
PREMIUM = [
    "minecraft:nether_star",
    "cataclysm:ignitium_ingot",
    "tag:boss_eyes:dragonsteel_ingots",
    "discerning_the_eldritch:starmetal_ingot",
    "hazennstuff:prismatic_shard",
    "discerning_the_eldritch:eldritch_soul_shard",
]


def pool(items):
    entries = []
    for item, chance in items:
        entries.append({"type": "minecraft:item", "name": item,
                        "functions": [{"function": "set_count", "count": 1}]})
        if chance < 1.0:
            entries.append({"type": "minecraft:empty", "weight": max(1, round((1 - chance) / chance * 100))})
    return {"rolls": 1, "entries": entries}


def jar_for(mask):
    hits = sorted(MODS.glob(mask + ".jar"))
    if not hits:
        sys.exit("jar не найден: " + mask)
    return hits[0]


def read_json_from_jar(jar, path):
    with zipfile.ZipFile(jar) as z:
        try:
            raw = z.read(path)
        except KeyError:
            sys.exit("в jar %s нет %s" % (jar.name, path))
    return json.loads(raw.decode("utf-8"))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


# ---------- 1. дроп с боссов, один раз на игрока ----------
def once_condition(item):
    adv = "boss_eyes:once/" + item.split(":", 1)[1]
    return {
        "condition": "minecraft:entity_properties",
        "entity": "killer",
        "predicate": {"type_specific": {"type": "minecraft:player", "advancements": {adv: False}}},
    }


def write_advancement(item):
    name = item.split(":", 1)[1]
    write_json(DP / "data" / "boss_eyes" / "advancement" / "once" / (name + ".json"), {
        "criteria": {"got": {"trigger": "minecraft:inventory_changed",
                             "conditions": {"items": [{"items": item}]}}}
    })


for mask, ns, name, items in BOSSES:
    jar = jar_for(mask)
    table = read_json_from_jar(jar, "data/%s/loot_table/entities/%s.json" % (ns, name))
    table.setdefault("pools", [])
    pl = pool(items)
    pl["conditions"] = [once_condition(i) for i, _ in items]
    for i, _ in items:
        write_advancement(i)
    table["pools"] = list(table["pools"]) + [pl]
    write_json(DP / "data" / ns / "loot_table" / "entities" / (name + ".json"), table)

for name, items in VANILLA.items():
    pl = pool(items)
    pl["conditions"] = [once_condition(i) for i, _ in items]
    for i, _ in items:
        write_advancement(i)
    write_json(DP / "data" / "endrem" / "loot_table" / "minecraft" / "entities" / (name + ".json"),
               {"pools": [pl]})

# тег: драконья сталь Ice and Fire любого вида
write_json(DP / "data" / "boss_eyes" / "tags" / "item" / "dragonsteel_ingots.json", {
    "replace": False,
    "values": [
        "iceandfire:dragonsteel_fire_ingot",
        "iceandfire:dragonsteel_ice_ingot",
        "iceandfire:dragonsteel_lightning_ingot",
    ],
})

# ---------- 2. страховочные ритуалы (4 статуи) ----------
for eye, trophy in TROPHY.items():
    chosen = []
    for prem in PREMIUM:
        if prem == trophy:
            continue
        chosen.append(prem)
        if len(chosen) == 3:
            break
    inputs = []
    for slot in [trophy] + chosen:
        if slot.startswith("tag:"):
            inputs.append({"ingredient": {"tag": slot[4:]}, "count": 1, "consume": True})
        else:
            inputs.append({"ingredient": {"item": slot}, "count": 1, "consume": True})
    write_json(HARDREC / ("eye_ritual_" + eye.split(":", 1)[1] + ".json"), {
        "type": "alshanex_familiars:ritual_recipe",
        "central_item": {"item": "minecraft:ender_eye"},
        "inputs": inputs,
        "result": {"id": eye},
        "particle_type": "minecraft:soul_fire_flame",
    })

print("таблиц лута с глазами:", sum(1 for _ in (DP / "data").rglob("loot_table/entities/*.json")))
print("ачивок одноразовости:", len(list((DP / "data" / "boss_eyes" / "advancement" / "once").glob("*.json"))))
print("ритуалов-страховок:", len(list(HARDREC.glob("eye_ritual_*.json"))))
