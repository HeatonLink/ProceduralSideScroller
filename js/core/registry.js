(function (G) {
  G.levels = [];

  G.ENEMY_DEFAULT = {
    x: 0, y: 0, vx: 1, w: 32, h: 64, hp: 40, maxHp: 40,
    dir: 1, range: 100, home: 0, anim: 0,
    state: "walk", color: "#e74c3c", scale: 0.85
  };

  G.BOSS_DEFAULT = {
    x: 0, y: 0, vx: 0.6, w: 48, h: 96, hp: 200, maxHp: 200,
    dir: 1, range: 200, home: 0, anim: 0,
    state: "idle", color: "#8e44ad", scale: 1.4
  };

  G.NPC_DEFAULT = {
    x: 0, y: 0, w: 32, h: 64, hp: 30, maxHp: 30, text: "...",
    color: "#27ae60", scale: 0.9, talked: false
  };

  function fill(def, proto) {
    const out = Object.assign({}, proto, def);
    if (out.maxHp == null) out.maxHp = out.hp;
    if (out.hp == null) out.hp = out.maxHp;
    if (!out.rig && G.makeRig) out.rig = G.makeRig(out.type || "enemy", out.scale);
    if (out.home === 0 && out.x) out.home = out.x;
    return out;
  }

  G.npcs = [];
  G.addNpc = function (def) { G.npcs.push(fill(def, G.NPC_DEFAULT)); };

  G.bosses = [];
  G.addBoss = function (def) { G.bosses.push(fill(def, G.BOSS_DEFAULT)); };

  G.updates = [];
  G.addUpdate = function (fn) { G.updates.push(fn); };

  G.runUpdates = function () {
    for (const fn of G.updates) {
      try { fn(); }
      catch (err) { console.warn("update error", err); }
    }
  };

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
      for (const fn of list) {
        try { fn(ctx, player); }
        catch (err) { console.warn("draw error", layer, err); }
      }
    }
  };
})(G);
