// Advanced Stands: keep only wooden stands, remove every upgrade.
// Also removes the vanilla armor stand recipe.
ServerEvents.recipes(event => {
    const removeIds = [
        'advancedstands:armor_stand_copper_upgrade',
        'advancedstands:armor_stand_iron_upgrade',
        'advancedstands:armor_stand_gold_upgrade',
        'advancedstands:armor_stand_diamond_upgrade',
        'advancedstands:armor_stand_netherite_upgrade',
        'advancedstands:tool_stand_copper_upgrade',
        'advancedstands:tool_stand_iron_upgrade',
        'advancedstands:tool_stand_gold_upgrade',
        'advancedstands:tool_stand_diamond_upgrade',
        'advancedstands:tool_stand_netherite_upgrade',
        'advancedstands:weapon_stand_copper_upgrade',
        'advancedstands:weapon_stand_iron_upgrade',
        'advancedstands:weapon_stand_gold_upgrade',
        'advancedstands:weapon_stand_diamond_upgrade',
        'advancedstands:weapon_stand_netherite_upgrade'
    ]
    removeIds.forEach(id => event.remove({ id: id }))
    event.remove({ id: 'minecraft:armor_stand' })
})