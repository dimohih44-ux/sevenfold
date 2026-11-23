// ============================================
// HARDCORE MANA — Iron's Spells 1.21.1 NeoForge
// Uses /attribute commands (confirmed working by mod developers)
// ============================================

const STARTING_MAX_MANA = 50    // Base max mana (default 100)
const MANA_REGEN_VALUE = 0.45    // 45% от ванильной регенерации (было 0.15)

PlayerEvents.loggedIn(event => {
    var player = event.player
    var name = player.username

    // Set base max mana
    event.server.runCommandSilent(`attribute ${name} irons_spellbooks:max_mana base set ${STARTING_MAX_MANA}`)
    // Set base mana regen
    event.server.runCommandSilent(`attribute ${name} irons_spellbooks:mana_regen base set ${MANA_REGEN_VALUE}`)

    console.info(`[hardcore_mana] Applied to ${name}: max_mana=${STARTING_MAX_MANA}, regen=${MANA_REGEN_VALUE}`)
})

PlayerEvents.respawned(event => {
    var player = event.player
    var name = player.username

    event.server.runCommandSilent(`attribute ${name} irons_spellbooks:max_mana base set ${STARTING_MAX_MANA}`)
    event.server.runCommandSilent(`attribute ${name} irons_spellbooks:mana_regen base set ${MANA_REGEN_VALUE}`)

    console.info(`[hardcore_mana] Re-applied on respawn to ${name}`)
})

console.info('[hardcore_mana] Script loaded. Using /attribute commands.')
