(function (G) {
  G.THEMES = [
    { name: "forest", color: "#4caf50", ground: "#3e2723" },
    { name: "cave", color: "#5d4037", ground: "#3e2723" },
    { name: "lava", color: "#e64a19", ground: "#4e342e" },
    { name: "ice", color: "#81d4fa", ground: "#b0bec5" },
    { name: "sky", color: "#29b6f6", ground: "#90caf9" },
    { name: "desert", color: "#ffb74d", ground: "#8d6e63" },
    { name: "ocean", color: "#0288d1", ground: "#01579b" },
    { name: "ruins", color: "#8d6e63", ground: "#5d4037" }
  ];

  G.LOAD_RADIUS = 2;
  G.gridLevels = Object.create(null);
  G.currentGX = 0;
  G.currentGY = 0;

  G.themeFor = function (gx, gy) {
    const dist = Math.abs(gx) + Math.abs(gy);
    const band = Math.floor(dist / 10);
    return G.THEMES[band % G.THEMES.length];
  };

  G.makeGridLevel = function (gx, gy) {
    const theme = G.themeFor(gx, gy);
    const platforms = [{ x: 0, y: 900, w: 1000, h: 100 }];
    for (let i = 0; i < 3; i++) {
      platforms.push({
        x: 150 + i * 250 + (Math.abs(gx) * 20 % 80),
        y: 700 - i * 60,
        w: 140,
        h: 24
      });
    }
    const coins = [];
    for (let i = 0; i < 5; i++) {
      coins.push({ x: 120 + i * 160, y: 640 - (i % 3) * 40, got: false });
    }
    const pits = [];
    if ((gx + gy) % 3 === 0) {
      pits.push({ x: 400 + (Math.abs(gx) * 30 % 100), w: 80, platformIndex: 0, open: false });
    }
    const springs = [];
    if ((gx + gy) % 2 === 0) {
      springs.push({ x: 300 + (Math.abs(gy) * 40 % 120), y: 884, w: 40, h: 16, anim: 0 });
      springs.push({ x: 650, y: 676, w: 40, h: 16, anim: 0 });
    }
    const surfaces = [];
    if (Math.abs(gx) % 2 === 0) {
      surfaces.push({ x: 120, y: 892, w: 180, h: 12, type: "slow" });
    }
    if (Math.abs(gy) % 2 === 1) {
      surfaces.push({ x: 520, y: 892, w: 200, h: 12, type: "fast" });
    }
    const types = ["heal", "speed", "shield", "coinbag"];
    const powerups = [];
    const count = 1 + Math.abs(gx + gy) % 3;
    for (let i = 0; i < count; i++) {
      powerups.push({
        x: 250 + i * 200,
        y: 720 - i * 30,
        type: types[(Math.abs(gx) + i + Math.abs(gy)) % types.length],
        got: false
      });
    }
    return {
      id: gx + "," + gy,
      gx: gx,
      gy: gy,
      theme: theme.name,
      w: G.STAGE_W,
      h: G.STAGE_H,
      platforms: platforms,
      coins: coins,
      pits: pits,
      springs: springs,
      surfaces: surfaces,
      powerups: powerups,
      color: theme.color,
      ground: theme.ground
    };
  };

  G.isLoaded = function (gx, gy) {
    return !!G.gridLevels[gx + "," + gy];
  };

  G.loadCell = function (gx, gy) {
    const key = gx + "," + gy;
    if (G.gridLevels[key]) return G.gridLevels[key];
    const lvl = G.makeGridLevel(gx, gy);
    G.gridLevels[key] = lvl;
    return lvl;
  };

  G.unloadCell = function (gx, gy) {
    const key = gx + "," + gy;
    const lvl = G.gridLevels[key];
    if (!lvl) return;
    lvl.platforms = null;
    lvl.coins = null;
    lvl.pits = null;
    lvl.springs = null;
    lvl.surfaces = null;
    lvl.powerups = null;
    delete G.gridLevels[key];
  };

  G.unloadFar = function () {
    const r = G.LOAD_RADIUS;
    for (const key in G.gridLevels) {
      const lvl = G.gridLevels[key];
      if (!lvl) continue;
      const dx = Math.abs(lvl.gx - G.currentGX);
      const dy = Math.abs(lvl.gy - G.currentGY);
      if (dx > r || dy > r) G.unloadCell(lvl.gx, lvl.gy);
    }
  };

  G.loadWindow = function () {
    const r = G.LOAD_RADIUS;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        G.loadCell(G.currentGX + dx, G.currentGY + dy);
      }
    }
    G.unloadFar();
  };

  G.loadGrid = function (gx, gy) {
    G.currentGX = gx;
    G.currentGY = gy;
    if (G.markVisited) G.markVisited(gx, gy);
    G.loadWindow();
    const lvl = G.gridLevels[gx + "," + gy];
    if (!lvl) return;
    G.platforms = lvl.platforms;
    G.coins = lvl.coins;
    G.pits = lvl.pits || [];
    G.springs = lvl.springs || [];
    G.surfaces = lvl.surfaces || [];
    G.powerups = lvl.powerups || [];
    G.stageW = lvl.w;
    G.stageH = lvl.h;
    G.levels = Object.keys(G.gridLevels).map(k => G.gridLevels[k]);
    G.currentLevel = G.levels.indexOf(lvl);
  };

  G.loadGrid(0, 0);

  G.addUpdate(function () {
    const p = G.player;
    if (!p || G.state !== "play") return;
    let changed = false;
    if (p.x > G.STAGE_W - 20) {
      G.loadGrid(G.currentGX + 1, G.currentGY);
      p.x = 20;
      changed = true;
    } else if (p.x < 10) {
      G.loadGrid(G.currentGX - 1, G.currentGY);
      p.x = G.STAGE_W - 30;
      changed = true;
    }
    if (p.y < 10) {
      G.loadGrid(G.currentGX, G.currentGY - 1);
      p.y = G.STAGE_H - 40;
      changed = true;
    } else if (p.y > G.STAGE_H - 10) {
      G.loadGrid(G.currentGX, G.currentGY + 1);
      p.y = 40;
      changed = true;
    }
    if (changed) G.loadWindow();
  });
})(G);
