// Тринкет Соглядатая варится только на ритуальной площадке Острова Истоков
// (ритуальный рецепт datapacks/hard_recipes), верстак вырезан.
ServerEvents.recipes(event => {
  event.remove({ output: 'eldritch_familiars:watchers_eye' })
})