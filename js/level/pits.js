(function (G) {
  G.pits = [];

  G.addPit = function (x, w, platformIndex) {
    G.pits.push({ x, w, platformIndex: platformIndex || 0, open: false });
  };

  G.openPit = function (pit) {
    if (pit.open) return;
    pit.open = true;
    const plats = G.platforms || [];
    const ground = plats[pit.platformIndex];
    if (!ground) return;
    const leftW = Math.max(0, pit.x - ground.x);
    const rightX = pit.x + pit.w;
    const rightW = Math.max(0, (ground.x + ground.w) - rightX);
    const y = ground.y;
    const h = ground.h;
    plats.splice(pit.platformIndex, 1);
    if (leftW > 8) plats.unshift({ x: ground.x, y, w: leftW, h });
    if (rightW > 8) plats.push({ x: rightX, y, w: rightW, h });
    for (let i = 0; i < 12; i++) {
      G.addParticle(pit.x + Math.random() * pit.w, y, (Math.random() - 0.5) * 4, -2, 30, "#8d6e63", 4);
    }
  };

  G.checkPits = function (p) {
    if (!p) return;
    for (const pit of G.pits) {
      if (pit.open) continue;
      const feet = p.x + p.w / 2;
      if (feet >= pit.x && feet <= pit.x + pit.w && p.grounded) {
        G.openPit(pit);
      }
    }
  };

  G.addDraw("world", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
    const fy = G.FLOOR_Y || 480;
    for (const pit of G.pits) {
      if (!pit.open) {
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pit.x, fy);
        ctx.lineTo(pit.x + pit.w / 2, fy + 10);
        ctx.lineTo(pit.x + pit.w, fy);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(pit.x, fy, pit.w, 120);
      }
    }
    ctx.restore();
  });

  G.addUpdate(function () {
    if (G.state === "play" && G.player) G.checkPits(G.player);
  });
})(G);
