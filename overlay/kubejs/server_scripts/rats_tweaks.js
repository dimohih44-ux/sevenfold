// ============================================================
// Rats: уборка лишнего из сборки.
// 1) Убираем крафты, которые не вписываются в тёмное фэнтези:
//    мусорный бак, мешалка сыра (auto curdler) и техно-апгрейды крыс.
// 2) Защита своих крыс от случайного удара (No Friendly Fire их не знает):
//    урон от игрока-владельца отменяется, если не присел.
// ============================================================

ServerEvents.recipes(function (event) {
  var kill = [
    'rats:trash_can',
    'rats:auto_curdler',
    // техно/автоматизация и прочее, что выбивается из стиля:
    'rats:upgrades/ratinator_upgrade',
    'rats:upgrades/biplane_upgrade',
    'rats:upgrades/buccaneer_upgrade',
    'rats:upgrades/automaton_upgrade',
    'rats:upgrades/tick_accelerator_upgrade',
    'rats:upgrades/time_manipulator_upgrade',
    'rats:upgrades/quarry_upgrade',
    'rats:upgrades/basic_energy_upgrade',
    'rats:upgrades/advanced_energy_upgrade',
    'rats:upgrades/elite_energy_upgrade',
    'rats:upgrades/extreme_energy_upgrade',
    'rats:upgrades/travelers_backpack_upgrade',
    'rats:upgrades/crafting_upgrade',
    'rats:upgrades/ore_doubling_upgrade'
  ]
  for (var i = 0; i < kill.length; i++) {
    event.remove({ id: kill[i] })
  }
  console.info('[rats] удалено рецептов: ' + kill.length)
})

// Защита приручённых крыс от случайного удара
EntityEvents.beforeHurt(function (event) {
  var ent = event.entity
  if (!ent) return
  var type = ''
  try { type = String(ent.type) } catch (err) { return }
  if (type !== 'rats:rat') return

  var attacker = null
  try { attacker = event.source.player } catch (err) { attacker = null }
  if (!attacker) return

  var tamed = false
  try { tamed = ent.nbt.getBoolean('TamedRat') } catch (err) { tamed = false }
  if (!tamed) return

  // приседает? если не смогли определить — не блокируем удар
  var sneaking = true
  try { sneaking = attacker.isCrouching() } catch (err) {
    try { sneaking = attacker.isShiftKeyDown() } catch (err2) { sneaking = true }
  }
  if (sneaking) return

  try { event.cancel() } catch (err) {}
  try { attacker.tell(Text.gray('Крыса не пострадала (ударь с приседанием, если нужно)')) } catch (err) {}
})
