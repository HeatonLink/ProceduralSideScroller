(function (G) {
  // Grid of stages. Each is STAGE_W x STAGE_H and stays in its own grid cell.
  // Themes change roughly every 10 levels (by distance from origin).
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

  G.gridLevels = Object.create(null); // key "gx,gy" -> level def

  G.themeFor = function (gx, gy) {
    const dist = Math.abs(gx) + Math.abs(gy);
    const band = Math.floor(dist / 10);
    return G.THEMES[band % G.THEMES.length];
  };

  G.makeGridLevel = function (gx, gy) {
    const theme = G.themeFor(gx, gy);
    const platforms = [
      { x: 0, y: 900, w: 1000, h: 100 }
    ];
    // Simple themed platforms
    for (let i = 0; i < 3; i++) {
      platforms.push({
        x: 150 + i * 250 + (gx * 20 % 80),
        y: 700 - i * 60,
        w: 140,
        h: 24
      });
    }
    const coins = [
      { x: 200, y: 660 },
      { x: 500, y: 600 },
      { x: 800, y: 680 }
    ];
    return {
      id: gx + "," + gy,
      gx: gx,
      gy: gy,
      theme: theme.name,
      w: G.STAGE_W,
      h: G.STAGE_H,
      platforms: platforms,
      coins: coins,
      color: theme.color,
      ground: theme.ground
    };
  };

  // Create dozens of levels in every direction (about -3 to 3 is 49; expand to -5 to 5 = 121)
  const RANGE = 5;
  for (let gy = -RANGE; gy <= RANGE; gy++) {
    for (let gx = -RANGE; gx <= RANGE; gx++) {
      const lvl = G.makeGridLevel(gx, gy);
      G.gridLevels[gx + "," + gy] = lvl;
      G.addLevel(lvl);
    }
  }

  G.currentGX = 0;
  G.currentGY = 0;

  G.loadGrid = function (gx, gy) {
    const key = gx + "," + gy;
    let lvl = G.gridLevels[key];
    if (!lvl) {
      lvl = G.makeGridLevel(gx, gy);
      G.gridLevels[key] = lvl;
      G.addLevel(lvl);
    }
    G.currentGX = gx;
    G.currentGY = gy;
    const idx = G.levels.indexOf(lvl);
    if (idx >= 0) G.loadLevel(idx);
    else {
      G.platforms = lvl.platforms;
      G.coins = (lvl.coins || []).map(c => ({ ...c, got: false }));
      G.stageW = lvl.w;
      G.stageH = lvl.h;
    }
  };

  // Start at origin
  G.loadGrid(0, 0);

  // Transition when player leaves the current grid cell
  G.addUpdate(function () {
    const p = G.player;
    if (!p || G.state !== "play") return;
    if (p.x > G.STAGE_W - 20) {
      G.loadGrid(G.currentGX + 1, G.currentGY);
      p.x = 20;
    } else if (p.x < 10) {
      G.loadGrid(G.currentGX - 1, G.currentGY);
      p.x = G.STAGE_W - 30;
    }
    if (p.y < 10) {
      G.loadGrid(G.currentGX, G.currentGY - 1);
      p.y = G.STAGE_H - 40;
    } else if (p.y > G.STAGE_H - 10) {
      G.loadGrid(G.currentGX, G.currentGY + 1);
      p.y = 40;
    }
  });
})(G);
