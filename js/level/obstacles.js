(function (G) {
  function n(gx, gy, i) {
    return Math.abs((gx * 83492791) ^ (gy * 2971215073) ^ (i * 4807526976)) % 1000;
  }

  function add(list, type, x, y, w, h, dmg) {
    list.push({ type: type, x: x, y: y, w: w, h: h, dmg: dmg, t: 0 });
  }

  G.addObstacles = function (list, gx, gy, fy) {
    const h = function (i) { return n(gx, gy, i); };
    const skip = gx === 0 && gy === 0;
    add(list, "spike", 180 + h(1) % 40, fy - 16, 48, 16, 12);
    add(list, "spike", 540 + h(2) % 50, fy - 16, 64, 16, 12);
    add(list, "spike", 300, fy - 156, 40, 14, 10);
    add(list, "lava", 240 + h(3) % 30, fy - 10, 70, 14, 16);
    add(list, "lava", 680, fy - 10, 90, 14, 16);
    add(list, "saw", 420 + h(4) % 40, fy - 80, 28, 28, 14);
    add(list, "saw", 760, fy - 220, 26, 26, 14);
    add(list, "jet", 120 + h(5) % 40, fy - 40, 18, 40, 10);
    add(list, "jet", 860, fy - 50, 18, 50, 10);
    add(list, "thorn", 200, fy - 200, 60, 16, 8);
    add(list, "thorn", 500 + h(6) % 40, fy - 280, 50, 16, 8);
    add(list, "poison", 360, fy - 8, 80, 12, 8);
    add(list, "ice", 90 + h(7) % 30, fy - 140, 36, 14, 10);
    add(list, "zap", 640, fy - 160, 22, 22, 12);
    add(list, "rock", 480, fy - 360, 24, 24, 18);
    add(list, "crusher", 800, fy - 300, 40, 20, 20);
    if (skip) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].x < 160 && list[i].y > fy - 40) list.splice(i, 1);
      }
    }
  };

  G.hurtFrom = function (p, x, type, dmg) {
    if (!p || p.iFrames > 0) return;
    if (G.flags && G.flags.shield > 0) return;
    p.lastHit = type || "pierce";
    p.hp -= dmg || 8;
    p.iFrames = G.IFRAMES || 45;
    p.knock = 10;
    p.vx = p.x < x ? -4 : 4;
    p.vy = -5;
    if (p.hp <= 0 && G.killPlayer) G.killPlayer(p, p.lastHit);
  };

  G.addUpdate(function () {
    if (G.state !== "play" || !G.player) return;
    const p = G.player;
    const box = { x: p.x, y: p.y, w: p.w, h: p.h };
    for (const o of (G.obstacles || [])) {
      o.t = (o.t || 0) + 1;
      if (o.type === "rock") o.y = o.baseY + ((o.t % 120) < 40 ? (o.t % 120) * 4 : 0);
      if (o.type === "crusher") o.y = o.baseY + Math.max(0, Math.sin(o.t * 0.04) * 80);
      if (o.type === "jet" && (o.t % 80) > 50) continue;
      if (G.overlap(box, o)) G.hurtFrom(p, o.x, o.type === "lava" ? "fire" : "pierce", o.dmg);
    }
  });

  G.addDraw("world", function (ctx) {
    ctx.save();
    ctx.translate(-Math.round(G.camX), -Math.round(G.camY));
    for (const o of (G.obstacles || [])) G.drawObstacle(ctx, o);
    ctx.restore();
  });

  G.drawObstacle = function (ctx, o) {
    const x = o.x, y = o.y;
    if (o.type === "spike" || o.type === "ice") {
      ctx.fillStyle = o.type === "ice" ? "#b3e5fc" : "#cfd8dc";
      for (let i = 0; i < o.w; i += 12) {
        ctx.beginPath();
        ctx.moveTo(x + i, y + o.h);
        ctx.lineTo(x + i + 6, y);
        ctx.lineTo(x + i + 12, y + o.h);
        ctx.fill();
      }
      return;
    }
    if (o.type === "lava" || o.type === "poison") {
      ctx.fillStyle = o.type === "lava" ? "#ff5722" : "#43a047";
      ctx.fillRect(x, y, o.w, o.h);
      ctx.fillStyle = o.type === "lava" ? "#ffcc80" : "#a5d6a7";
      ctx.fillRect(x, y, o.w, 4);
      return;
    }
    if (o.type === "saw") {
      ctx.save();
      ctx.translate(x + o.w / 2, y + o.h / 2);
      ctx.rotate((o.t || 0) * 0.2);
      ctx.fillStyle = "#90a4ae";
      ctx.beginPath();
      ctx.arc(0, 0, o.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#eceff1";
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (o.type === "jet") {
      const on = (o.t % 80) < 50;
      ctx.fillStyle = on ? "#ff7043" : "#5d4037";
      ctx.fillRect(x, on ? y : y + o.h - 8, o.w, on ? o.h : 8);
      return;
    }
    if (o.type === "thorn") {
      ctx.fillStyle = "#2e7d32";
      for (let i = 0; i < o.w; i += 10) {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + i + 5, y + o.h);
        ctx.lineTo(x + i + 10, y);
        ctx.fill();
      }
      return;
    }
    if (o.type === "zap") {
      ctx.fillStyle = "#fdd835";
      ctx.beginPath();
      ctx.arc(x + o.w / 2, y + o.h / 2, o.w / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.fillStyle = o.type === "crusher" ? "#616161" : "#6d4c41";
    ctx.fillRect(x, y, o.w, o.h);
  };
})(G);
