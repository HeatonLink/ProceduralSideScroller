(function (G) {
  G.levels = [];
  G.addLevel = function (def) { G.levels.push(def); };

  G.npcs = [];
  G.addNpc = function (def) { G.npcs.push(def); };

  G.bosses = [];
  G.addBoss = function (def) { G.bosses.push(def); };

  G.updates = [];
  G.addUpdate = function (fn) { G.updates.push(fn); };

  // Explicit draw order. New systems register into a layer instead of editing the main loop.
  G.LAYERS = ["bg", "world", "items", "enemies", "npcs", "bosses", "player", "fx"];
  G.draws = Object.create(null);
  for (const layer of G.LAYERS) G.draws[layer] = [];

  G.addDraw = function (layer, fn) {
    if (!G.draws[layer]) G.draws[layer] = [];
    G.draws[layer].push(fn);
  };

  G.drawLayers = function (ctx, player) {
    for (const layer of G.LAYERS) {
      const list = G.draws[layer] || [];
      for (const fn of list) fn(ctx, player);
    }
  };
})(G);
