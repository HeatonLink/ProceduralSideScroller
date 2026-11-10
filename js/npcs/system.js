(function (G) {
  G.flags = G.flags || {};
  G.talking = null;
  G.talkIndex = 0;

  G.npcWorldX = function (npc) {
    return (npc.gx || 0) * G.STAGE_W + (npc.homeX != null ? npc.homeX : npc.x);
  };

  G.spawnNpcs = function () {
    G.npcs = [];
    const fy = G.FLOOR_Y || 480;
    for (const def of (G.NPC_DEFS || [])) {
      const npc = Object.assign({}, G.NPC_DEFAULT, def);
      npc.gx = def.gx;
      npc.gy = def.gy;
      npc.homeX = def.x;
      npc.x = def.x;
      npc.y = fy - 40;
      if (!npc.rig && G.makeRig) npc.rig = G.makeRig("npc", npc.scale);
      const moved = G.flags["moved_" + npc.id];
      if (moved) {
        npc.gx = moved.gx;
        npc.gy = moved.gy;
        npc.homeX = moved.x || npc.homeX;
        npc.x = npc.homeX;
      }
      G.npcs.push(npc);
    }
  };

  G.npcNear = function (npc) {
    return Math.abs(npc.gx - G.currentGX) <= 1 && Math.abs(npc.gy - G.currentGY) <= 1;
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
      npc.homeX = opt.to.x || 200;
      npc.x = npc.homeX;
      G.flags["moved_" + npc.id] = { gx: npc.gx, gy: npc.gy, x: npc.homeX };
    }
    G.talking = null;
    if (G.saveRun) G.saveRun();
  };

  function setAng(bone, ang) { if (bone) bone.ang = ang; }

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
        if (!G.npcNear(npc)) continue;
        const nx = G.npcWorldX(npc);
        const ny = (npc.gy || 0) * G.STAGE_H + npc.y;
        if (Math.abs(G.player.x - nx) < 60 && Math.abs(G.player.y - ny) < 80) {
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
      if (!G.npcNear(npc)) continue;
      const nx = G.npcWorldX(npc);
      const ny = (npc.gy || 0) * G.STAGE_H + npc.y;
      if (npc.rig) {
        const r = npc.rig;
        setAng(r.torso, -90);
        setAng(r.head, 0);
        setAng(r.lArm, 15); setAng(r.lFore, 8);
        setAng(r.rArm, -15); setAng(r.rFore, -8);
        setAng(r.lThigh, 88); setAng(r.lShin, 4);
        setAng(r.rThigh, 92); setAng(r.rShin, -4);
        G.pose(r.root, nx + 16, ny + 18, 0);
        G.drawBone(ctx, r.root, npc.color || "#27ae60");
      } else {
        ctx.fillStyle = npc.color || "#27ae60";
        ctx.fillRect(nx, ny, npc.w, npc.h);
      }
      ctx.fillStyle = "#fff";
      ctx.font = "12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(npc.name, nx + 16, ny - 8);
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
