(function (G) {
  G.pits = [];

  G.addPit = function (x, w, platformIndex) {
    G.pits.push({ x, w, platformIndex: platformIndex || 0, open: false });
  };

  function overPit(p, pit) {
    const feet = p.x + p.w / 2;
    return feet >= pit.x && feet <= pit.x + pit.w;
  }

  G.openPit = function (pit) {
    if (pit.open) return;
    pit.open = true;
    if (G.markState && pit.gx != null) G.markState(pit.gx, pit.gy, "pit", pit.i || 0, { open: true });
    if (G.rebuildActive) G.rebuildActive();
    const player = G.player;
    if (player && overPit(player, pit)) {
      player.grounded = false;
      player.coyote = 0;
      if (player.vy < 1) player.vy = 1;
    }
    const y = pit.y != null ? pit.y : (G.FLOOR_Y || 480);
    for (let i = 0; i < 12; i++) {
      G.addParticle(pit.x + Math.random() * pit.w, y, (Math.random() - 0.5) * 4, -2, 30, "#8d6e63", 4);
    }
  };

  G.checkPits = function (p) {
    if (!p) return;
    for (const pit of G.pits) {
      if (!overPit(p, pit)) continue;
      const near = Math.abs(p.y + p.h - (pit.y || G.FLOOR_Y || 480)) < 24;
      if (!pit.open && (p.grounded || near)) G.openPit(pit);
      if (pit.open && near) {
        p.grounded = false;
        p.coyote = 0;
        if (p.vy < 1) p.vy = 1;
      }
    }
  };

  G.addDraw("world", function (ctx) {
    ctx.save();
    ctx.translate(-Math.round(G.camX), -Math.round(G.camY));
    for (const pit of G.pits) {
      const y = pit.y != null ? pit.y : (G.FLOOR_Y || 480);
      if (!pit.open) {
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pit.x, y);
        ctx.lineTo(pit.x + pit.w / 2, y + 10);
        ctx.lineTo(pit.x + pit.w, y);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(pit.x, y, pit.w, 120);
      }
    }
    ctx.restore();
  });

  G.addUpdate(function () {
    if (G.state === "play" && G.player) G.checkPits(G.player);
  });
})(G);
