# SEVENFOLD — оверлей сборки

Это **не сборка с модами**, а наш слой поверх неё: квест-бук, лор, датапаки, тема и графика,
экран загрузки и два собственных мода.

## Что внутри
- `overlay/config/ftbquests` — квест-бук (10 глав, 93 квеста)
- `overlay/config/paxi/resourcepacks/sevenfold_questbook` — тема FTB Quests + картины глав
- `overlay/config/fancymenu`, `overlay/config/drippyloadingscreen` — экран загрузки и заголовок
- `overlay/datapacks` — глаза с боссов, ритуалы, прокачка (rpgskills), лут-танинги, рецепты
- `overlay/kubejs` — скрипты рецептов и ограничений
- `overlay/mods` — наши моды: `eldritch_familiars`, `cinematic_delight_fix`
- `tools/` — генераторы квест-бука, темы и дропа глаз (Python 3.12 + Pillow)

## Как применить
Смотри `INSTALL.md`. Коротко: создать инстанс 1.21.1 + NeoForge 21.1.264, распаковать `overlay/` в папку сборки.

## Статус
`0.9.0-beta` — бета: механика работает, полировка и баланс в процессе.

## Лицензия
Свои материалы — наши; моды принадлежат авторам (`CREDITS.md`).
