(function (G) {
  G.drawWorld = function (ctx) {
    // sky
    const g = ctx.createLinearGradient(0, 0, 0, G.H);
    g.addColorStop(0, "#87ceeb");
    g.addColorStop(1, "#e0f6ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, G.W, G.H);

    // far hills
    ctx.fillStyle = "#a8d5a2";
    ctx.beginPath();
    ctx.moveTo(0, 500);
    for (let x = 0; x <= G.W; x += 40) {
      const wx = x + G.camX * 0.3;
      ctx.lineTo(x, 480 + Math.sin(wx * 0.01) * 30);
    }
    ctx.lineTo(G.W, G.H);
    ctx.lineTo(0, G.H);
    ctx.fill();

    ctx.save();
    ctx.translate(-G.camX, 0);

    // platforms
    ctx.fillStyle = "#5d4037";
    for (const p of G.platforms) {
      if (p.y >= 700) continue;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(p.x, p.y, p.w, 8);
      ctx.fillStyle = "#5d4037";
    }
    // ground
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(0, 720, 4000, 100);

    // coins
    ctx.fillStyle = "#ffd700";
    for (const c of G.coins) {
      if (c.got) continue;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ccaa00";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  };

  G.drawAll = function (ctx, player) {
    G.drawWorld(ctx);
    ctx.save();
    ctx.translate(-G.camX, 0);
    G.drawEnemies(ctx);
    G.drawPlayer(ctx, player);
    G.drawParticles(ctx);
    ctx.restore();
  };
})(G);
