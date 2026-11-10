(function (G) {
  G.inventory = G.inventory || {};
  G.powerups = [];

  G.POWERUP_TYPES = {
    heal: { name: "Health Pack", color: "#e74c3c", effect: function () { if (G.player) G.player.hp = Math.min(G.MAX_HP, G.player.hp + 40); } },
    speed: { name: "Speed Boost", color: "#3498db", effect: function () { G.flags.speed_boost = (G.flags.speed_boost || 0) + 300; } },
    shield: { name: "Shield", color: "#9b59b6", effect: function () { G.flags.shield = (G.flags.shield || 0) + 200; } },
    coinbag: { name: "Coin Bag", color: "#f1c40f", effect: function () { G.score += 50; } }
  };

  G.addPowerup = function (x, y, type) {
    G.powerups.push({ x, y, type, got: false });
  };

  G.collectPowerup = function (pu) {
    if (pu.got) return;
    pu.got = true;
    if (G.markState && pu.gx != null) G.markState(pu.gx, pu.gy, "power", pu.i, { got: true });
    const def = G.POWERUP_TYPES[pu.type];
    if (!def) return;
    G.inventory[pu.type] = (G.inventory[pu.type] || 0) + 1;
    if (def.effect) def.effect();
    for (let i = 0; i < 10; i++) G.addParticle(pu.x, pu.y, (Math.random()-0.5)*4, -3, 30, def.color, 4);
    if (G.saveRun) G.saveRun();
  };

  G.checkPowerups = function (p) {
    if (!p) return;
    for (const pu of G.powerups) {
      if (pu.got) continue;
      if (Math.abs(p.x + p.w / 2 - pu.x) < 24 && Math.abs(p.y + p.h / 2 - pu.y) < 30) {
        G.collectPowerup(pu);
      }
    }
  };

  G.addDraw("items", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
    for (const pu of G.powerups) {
      if (pu.got) continue;
      const def = G.POWERUP_TYPES[pu.type] || { color: "#fff" };
      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pu.type[0].toUpperCase(), pu.x, pu.y + 4);
    }
    ctx.restore();
  });

  G.addUpdate(function () {
    if (G.state === "play" && G.player) G.checkPowerups(G.player);
    if (G.flags.speed_boost > 0) G.flags.speed_boost--;
    if (G.flags.shield > 0) G.flags.shield--;
  });
})(G);
