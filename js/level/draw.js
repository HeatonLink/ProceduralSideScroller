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

  function drawShape(ctx, p) {
    const x = Math.round(p.x), y = Math.round(p.y), w = Math.ceil(p.w), h = p.h;
    const s = p.shape || "box";
    ctx.fillStyle = p.ground || "#3e2723";
    if (s === "ramp") {
      ctx.beginPath();
      ctx.moveTo(x, p.y0);
      ctx.lineTo(x + w, p.y1);
      ctx.lineTo(x + w, Math.max(p.y0, p.y1) + 16);
      ctx.lineTo(x, Math.max(p.y0, p.y1) + 16);
      ctx.closePath();
      ctx.fill();
      return;
    }
    if (s === "log") {
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    if (s === "cloud") {
      ctx.fillStyle = "#eceff1";
      ctx.beginPath();
      ctx.ellipse(x + w * 0.3, y + 8, w * 0.28, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(x + w * 0.6, y + 6, w * 0.32, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.fillRect(x, y, w + 1, h);
    ctx.fillStyle = s === "ice" ? "#e1f5fe" : (p.color || "#4caf50");
    ctx.fillRect(x, y, w + 1, s === "pillar" ? 6 : 8);
    if (s === "crate") {
      ctx.strokeStyle = "#5d4037";
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    }
    if (s === "bridge") {
      ctx.strokeStyle = "#3e2723";
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + w, y);
      ctx.stroke();
    }
  }

  G.addDraw("world", function (ctx) {
    ctx.save();
    ctx.translate(-Math.round(G.camX), -Math.round(G.camY));
    for (const p of (G.platforms || [])) drawShape(ctx, p);
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
