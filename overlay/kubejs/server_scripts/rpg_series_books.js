// ============================================================
// Книги заклинаний: крафт ТОЛЬКО на жаровне Eidolon
// (рецепты — датапак datapacks/eidolon_spellbooks).
// Плюс: свитки/книги заклинаний не выпадают с мобов (только крафт).
// ============================================================

ServerEvents.recipes(function (event) {
  event.remove({ id: 'spell_engine:spell_binding_table' })

  var books = [
    'irons_spellbooks:copper_spell_book',
    'irons_spellbooks:iron_spell_book',
    'irons_spellbooks:gold_spell_book',
    'irons_spellbooks:diamond_spell_book',
    'irons_spellbooks:netherite_spell_book',
    'irons_spellbooks:dragonskin_spell_book',
    'irons_spellbooks:druidic_spell_book',
    'irons_spellbooks:ice_spell_book',
    'irons_spellbooks:cursed_doll_spell_book',
    'cataclysm_spellbooks:amethyst_bless/abyss_spell_book',
    'cataclysm_spellbooks:smithing/codex_of_malice_upgrade',
    'cataclysm_spellbooks:smithing/ignis_spellbook_upgrade',
    'discerning_the_eldritch:the_apocrypha_spellbook',
    'monsterspellbooks:frenzy_king_book',
    'darkermagic:warden_spell_book'
  ]
  for (var i = 0; i < books.length; i++) {
    event.remove({ id: books[i] })
  }
  console.info('[books] убрано верстаковых рецептов книг: ' + books.length)
})

var BLOCK_DROPS = ['spell_scroll', 'spell_book']

function isBlockedDrop(stack) {
  try {
    var reg = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
    var id = String(reg.ITEM.getKey(stack.getItem()))
    for (var k = 0; k < BLOCK_DROPS.length; k++) {
      if (id.indexOf(BLOCK_DROPS[k]) >= 0) {
        return true
      }
    }
  } catch (err) {
    console.warn('[books] drop id error: ' + err)
  }
  return false
}

var entityIds = []
try {
  var reg2 = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  var it = reg2.ENTITY_TYPE.keySet().iterator()
  while (it.hasNext()) {
    entityIds.push(String(it.next()))
  }
} catch (err2) {
  console.warn('[books] cannot read entity registry: ' + err2)
}

if (entityIds.length > 0) {
  EntityEvents.drops(entityIds, function (event) {
    try {
      var list = event.getDrops()
      if (list == null) {
        return
      }
      for (var i = list.size() - 1; i >= 0; i--) {
        var ent = list.get(i)
        if (ent == null) {
          continue
        }
        var stack = ent.getItem()
        if (stack == null || stack.isEmpty()) {
          continue
        }
        if (isBlockedDrop(stack)) {
          list.remove(i)
        }
      }
    } catch (err3) {
      console.warn('[books] drop filter error: ' + err3)
    }
  })
  console.info('[books] фильтр дропа повешен на ' + entityIds.length + ' типов сущностей')
}