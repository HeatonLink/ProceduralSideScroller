(function (G) {
  G.enemies = [
    { x: 700, y: 400, vx: 1.2, w: 32, h: 64, hp: 40, dir: 1, range: 120, home: 700, anim: 0, rig: G.makeHuman(0.85), state: "walk" },
    { x: 1400, y: 340, vx: 1.5, w: 32, h: 64, hp: 50, dir: 1, range: 100, home: 1400, anim: 0, rig: G.makeHuman(0.9), state: "walk" },
    { x: 1900, y: 500, vx: 1, w: 32, h: 64, hp: 30, dir: -1, range: 150, home: 1900, anim: 0, rig: G.makeHuman(0.8), state: "walk" }
  ];

  G.updateEnemies = function () {
    for (const e of G.enemies) {
      if (e.hp <= 0) continue;
      e.anim += 1;
      e.x += e.vx * e.dir;
      if (Math.abs(e.x - e.home) > e.range) e.dir *= -1;
      const gy = G.onGround(e.x, e.y, e.w, e.h);
      if (gy !== null) e.y = gy - e.h;
      else e.y += 2;
      // simple walk anim
      const r = e.rig;
      const s = Math.sin(e.anim * 0.2);
      r.lThigh.ang = 25 * s; r.rThigh.ang = -25 * s;
      r.lArm.ang = -20 * s; r.rArm.ang = 20 * s;
      r.torso.ang = -90;
      G.pose(r.root, e.x + 16, e.y + 18, 0);
    }
  };

  G.drawEnemies = function (ctx) {
    for (const e of G.enemies) {
      if (e.hp <= 0) continue;
      G.drawBone(ctx, e.rig.root, "#e74c3c");
      const h = e.rig.head;
      const hx = h.x + Math.cos(h.ang * Math.PI/180) * h.len;
      const hy = h.y + Math.sin(h.ang * Math.PI/180) * h.len;
      ctx.fillStyle = "#f5b7b1";
      ctx.beginPath();
      ctx.arc(hx, hy - 6, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  G.hitEnemies = function (px, py, facing) {
    const box = { x: px + (facing > 0 ? 20 : -40), y: py + 10, w: 50, h: 40 };
    for (const e of G.enemies) {
      if (e.hp <= 0) continue;
      if (G.overlap(box, { x: e.x, y: e.y, w: e.w, h: e.h })) {
        e.hp -= 15;
        e.x += facing * 12;
        for (let i = 0; i < 8; i++) G.addParticle(e.x + 16, e.y + 20, (Math.random()-0.5)*6, -3, 25, "#ff5555", 4);
        if (e.hp <= 0) G.score += 50;
      }
    }
  };
})(G);
