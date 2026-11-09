(function (G) {
  // Pit traps: walk over the trigger and the ground section is removed.
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
    // Split the ground: left piece, gap, right piece
    const leftW = Math.max(0, pit.x - ground.x);
    const rightX = pit.x + pit.w;
    const rightW = Math.max(0, (ground.x + ground.w) - rightX);
    const y = ground.y;
    const h = ground.h;
    // Replace the original ground with left + right
    plats.splice(pit.platformIndex, 1);
    if (leftW > 8) plats.unshift({ x: ground.x, y, w: leftW, h });
    if (rightW > 8) plats.push({ x: rightX, y, w: rightW, h });
    // Particles to show the collapse
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

  // Draw open pits as dark gaps (already no platform, but mark the danger)
  G.addDraw("world", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, 0);
    for (const pit of G.pits) {
      if (!pit.open) {
        // Subtle warning cracks
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pit.x, 900);
        ctx.lineTo(pit.x + pit.w / 2, 910);
        ctx.lineTo(pit.x + pit.w, 900);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(pit.x, 900, pit.w, 100);
      }
    }
    ctx.restore();
  });

  G.addUpdate(function () {
    if (G.state === "play" && G.player) G.checkPits(G.player);
  });
})(G);
