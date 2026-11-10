(function (G) {
  G.currentLevel = 0;
  G.groundPlat = null;

  G.loadLevel = function (index) {
    const lvl = G.levels[index];
    if (!lvl) return;
    G.currentLevel = index;
    G.platforms = lvl.platforms || [];
    G.coins = (lvl.coins || []).map(c => ({ ...c, got: false }));
    G.stageW = lvl.w || G.STAGE_W;
    G.stageH = lvl.h || G.STAGE_H;
    G.fillDust(G.platforms);
  };

  G.addLevel = function (def) {
    def.w = def.w || G.STAGE_W;
    def.h = def.h || G.STAGE_H;
    G.levels.push(def);
    if (G.levels.length === 1) G.loadLevel(0);
  };

  G.overlap = function (a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  };

  G.fillDust = function (list) {
    for (const p of (list || [])) {
      if (!p.dust) p.dust = "#a1887f";
    }
  };

  G.onGround = function (px, py, pw, ph) {
    const feet = { x: px + 4, y: py + ph - 2, w: pw - 8, h: 6 };
    for (const p of (G.platforms || [])) {
      if (G.overlap(feet, p)) {
        G.groundPlat = p;
        return p.y;
      }
    }
    G.groundPlat = null;
    return null;
  };

  // Bottom of a platform the head is hitting while moving up. Null if clear.
  G.hitCeiling = function (px, py, pw, ph) {
    const head = { x: px + 4, y: py, w: pw - 8, h: 6 };
    for (const p of (G.platforms || [])) {
      if (!G.overlap(head, p)) continue;
      if (py < p.y + p.h && py + ph > p.y + p.h) return p.y + p.h;
    }
    return null;
  };
})(G);
