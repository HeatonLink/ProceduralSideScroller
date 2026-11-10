(function (G) {
  G.THEMES = [
    { name: "forest", color: "#4caf50", ground: "#3e2723", dust: "#a1887f" },
    { name: "cave", color: "#5d4037", ground: "#3e2723", dust: "#9e9e9e" },
    { name: "lava", color: "#e64a19", ground: "#4e342e", dust: "#ff7043" },
    { name: "ice", color: "#81d4fa", ground: "#b0bec5", dust: "#e1f5fe" },
    { name: "sky", color: "#29b6f6", ground: "#90caf9", dust: "#b3e5fc" },
    { name: "desert", color: "#ffb74d", ground: "#8d6e63", dust: "#ffe0b2" },
    { name: "ocean", color: "#0288d1", ground: "#01579b", dust: "#80deea" },
    { name: "ruins", color: "#8d6e63", ground: "#5d4037", dust: "#bcaaa4" }
  ];

  G.LOAD_RADIUS = 2;
  G.gridLevels = Object.create(null);
  G.currentGX = 0;
  G.currentGY = 0;
  G.FLOOR_Y = 480;

  G.themeFor = function (gx, gy) {
    const dist = Math.abs(gx) + Math.abs(gy);
    const band = Math.floor(dist / 10);
    return G.THEMES[band % G.THEMES.length];
  };

  G.cellOrigin = function (gx, gy) {
    return { x: gx * G.STAGE_W, y: gy * G.STAGE_H };
  };

  G.makeGridLevel = function (gx, gy) {
    const theme = G.themeFor(gx, gy);
    const fy = G.FLOOR_Y;
    const dust = theme.dust || "#a1887f";
    const platforms = [{ x: 0, y: fy, w: 1000, h: 120, dust: dust }];
    for (let i = 0; i < 3; i++) {
      platforms.push({
        x: 150 + i * 250 + (Math.abs(gx) * 20 % 80),
        y: fy - 140 - i * 70,
        w: 140,
        h: 24,
        dust: dust
      });
    }
    const coins = [];
    for (let i = 0; i < 5; i++) {
      coins.push({ x: 120 + i * 160, y: fy - 180 - (i % 3) * 40, got: false });
    }
    const pits = [];
    if ((gx + gy) % 3 === 0) {
      pits.push({ x: 400 + (Math.abs(gx) * 30 % 100), w: 80, platformIndex: 0, open: false });
    }
    const springs = [];
    if ((gx + gy) % 2 === 0) {
      springs.push({ x: 300 + (Math.abs(gy) * 40 % 120), y: fy - 16, w: 40, h: 16, anim: 0 });
      springs.push({ x: 650, y: fy - 200, w: 40, h: 16, anim: 0 });
    }
    const surfaces = [];
    if (Math.abs(gx) % 2 === 0) {
      surfaces.push({ x: 120, y: fy - 8, w: 180, h: 12, type: "slow" });
    }
    if (Math.abs(gy) % 2 === 1) {
      surfaces.push({ x: 520, y: fy - 8, w: 200, h: 12, type: "fast" });
    }
    const types = ["heal", "speed", "shield", "coinbag"];
    const powerups = [];
    const count = 1 + Math.abs(gx + gy) % 3;
    for (let i = 0; i < count; i++) {
      powerups.push({
        x: 250 + i * 200,
        y: fy - 160 - i * 30,
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
      ground: theme.ground,
      dust: dust
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

  // Copy loaded cells into world space so the player can walk across them.
  G.rebuildActive = function () {
    const plats = [], coins = [], pits = [], springs = [], surfaces = [], powerups = [];
    for (const key in G.gridLevels) {
      const lvl = G.gridLevels[key];
      if (!lvl) continue;
      const ox = lvl.gx * G.STAGE_W;
      const oy = lvl.gy * G.STAGE_H;
      for (const p of (lvl.platforms || [])) {
        plats.push({ x: p.x + ox, y: p.y + oy, w: p.w, h: p.h, dust: p.dust });
      }
      for (const c of (lvl.coins || [])) {
        coins.push({ x: c.x + ox, y: c.y + oy, got: c.got });
      }
      for (const pit of (lvl.pits || [])) {
        pits.push({ x: pit.x + ox, w: pit.w, open: pit.open, platformIndex: 0 });
      }
      for (const s of (lvl.springs || [])) {
        springs.push({ x: s.x + ox, y: s.y + oy, w: s.w, h: s.h, anim: s.anim || 0 });
      }
      for (const s of (lvl.surfaces || [])) {
        surfaces.push({ x: s.x + ox, y: s.y + oy, w: s.w, h: s.h, type: s.type });
      }
      for (const pu of (lvl.powerups || [])) {
        powerups.push({ x: pu.x + ox, y: pu.y + oy, type: pu.type, got: pu.got });
      }
    }
    G.platforms = plats;
    if (G.fillDust) G.fillDust(G.platforms);
    G.coins = coins;
    G.pits = pits;
    G.springs = springs;
    G.surfaces = surfaces;
    G.powerups = powerups;
  };

  G.loadGrid = function (gx, gy) {
    G.currentGX = gx;
    G.currentGY = gy;
    if (G.markVisited) G.markVisited(gx, gy);
    G.loadWindow();
    G.rebuildActive();
    const lvl = G.gridLevels[gx + "," + gy];
    if (!lvl) return;
    G.stageW = lvl.w;
    G.stageH = lvl.h;
    G.levels = Object.keys(G.gridLevels).map(k => G.gridLevels[k]);
    G.currentLevel = G.levels.indexOf(lvl);
  };

  G.loadGrid(0, 0);

  // Track the cell the player is in. Do not move the player.
  G.addUpdate(function () {
    const p = G.player;
    if (!p || G.state !== "play") return;
    const gx = Math.floor(p.x / G.STAGE_W);
    const gy = Math.floor(p.y / G.STAGE_H);
    if (gx === G.currentGX && gy === G.currentGY) return;
    G.currentGX = gx;
    G.currentGY = gy;
    if (G.markVisited) G.markVisited(gx, gy);
    G.loadWindow();
    G.rebuildActive();
  });
})(G);
