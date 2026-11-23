// Hazen 'n Stuff: убираем ТОЛЬКО косметику и имбовые оружия/посохи.
// Обычное оружие и функциональная броня остаются.
ServerEvents.recipes(event => {
  // 1) Вся косметика мода (броня-скины и косметические посохи)
  event.remove({ id: /^hazennstuff:.*\/cosmetic\// })

  // 2) Косметические/мем-сеты, которые в моде идут не через папку cosmetic
  event.remove({ id: /^hazennstuff:smithing\/armor\/(hazel|herta_puppet|iron431|lemon_god|slc_cat|masked_fool)\// })
  event.remove({ id: /^hazennstuff:crafting\/armor\/gabriel_ultrakill\// })

  // 3) Имбовые оружия (остальное оружие НЕ трогаем)
  event.remove({ id: 'hazennstuff:crafting/weapons/excalibur' })
  event.remove({ id: 'hazennstuff:crafting/weapons/hazens_excalibur' })
  event.remove({ id: 'hazennstuff:crafting/weapons/terraprisma' })
  event.remove({ id: 'hazennstuff:crafting/weapons/the_devourer' })
  event.remove({ id: 'hazennstuff:crafting/weapons/soul_reaper' })
  event.remove({ id: 'hazennstuff:crafting/weapons/astralite_cleaver' })
  event.remove({ id: 'hazennstuff:crafting/weapons/divine_greatsword' })
  event.remove({ id: 'hazennstuff:smithing/weapons/divine_greatsword' })
  event.remove({ id: 'hazennstuff:crafting/weapons/skyscorcher' })
  event.remove({ id: 'hazennstuff:crafting/weapons/dawnmaker' })
  event.remove({ id: 'hazennstuff:crafting/weapons/draconic_splitter' })
  event.remove({ id: 'hazennstuff:crafting/weapons/nights_edge' })
  event.remove({ id: 'hazennstuff:crafting/weapons/spectrum' })
  event.remove({ id: 'hazennstuff:crafting/weapons/warflaming_lance' })
  event.remove({ id: 'hazennstuff:crafting/weapons/tidal_wave' })

  // 4) Имбовые посохи
  event.remove({ id: 'hazennstuff:crafting/staves/insania_aeternus' })
  event.remove({ id: 'hazennstuff:crafting/staves/ceaseless_void' })
  event.remove({ id: 'hazennstuff:crafting/staves/nexus' })
  event.remove({ id: 'hazennstuff:crafting/staves/divine_scepter' })
})