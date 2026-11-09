(function (G) {
  G.currentLevel = 0;

  G.loadLevel = function (index) {
    const lvl = G.levels[index];
    if (!lvl) return;
    G.currentLevel = index;
    G.platforms = lvl.platforms || [];
    G.coins = (lvl.coins || []).map(c => ({ ...c, got: false }));
    G.stageW = lvl.w || G.STAGE_W;
    G.stageH = lvl.h || G.STAGE_H;
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

  G.onGround = function (px, py, pw, ph) {
    const feet = { x: px + 4, y: py + ph - 2, w: pw - 8, h: 6 };
    for (const p of (G.platforms || [])) if (G.overlap(feet, p)) return p.y;
    return null;
  };
})(G);
