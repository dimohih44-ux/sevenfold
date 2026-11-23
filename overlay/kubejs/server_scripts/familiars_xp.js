// Ветка «Фамильяры»: опыт ТОЛЬКО от питомцев Alshanex's Familiars.
//   1) питомец убил моба                    -> опыт владельцу
//   2) питомец скастовал заклинание (Iron's) -> опыт владельцу
// Категория в Pufferfish's Skills: rpgskills:familiars
// Команда выдачи: /puffish_skills experience add <игрок> rpgskills:familiars <целое>
var FAM_CAT = 'rpgskills:familiars'
var FAM_NS = ['alshanex_familiars', 'familiarslib']

function isFamiliar(ent) {
  if (!ent) return false
  try {
    var t = String(ent.type)
    for (var i = 0; i < FAM_NS.length; i++) { if (t.indexOf(FAM_NS[i] + ':') === 0) return true }
  } catch (e) { }
  return false
}

// UUID владельца из NBT питомца (familiarslib пишет ключ ownerUUID)
function ownerUuidOf(ent) {
  try {
    var tag = new (Java.loadClass('net.minecraft.nbt.CompoundTag'))()
    try { ent.saveWithoutId(tag) } catch (e1) { }
    try { var u = tag.getUUID('ownerUUID'); return u ? String(u) : null } catch (e2) { return null }
  } catch (e3) { return null }
}

function serverOf() {
  for (var i = 0; i < arguments.length; i++) {
    var o = arguments[i]
    if (!o) continue
    try { var s1 = o.server; if (s1) return s1 } catch (e1) { }
    try { if (o.getServer) { var s2 = o.getServer(); if (s2) return s2 } } catch (e2) { }
  }
  try { var s3 = Utils.getServer(); if (s3) return s3 } catch (e3) { }
  return null
}

function playersOf(server) {
  if (!server) return null
  try { var a = server.players; if (a) return a } catch (e1) { }
  try { var b = server.getPlayerList().getPlayers(); if (b) return b } catch (e2) { }
  return null
}

// имя владельца: сначала родной метод питомца, иначе поиск игрока по UUID
function ownerNameOf(pet, server) {
  try {
    var o = pet.getOwner()
    if (o) {
      try { return String(o.getName().getString()) } catch (e1) { }
      try { return String(o.username) } catch (e2) { }
    }
  } catch (e3) { }
  var id = ownerUuidOf(pet)
  if (!id) return null
  var ps = playersOf(server)
  if (!ps) return null
  for (var i = 0; i < ps.size(); i++) {
    var p = ps.get(i)
    var pu = null
    try { pu = String(p.uuid) } catch (e4) { try { pu = String(p.getUUID()) } catch (e5) { } }
    if (pu === id) {
      try { return String(p.username) } catch (e6) { try { return String(p.getName().getString()) } catch (e7) { } }
    }
  }
  return null
}

function grant(server, amount, name) {
  if (!server || !name) return
  var v = Math.round(amount)
  if (v < 1) return
  var cmd = 'puffish_skills experience add ' + name + ' ' + FAM_CAT + ' ' + v
  try {
    var res = server.runCommandSilent(cmd)
    if (String(res) === '0') console.error('[famxp] команда НЕ сработала: ' + cmd)
  } catch (e) { console.error('[famxp] ошибка команды: ' + cmd + ' :: ' + e) }
}

// 1) убийства питомцем
EntityEvents.death(event => {
  try {
    var s = event.source
    var server = serverOf(event.level, event.server)
    var killer = null
    try { killer = s.actual } catch (e1) { }
    if (!isFamiliar(killer)) { try { killer = s.immediate } catch (e2) { } }
    if (!isFamiliar(killer)) return
    var name = ownerNameOf(killer, server)
    if (!name) { console.info('[famxp] убийство питомцем ' + String(killer.type) + ', но владелец не найден'); return }
    var xp = Math.max(1, Math.round(event.entity.maxHealth / 20) + 2)
    grant(server, xp, name)
    console.info('[famxp] убийство ' + String(event.entity.type) + ' питомцем ' + String(killer.type) + ' -> ' + name + ' +' + Math.round(xp))
  } catch (err) { console.error('[famxp] kill fatal: ' + err) }
})

// 2) касты заклинаний питомцем (irons_spells_js -> событие каста Iron's Spellbooks)
ISSEvents.spellPostCast(event => {
  try {
    var caster = event.entity
    if (!isFamiliar(caster)) return
    var server = serverOf(event.level, caster.level)
    var name = ownerNameOf(caster, server)
    if (!name) return
    var lvl = 1
    try { lvl = event.spellLevel } catch (e1) { try { lvl = event.getSpellLevel() } catch (e2) { } }
    var xp = Math.max(1, Math.round(lvl / 2))
    grant(server, xp, name)
  } catch (err) { console.error('[famxp] cast fatal: ' + err) }
})
