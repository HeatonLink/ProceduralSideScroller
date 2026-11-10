(function (G) {
  G.BAR_W = 32;

  G.drawBar = function (ctx, x, y, hp, max) {
    if (max == null || max <= 0) max = Math.max(1, hp || 1);
    const ratio = Math.max(0, Math.min(1, hp / max));
    const w = G.BAR_W;
    ctx.fillStyle = "#222";
    ctx.fillRect(x, y, w, 4);
    ctx.fillStyle = ratio > 0.5 ? "#4caf50" : ratio > 0.25 ? "#ffb74d" : "#e74c3c";
    ctx.fillRect(x, y, w * ratio, 4);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, 4);
  };

  G.addDraw("fx", function (ctx, player) {
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
    if (player && player.hp > 0) {
      G.drawBar(ctx, player.x, player.y - 8, player.hp, player.maxHp || G.MAX_HP);
    }
    for (const e of (G.enemies || [])) {
      if (e.hp <= 0) continue;
      G.drawBar(ctx, e.x, e.y - 6, e.hp, e.maxHp || e.hp);
    }
    for (const b of (G.bosses || [])) {
      if (b.hp <= 0) continue;
      G.drawBar(ctx, b.x, b.y - 8, b.hp, b.maxHp || b.hp);
    }
    for (const n of (G.npcs || [])) {
      if (n.hp == null || n.hp <= 0) continue;
      if (G.npcInCell && !G.npcInCell(n)) continue;
      G.drawBar(ctx, n.x, n.y - 6, n.hp, n.maxHp || n.hp);
    }
    ctx.restore();
  });
})(G);
