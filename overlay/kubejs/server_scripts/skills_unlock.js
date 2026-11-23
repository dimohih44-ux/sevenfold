// Автоматически открывает все ветви дерева навыков при входе игрока.
// Никаких ручных команд не нужно.

var CATEGORIES = ['warrior', 'archer', 'magic', 'familiars', 'schools', 'schools_addon'];

function tryUnlock(server, playerName, category) {
  var cmds = [
    'puffish_skills category unlock ' + playerName + ' rpgskills:' + category,
    'puffish_skills category unlock rpgskills:' + category + ' ' + playerName
  ];
  for (var i = 0; i < cmds.length; i++) {
    var res = 0;
    try { res = server.runCommandSilent(cmds[i]); } catch (e) { res = 0; }
    if (res > 0) return cmds[i];
  }
  return '';
}

PlayerEvents.loggedIn(function (event) {
  var p = event.player;
  var server = event.server;
  if (!p || !server) return;
  var name;
  try { name = String(p.username); } catch (e) { return; }

  var okCount = 0;
  var used = '';
  for (var i = 0; i < CATEGORIES.length; i++) {
    var usedCmd = tryUnlock(server, name, CATEGORIES[i]);
    if (usedCmd !== '') { okCount = okCount + 1; used = usedCmd; }
  }
  if (okCount > 0) {
    console.info('[skills] ветви открыты: ' + okCount + '/' + CATEGORIES.length + ' (способ: ' + used + ')');
  } else {
    console.info('[skills] не удалось открыть ветви — проверь синтаксис команды puffish_skills');
  }
});
