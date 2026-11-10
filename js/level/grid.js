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
  G.worldState = G.worldState || {};
  G.originGX = 0;
  G.originGY = 0;
  G.respawnGX = 0;
  G.respawnGY = 0;

  G.themeFor = function (gx, gy) {
    const dist = Math.abs(gx) + Math.abs(gy);
    const band = Math.floor(dist / 10);
    return G.THEMES[band % G.THEMES.length];
  };

  G.cellOrigin = function (gx, gy) {
    return { x: gx * G.STAGE_W, y: gy * G.STAGE_H };
  };

  G.stateKey = G.stateKey || function (gx, gy, kind, i) {
    return gx + "," + gy + "," + kind + "," + i;
  };
  G.stateFor = G.stateFor || function (gx, gy, kind, i) {
    return G.worldState[G.stateKey(gx, gy, kind, i)];
  };

  G.inLoadShape = function (gx, gy) {
    const dx = Math.abs(gx - G.currentGX);
    const dy = Math.abs(gy - G.currentGY);
    if (dx === 0 && dy <= 2) return true;
    if (dy === 0 && dx <= 2) return true;
    if (dx === 1 && dy === 1) return true;
    return false;
  };

  G.keepLoaded = function (gx, gy) {
    if (gx === G.originGX && gy === G.originGY) return true;
    if (gx === G.respawnGX && gy === G.respawnGY) return true;
    return G.inLoadShape(gx, gy);
  };

  G.setOrigin = function (gx, gy) {
    G.originGX = gx;
    G.originGY = gy;
  };

  G.setRespawn = function (gx, gy) {
    G.respawnGX = gx;
    G.respawnGY = gy;
    G.loadCell(gx, gy);
    if (G.rebuildActive) G.rebuildActive();
  };

  G.makeGridLevel = function (gx, gy) {
    const theme = G.themeFor(gx, gy);
    const fy = G.FLOOR_Y;
    const dust = theme.dust || "#a1887f";
    const platforms = [{ x: 0, y: fy, w: 1000, h: 120, dust: dust, floor: true, shape: "box" }];
    for (let i = 0; i < 3; i++) {
      platforms.push({
        x: 150 + i * 250 + (Math.abs(gx) * 20 % 80),
        y: fy - 140 - i * 70,
        w: 140,
        h: 24,
        dust: dust,
        shape: "box"
      });
    }
    if (G.addShapes) G.addShapes(platforms, gx, gy, fy, dust);
    const obstacles = [];
    if (G.addObstacles) G.addObstacles(obstacles, gx, gy, fy);
    const coins = [];
    for (let i = 0; i < 5; i++) {
      const st = G.stateFor(gx, gy, "coin", i);
      coins.push({ x: 120 + i * 160, y: fy - 180 - (i % 3) * 40, got: !!(st && st.got), i: i });
    }
    const pits = [];
    if ((gx + gy) % 3 === 0) {
      const st = G.stateFor(gx, gy, "pit", 0);
      pits.push({ x: 400 + (Math.abs(gx) * 30 % 100), w: 80, platformIndex: 0, open: !!(st && st.open), i: 0 });
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
      const st = G.stateFor(gx, gy, "power", i);
      powerups.push({
        x: 250 + i * 200,
        y: fy - 160 - i * 30,
        type: types[(Math.abs(gx) + i + Math.abs(gy)) % types.length],
        got: !!(st && st.got),
        i: i
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
      obstacles: obstacles,
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
    if (G.keepLoaded && G.keepLoaded(gx, gy)) return;
    const key = gx + "," + gy;
    const lvl = G.gridLevels[key];
    if (!lvl) return;
    lvl.platforms = null;
    lvl.obstacles = null;
    lvl.coins = null;
    lvl.pits = null;
    lvl.springs = null;
    lvl.surfaces = null;
    lvl.powerups = null;
    delete G.gridLevels[key];
  };

  G.unloadFar = function () {
    for (const key in G.gridLevels) {
      const lvl = G.gridLevels[key];
      if (!lvl) continue;
      if (!G.keepLoaded(lvl.gx, lvl.gy)) G.unloadCell(lvl.gx, lvl.gy);
    }
  };

  G.loadWindow = function () {
    for (let d = -2; d <= 2; d++) {
      G.loadCell(G.currentGX + d, G.currentGY);
      G.loadCell(G.currentGX, G.currentGY + d);
    }
    G.loadCell(G.currentGX - 1, G.currentGY - 1);
    G.loadCell(G.currentGX + 1, G.currentGY - 1);
    G.loadCell(G.currentGX - 1, G.currentGY + 1);
    G.loadCell(G.currentGX + 1, G.currentGY + 1);
    G.loadCell(G.originGX, G.originGY);
    G.loadCell(G.respawnGX, G.respawnGY);
    G.unloadFar();
  };

  function cutFloor(plats, pit) {
    const pad = 8;
    const left = pit.x - pad;
    const right = pit.x + pit.w + pad;
    const top = pit.y;
    const next = [];
    for (const p of plats) {
      if (!p.floor) { next.push(p); continue; }
      if (p.y > top + 8 || p.y + p.h < top) { next.push(p); continue; }
      if (right <= p.x || left >= p.x + p.w) { next.push(p); continue; }
      if (left > p.x) next.push(Object.assign({}, p, { w: left - p.x }));
      if (right < p.x + p.w) next.push(Object.assign({}, p, { x: right, w: p.x + p.w - right }));
    }
    return next;
  }

  G.rebuildActive = function () {
    let plats = [], obs = [], coins = [], pits = [], springs = [], surfaces = [], powerups = [];
    for (const key in G.gridLevels) {
      const lvl = G.gridLevels[key];
      if (!lvl) continue;
      const ox = lvl.gx * G.STAGE_W;
      const oy = lvl.gy * G.STAGE_H;
      let cellPlats = [];
      for (const p of (lvl.platforms || [])) {
        const extra = p.floor ? 4 : 0;
        cellPlats.push({
          x: p.x + ox - extra,
          y: p.y + oy,
          w: p.w + extra * 2,
          h: p.h,
          dust: p.dust,
          floor: p.floor,
          color: lvl.color,
          ground: lvl.ground,
          shape: p.shape,
          y0: p.y0 != null ? p.y0 + oy : null,
          y1: p.y1 != null ? p.y1 + oy : null,
          baseX: p.baseX != null ? p.baseX + ox : null,
          range: p.range
        });
      }
      for (const o of (lvl.obstacles || [])) {
        obs.push({
          type: o.type, x: o.x + ox, y: o.y + oy, baseY: o.y + oy,
          w: o.w, h: o.h, dmg: o.dmg, t: 0
        });
      }
      for (const pit of (lvl.pits || [])) {
        const st = G.stateFor(lvl.gx, lvl.gy, "pit", pit.i || 0);
        const open = pit.open || (st && st.open);
        const world = {
          x: pit.x + ox, y: pit.y != null ? pit.y + oy : (G.FLOOR_Y || 480) + oy,
          w: pit.w, open: open, i: pit.i || 0, gx: lvl.gx, gy: lvl.gy
        };
        pits.push(world);
        if (open) cellPlats = cutFloor(cellPlats, world);
      }
      plats = plats.concat(cellPlats);
      for (const c of (lvl.coins || [])) {
        const st = G.stateFor(lvl.gx, lvl.gy, "coin", c.i);
        coins.push({ x: c.x + ox, y: c.y + oy, got: c.got || (st && st.got), i: c.i, gx: lvl.gx, gy: lvl.gy });
      }
      for (const s of (lvl.springs || [])) {
        springs.push({ x: s.x + ox, y: s.y + oy, w: s.w, h: s.h, anim: s.anim || 0 });
      }
      for (const s of (lvl.surfaces || [])) {
        surfaces.push({ x: s.x + ox, y: s.y + oy, w: s.w, h: s.h, type: s.type });
      }
      for (const pu of (lvl.powerups || [])) {
        const st = G.stateFor(lvl.gx, lvl.gy, "power", pu.i);
        powerups.push({
          x: pu.x + ox, y: pu.y + oy, type: pu.type,
          got: pu.got || (st && st.got), i: pu.i, gx: lvl.gx, gy: lvl.gy
        });
      }
    }
    G.platforms = plats;
    G.obstacles = obs;
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
