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
    ctx.translate(-G.camX, -G.camY);
    const theme = G.gridLevels && G.gridLevels[G.currentGX + "," + G.currentGY];
    const ground = theme ? theme.ground : "#5d4037";
    const top = theme ? theme.color : "#4caf50";
    for (const p of (G.platforms || [])) {
      ctx.fillStyle = ground;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = top;
      ctx.fillRect(p.x, p.y, p.w, 8);
    }
    ctx.restore();
  });

  G.addDraw("items", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
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
