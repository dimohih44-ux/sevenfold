// ============================================================
// Убираем «жёсткую» броню со стоек в данжах (Discerning the Eldritch и любых других).
//
// Стойки, которые игрок ставит сам, появляются ПУСТЫМИ, поэтому их не трогаем.
// Чистим только те, что пришли уже с бронёй/предметами в руках — то есть из структур.
// ============================================================

EntityEvents.spawned('minecraft:armor_stand', function (event) {
  var e = event.entity
  if (!e) return

  var nbt = null
  try { nbt = e.nbt } catch (err) { return }
  if (!nbt) return

  var armorFilled = 0
  var handsFilled = 0

  try {
    var armor = nbt.getList('ArmorItems', 10)
    if (armor) {
      for (var i = 0; i < armor.size(); i++) {
        var c = armor.getCompound(i)
        if (c && c.size() > 0) armorFilled = armorFilled + 1
      }
    }
  } catch (err) {}

  try {
    var hands = nbt.getList('HandItems', 10)
    if (hands) {
      for (var j = 0; j < hands.size(); j++) {
        var h = hands.getCompound(j)
        if (h && h.size() > 0) handsFilled = handsFilled + 1
      }
    }
  } catch (err) {}

  if (armorFilled === 0 && handsFilled === 0) return

  try {
    e.mergeNbt({ ArmorItems: [{}, {}, {}, {}], HandItems: [{}, {}] })
    console.info('[armorstand] очищена стойка из структуры: броня ' + armorFilled + ', руки ' + handsFilled +
      ' @ ' + e.x + ' ' + e.y + ' ' + e.z)
  } catch (err) {
    console.info('[armorstand] не смог очистить стойку: ' + err)
  }
})
