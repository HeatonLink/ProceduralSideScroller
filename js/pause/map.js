(function (G) {
  G.visited = G.visited || {};

  G.markVisited = function (gx, gy) {
    const key = gx + "," + gy;
    if (!G.visited[key]) {
      G.visited[key] = true;
      G.flags["visited_" + key] = true;
    }
  };

  G.drawMap = function (ctx) {
    ctx.fillStyle = "rgba(8,12,24,0.85)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = "#f4f7ff";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MAP", G.W / 2, 60);

    const cell = 28;
    const range = 6;
    const ox = G.W / 2 - range * cell;
    const oy = 140;
    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        const gx = G.currentGX + dx;
        const gy = G.currentGY + dy;
        const key = gx + "," + gy;
        const vis = G.visited[key] || G.flags["visited_" + key];
        const x = ox + (dx + range) * cell;
        const y = oy + (dy + range) * cell;
        if (vis) {
          const theme = G.themeFor ? G.themeFor(gx, gy) : null;
          ctx.fillStyle = theme ? theme.color : "#4caf50";
        } else {
          ctx.fillStyle = "#555";
        }
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        if (gx === G.currentGX && gy === G.currentGY) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, cell, cell);
        }
      }
    }
    ctx.fillStyle = "#ddd";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Gray = unvisited   Colored = visited   White border = you", G.W / 2, oy + (range * 2 + 1) * cell + 30);
    ctx.fillText("Press Escape to return", G.W / 2, G.H - 40);
  };
})(G);
