// ============================================
// Explorer's Compass -> только через ритуал Alshanex (Забытый остров)
// Убираем штатный дешёвый крафт (паутина + битый камень + компас).
// ============================================
ServerEvents.recipes(event => {
    // конкретный рецепт из data/explorerscompass/recipe/explorers_compass.json
    event.remove({ id: 'explorerscompass:explorers_compass' })
})
