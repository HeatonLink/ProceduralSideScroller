(function (G) {
  G.platforms = [
    { x: 0, y: 620, w: 400, h: 100 },
    { x: 500, y: 560, w: 180, h: 30 },
    { x: 760, y: 480, w: 200, h: 30 },
    { x: 1050, y: 520, w: 160, h: 30 },
    { x: 1300, y: 420, w: 220, h: 30 },
    { x: 1600, y: 580, w: 300, h: 30 },
    { x: 2000, y: 500, w: 180, h: 30 },
    { x: 2300, y: 440, w: 250, h: 30 },
    { x: 2700, y: 600, w: 400, h: 40 },
    { x: 0, y: 720, w: 4000, h: 50 } // ground
  ];

  G.coins = [
    { x: 540, y: 520, got: false },
    { x: 820, y: 440, got: false },
    { x: 1350, y: 380, got: false },
    { x: 1680, y: 540, got: false },
    { x: 2100, y: 460, got: false },
    { x: 2400, y: 400, got: false }
  ];

  G.overlap = function (a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  };

  G.onGround = function (px, py, pw, ph) {
    const feet = { x: px + 4, y: py + ph - 2, w: pw - 8, h: 6 };
    for (const p of G.platforms) if (G.overlap(feet, p)) return p.y;
    return null;
  };
})(G);
