(function (G) {
  // Spawn any defined enemy on command.
  // Usage: G.spawnEnemy("slug", 400, 800);
  //        G.spawnEnemy({ id: "bat", hp: 30 }, 500, 700);
  G.spawnEnemy = function (idOrDef, x, y, extras) {
    let base = {};
    if (typeof idOrDef === "string") {
      const found = (G.ENEMY_DEFS || []).find(d => d.id === idOrDef);
      if (!found) {
        console.warn("Unknown enemy id:", idOrDef);
        return null;
      }
      base = found;
    } else if (idOrDef && typeof idOrDef === "object") {
      base = idOrDef;
    }
    const def = Object.assign({}, base, extras || {});
    if (x != null) def.x = x;
    if (y != null) def.y = y;
    def.home = def.home || def.x || 0;
    G.addEnemy(def);
    return G.enemies[G.enemies.length - 1];
  };

  // Spawn several at once: G.spawnMany(["slug", "bat"], 300, 800, 80);
  G.spawnMany = function (ids, startX, y, spacing) {
    spacing = spacing || 60;
    return ids.map((id, i) => G.spawnEnemy(id, startX + i * spacing, y));
  };

  // Debug: press N while playing to spawn a random defined enemy near the player
  G.addUpdate(function () {
    if (G.state !== "play" || !G.player) return;
    if (G.justPressed && G.justPressed("KeyN")) {
      const defs = G.ENEMY_DEFS || [];
      if (!defs.length) return;
      const pick = defs[Math.floor(Math.random() * defs.length)];
      G.spawnEnemy(pick.id, G.player.x + 120 * (G.player.facing || 1), G.player.y);
    }
  });
})(G);
