// ============================================================
// End Remastered: глаза падают ТОЛЬКО с боссов и только ОДИН раз на игрока.
// Автодроп из лут-таблиц отключён (датапак boss_eyes: global_loot_modifiers пуст,
// таблицы глаз убраны в datapacks\_backup_boss_eyes_old). Сундуки тоже очищены датапаком.
//
// Логика: при смерти босса игроку-убийце выдаётся его глаз, если этот глаз
// ещё не был получен с этого босса. Повторные убийства ничего не дают.
// ============================================================

// --- 1. Убираем крафты, которыми можно обойти боссов ---
ServerEvents.recipes(function (event) {
  event.remove({ id: 'endrem:exotic_eye' })
  event.remove({ id: 'endrem:undead_eye' })
  event.remove({ id: 'endrem:witch_eye' })
})

// --- 2. Кто какой глаз отдаёт (16 боссов -> 16 разных глаз) ---
var BOSS_EYES = {
  'cataclysm:ancient_remnant': 'endrem:old_eye',
  'cataclysm:ignis': 'endrem:nether_eye',
  'cataclysm:netherite_monstrosity': 'endrem:cursed_eye',
  'cataclysm:maledictus': 'endrem:corrupted_eye',
  'cataclysm:the_harbinger': 'endrem:lost_eye',
  'bosses_of_mass_destruction:lich': 'endrem:magical_eye',
  'bosses_of_mass_destruction:obsidilith': 'endrem:evil_eye',
  'iceandfire:dread_lich': 'endrem:undead_eye',
  'iceandfire:hydra': 'endrem:rogue_eye',
  'iceandfire:sea_serpent': 'endrem:exotic_eye',
  'block_factorys_bosses:yeti': 'endrem:cold_eye',
  'block_factorys_bosses:kraken': 'endrem:black_eye',
  'block_factorys_bosses:underworld_knight': 'endrem:cryptic_eye',
  'aquamirae:maze_mother': 'endrem:witch_eye',
  'minecraft:wither': 'endrem:wither_eye',
  'minecraft:elder_guardian': 'endrem:guardian_eye'
}

// --- 3. Выдача глаза один раз на игрока ---
EntityEvents.death(function (event) {
  var ent = event.entity
  if (!ent) return

  var type = ''
  try { type = String(ent.type) } catch (e) { return }
  var eye = BOSS_EYES[type]
  if (!eye && type.indexOf(':') < 0) { eye = BOSS_EYES['minecraft:' + type] }
  if (!eye) return

  var killer = null
  try { killer = event.source.player } catch (e) { killer = null }
  if (!killer) {
    console.info('[endrem] ' + type + ' убит не игроком — глаз не выдан')
    return
  }

  var key = 'er_' + type.replace(/[:.]/g, '_')
  var already = false
  try { already = killer.persistentData.getBoolean(key) } catch (e) { already = false }
  if (already) {
    try { killer.tell(Text.gray('Этот босс уже отдал вам свой глаз')) } catch (e2) {}
    return
  }

  try { killer.persistentData.putBoolean(key, true) } catch (e) {}

  var dropped = false
  try { ent.block.popItem(Item.of(eye)); dropped = true } catch (e) {}
  if (!dropped) {
    try { killer.give(Item.of(eye)) } catch (e) {}
  }

  console.info('[endrem] ' + eye + ' выдан за ' + type + ' игроку ' + killer.username)
  try {
    killer.tell(Text.gold('Глаз Эндера получен с босса (один раз с каждого босса)'))
  } catch (e) {}
})
