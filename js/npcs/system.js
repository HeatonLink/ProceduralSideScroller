(function (G) {
  G.flags = G.flags || {};
  G.talking = null;
  G.talkIndex = 0;

  G.spawnNpcs = function () {
    G.npcs = [];
    for (const def of (G.NPC_DEFS || [])) {
      const npc = Object.assign({}, G.NPC_DEFAULT, def);
      npc.gx = def.gx;
      npc.gy = def.gy;
      npc.homeX = def.x;
      npc.x = def.x;
      npc.y = 820;
      if (!npc.rig && G.makeRig) npc.rig = G.makeRig("npc", npc.scale);
      const moved = G.flags["moved_" + npc.id];
      if (moved) {
        npc.gx = moved.gx;
        npc.gy = moved.gy;
        npc.x = moved.x || npc.x;
      }
      G.npcs.push(npc);
    }
  };

  G.npcInCell = function (npc) {
    return npc.gx === G.currentGX && npc.gy === G.currentGY;
  };

  G.startTalk = function (npc) {
    G.talking = npc;
    G.talkIndex = 0;
    G.flags["talked_" + npc.id] = true;
    npc.talked = true;
  };

  G.chooseOption = function () {
    const npc = G.talking;
    if (!npc || !npc.options) return;
    const opt = npc.options[G.talkIndex];
    if (!opt) return;
    if (opt.flag) G.flags[opt.flag] = true;
    if (opt.to) {
      npc.gx = opt.to.gx;
      npc.gy = opt.to.gy;
      npc.x = opt.to.x || 200;
      G.flags["moved_" + npc.id] = { gx: npc.gx, gy: npc.gy, x: npc.x };
    }
    G.talking = null;
    if (G.saveRun) G.saveRun();
  };

  G.addUpdate(function () {
    if (G.state !== "play" || !G.player) return;
    if (G.talking) {
      const opts = G.talking.options || [];
      if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.talkIndex = (G.talkIndex + 1) % Math.max(1, opts.length);
      if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.talkIndex = (G.talkIndex - 1 + Math.max(1, opts.length)) % Math.max(1, opts.length);
      if (G.justPressed("Enter") || G.justPressed("Space")) G.chooseOption();
      if (G.justPressed("Escape")) G.talking = null;
      return;
    }
    if (G.justPressed("KeyE") || G.justPressed("Enter")) {
      for (const npc of G.npcs) {
        if (!G.npcInCell(npc)) continue;
        if (Math.abs(G.player.x - npc.x) < 60 && Math.abs(G.player.y - npc.y) < 80) {
          G.startTalk(npc);
          return;
        }
      }
    }
  });

  G.addDraw("npcs", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
    for (const npc of (G.npcs || [])) {
      if (!G.npcInCell(npc)) continue;
      if (npc.rig) {
        npc.rig.torso.ang = -90;
        G.pose(npc.rig.root, npc.x + 16, npc.y + 18, 0);
        G.drawBone(ctx, npc.rig.root, npc.color || "#27ae60");
      } else {
        ctx.fillStyle = npc.color || "#27ae60";
        ctx.fillRect(npc.x, npc.y, npc.w, npc.h);
      }
      ctx.fillStyle = "#fff";
      ctx.font = "12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(npc.name, npc.x + 16, npc.y - 8);
    }
    ctx.restore();

    if (G.talking) {
      const npc = G.talking;
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(40, G.H - 180, G.W - 80, 150);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(npc.name, 60, G.H - 150);
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillText(npc.text || "...", 60, G.H - 120);
      (npc.options || []).forEach((opt, i) => {
        ctx.fillStyle = i === G.talkIndex ? "#ffe2a8" : "#ddd";
        ctx.fillText((i === G.talkIndex ? "> " : "  ") + opt.label, 70, G.H - 90 + i * 22);
      });
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", G.spawnNpcs);
  } else {
    setTimeout(G.spawnNpcs, 0);
  }
})(G);
