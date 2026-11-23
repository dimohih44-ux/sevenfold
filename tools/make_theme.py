# Три палитры темы квест-бука. Активная — A, остальные лежат рядом как варианты.
import re
from pathlib import Path
INST = Path(r"C:\Users\User\curseforge\minecraft\Instances\____ _ _____ 2")
Q = INST / "config" / "ftbquests" / "quests" / "chapters"
DEST = INST / "global_packs" / "required_resources" / "sevenfold_questbook" / "assets" / "ftbquests"
DEST.mkdir(parents=True, exist_ok=True)

chapters = {}
for f in Q.glob("*.snbt"):
    m = re.search(r'\n\tid: "([0-9A-F]{16})"', f.read_text(encoding="utf-8"))
    if m:
        chapters[f.stem] = m.group(1)

PALETTES = {
 "a_parchment": dict(
    name="Тёмный пергамент: золото и мох",
    text="#FFE7DCC3", hover="#FFFFF2CE", disabled="#FF7E766A",
    view_bg="#F2161411", border="#FFC9A227", title="#FFF2DA94",
    tasks="#FFD8CCB2", rewards="#FFEBD79C",
    done="#FF7D9A63", started="#FFC9A227", fresh="#FF8B8071", locked="#FF453E36",
    line_done="#FF8FA46B", line_undone="#FF5E564B",
    requires="#FF8FA46B", required_for="#FF6E7F5A", thickness="1.5D", tint="#C8FFFFFF"),
 "b_otherside": dict(
    name="Изнанка: холод и фиолет",
    text="#FFDCD6EA", hover="#FFF3EEFF", disabled="#FF6C667A",
    view_bg="#F2100E17", border="#FF7C68C8", title="#FFD9CDFF",
    tasks="#FFCBC4E2", rewards="#FFE2D4FF",
    done="#FF6E5FA8", started="#FF9C86F0", fresh="#FF736C88", locked="#FF35313F",
    line_done="#FF8F7BE0", line_undone="#FF494356",
    requires="#FF8F7BE0", required_for="#FF6F5FBF", thickness="1.5D", tint="#C8E8E2FF"),
 "c_ash": dict(
    name="Пепел: почти монохром",
    text="#FFDAD6CE", hover="#FFFFFFFF", disabled="#FF6E6A64",
    view_bg="#F2131211", border="#FF9A9287", title="#FFEDE6D8",
    tasks="#FFC9C4BA", rewards="#FFE6DFD2",
    done="#FF8F8A80", started="#FFBDB6A8", fresh="#FF7A766E", locked="#FF3C3936",
    line_done="#FF9A9287", line_undone="#FF4F4B45",
    requires="#FF9A9287", required_for="#FF716C64", thickness="1.2D", tint="#C8FFFFFF"),
}

TPL = """[*]
text_color: {text}
hover_text_color: {hover}
disabled_text_color: {disabled}
quest_view_background: color:{view_bg}
quest_view_border: {border}
quest_view_title: {title}
tasks_text_color: {tasks}
rewards_text_color: {rewards}
quest_completed_color: {done}
quest_started_color: {started}
quest_not_started_color: {fresh}
quest_locked_color: {locked}
dependency_line_completed_color: {line_done}
dependency_line_uncompleted_color: {line_undone}
dependency_line_requires_color: {requires}
dependency_line_required_for_color: {required_for}
dependency_line_thickness: {thickness}
quest_spacing: 1.0D
"""

for key, p in PALETTES.items():
    body = TPL.format(**{k: v for k, v in p.items() if k != "name"})
    for fname, cid in sorted(chapters.items()):
        body += "\n[%s]\nbackground: sevenfold:textures/questbook/chapters/%s.png; tint=%s\n" % (cid, fname, p["tint"])
    (DEST / ("theme_%s.txt" % key)).write_text(body, encoding="utf-8")
    print("  вариант:", key, "-", p["name"])

# активная тема = A
(DEST / "ftb_quests_theme.txt").write_text((DEST / "theme_a_parchment.txt").read_text(encoding="utf-8"), encoding="utf-8")
print("активна: a_parchment")

