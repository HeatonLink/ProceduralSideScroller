(function (G) {
  // Surface types that change movement speed while the player stands on them.
  G.surfaces = [];

  G.addSurface = function (x, y, w, h, type) {
    G.surfaces.push({ x, y, w, h, type });
  };

  G.surfaceAt = function (px, py, pw, ph) {
    const feet = { x: px + 4, y: py + ph - 2, w: pw - 8, h: 8 };
    for (const s of G.surfaces) {
      if (feet.x < s.x + s.w && feet.x + feet.w > s.x &&
          feet.y < s.y + s.h && feet.y + feet.h > s.y) {
        return s.type;
      }
    }
    return "normal";
  };

  G.speedFor = function (type) {
    if (type === "slow") return G.SPEED * 0.45;
    if (type === "fast") return G.SPEED * 1.7;
    return G.SPEED;
  };

  G.addDraw("world", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, 0);
    for (const s of G.surfaces) {
      if (s.type === "slow") {
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.fillStyle = "#8d6e63";
        for (let i = 0; i < s.w; i += 12) {
          ctx.fillRect(s.x + i, s.y + 2, 6, 4);
        }
      } else if (s.type === "fast") {
        ctx.fillStyle = "#0277bd";
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.fillStyle = "#4fc3f7";
        for (let i = 0; i < s.w; i += 16) {
          ctx.beginPath();
          ctx.moveTo(s.x + i, s.y + s.h);
          ctx.lineTo(s.x + i + 6, s.y);
          ctx.lineTo(s.x + i + 12, s.y + s.h);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  });
})(G);
