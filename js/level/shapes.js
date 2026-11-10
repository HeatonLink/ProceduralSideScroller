(function (G) {
  function n(gx, gy, i) {
    return Math.abs((gx * 73856093) ^ (gy * 19349663) ^ (i * 83492791)) % 1000;
  }

  function box(list, x, y, w, h, dust, shape) {
    list.push({ x: x, y: y, w: w, h: h, dust: dust, shape: shape || "box" });
  }

  function ramp(list, x, y0, y1, w, dust) {
    const top = Math.min(y0, y1);
    list.push({
      x: x, y: top, w: w, h: Math.abs(y1 - y0) + 18,
      y0: y0, y1: y1, dust: dust, shape: "ramp"
    });
  }

  function stairs(list, x, y, steps, up, dust) {
    const sw = 28, sh = 16;
    for (let i = 0; i < steps; i++) {
      const sx = x + i * sw;
      const sy = up ? y - i * sh : y + i * sh;
      list.push({ x: sx, y: sy, w: sw + 2, h: sh + 4, dust: dust, shape: "step" });
    }
  }

  G.addShapes = function (list, gx, gy, fy, dust) {
    const h = function (i) { return n(gx, gy, i); };
    ramp(list, 40 + h(1) % 80, fy - 20, fy - 110, 160, dust);
    ramp(list, 700 + h(2) % 60, fy - 90, fy - 10, 180, dust);
    stairs(list, 220 + h(3) % 40, fy - 16, 6, true, dust);
    stairs(list, 820, fy - 120, 5, false, dust);
    box(list, 80 + h(4) % 50, fy - 220, 100, 16, dust, "ledge");
    box(list, 300, fy - 260, 180, 12, dust, "bridge");
    box(list, 520 + h(5) % 30, fy - 200, 90, 14, dust, "log");
    box(list, 140, fy - 340, 70, 18, dust, "cloud");
    box(list, 600, fy - 300, 80, 20, dust, "ice");
    box(list, 360 + h(6) % 40, fy - 160, 36, 36, dust, "crate");
    box(list, 400, fy - 196, 28, 36, dust, "crate");
    box(list, 50, fy - 180, 22, 160, dust, "pillar");
    box(list, 920, fy - 200, 22, 180, dust, "pillar");
    box(list, 200, fy - 280, 20, 80, dust, "pillar");
    box(list, 280, fy - 300, 100, 16, dust, "arch");
    box(list, 480 + h(7) % 40, fy - 240, 120, 10, dust, "ledge");
    box(list, 640, fy - 360, 60, 14, dust, "cloud");
    box(list, 100 + h(8) % 40, fy - 400, 140, 12, dust, "bridge");
    ramp(list, 500, fy - 150, fy - 230, 120, dust);
    stairs(list, 10, fy - 16, 4, true, dust);
    box(list, 760, fy - 180, 40, 40, dust, "crate");
    box(list, 250 + h(9) % 30, fy - 80, 90, 20, dust, "log");
    box(list, 430, fy - 420, 50, 12, dust, "ice");
    box(list, 160, fy - 150, 70, 16, dust, "mover");
    list[list.length - 1].baseX = list[list.length - 1].x;
    list[list.length - 1].range = 80;
    box(list, 700, fy - 320, 80, 14, dust, "mover");
    list[list.length - 1].baseX = list[list.length - 1].x;
    list[list.length - 1].range = 60;
  };

  G.surfaceY = function (p, x) {
    if (p.shape !== "ramp") return p.y;
    const t = Math.max(0, Math.min(1, (x - p.x) / Math.max(1, p.w)));
    return p.y0 + (p.y1 - p.y0) * t;
  };

  G.addUpdate(function () {
    if (G.state !== "play") return;
    const t = (G.frame || 0) * 0.02;
    for (const p of (G.platforms || [])) {
      if (p.shape !== "mover" || p.baseX == null) continue;
      p.x = p.baseX + Math.sin(t + p.baseX * 0.01) * (p.range || 60);
    }
  });
})(G);
