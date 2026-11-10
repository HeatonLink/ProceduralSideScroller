(function (G) {
  G.addDraw("bg", function (ctx) {
    const theme = G.gridLevels && G.gridLevels[G.currentGX + "," + G.currentGY];
    const top = theme ? theme.color : "#87ceeb";
    const g = ctx.createLinearGradient(0, 0, 0, G.H);
    g.addColorStop(0, top);
    g.addColorStop(1, "#e0f6ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, G.W, G.H);
  });

  G.addDraw("world", function (ctx) {
    ctx.save();
    const cx = Math.round(G.camX);
    const cy = Math.round(G.camY);
    ctx.translate(-cx, -cy);
    for (const p of (G.platforms || [])) {
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      ctx.fillStyle = p.ground || "#3e2723";
      ctx.fillRect(x, y, Math.ceil(p.w) + 1, p.h);
      ctx.fillStyle = p.color || "#4caf50";
      ctx.fillRect(x, y, Math.ceil(p.w) + 1, 8);
    }
    ctx.restore();
  });

  G.addDraw("items", function (ctx) {
    ctx.save();
    ctx.translate(-Math.round(G.camX), -Math.round(G.camY));
    ctx.fillStyle = "#ffd700";
    for (const c of (G.coins || [])) {
      if (c.got) continue;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ccaa00";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  });

  G.addDraw("fx", function (ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(8, 8, 160, 28);
    ctx.fillStyle = "#fff";
    ctx.font = "16px system-ui, sans-serif";
    ctx.textAlign = "left";
    const theme = G.gridLevels && G.gridLevels[G.currentGX + "," + G.currentGY];
    const name = theme ? theme.theme : "";
    ctx.fillText("Grid " + (G.currentGX || 0) + "," + (G.currentGY || 0) + "  " + name, 16, 28);
  });

  G.drawAll = function (ctx, player) {
    G.drawLayers(ctx, player);
  };
})(G);
