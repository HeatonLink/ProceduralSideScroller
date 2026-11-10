(function (G) {
  G.enemies = G.enemies || [];
  G.enemySeq = Object.create(null);

  G.enemyIdFor = function (e) {
    const gx = e.gx != null ? e.gx : (G.currentGX || 0);
    const gy = e.gy != null ? e.gy : (G.currentGY || 0);
    const type = e.type || e.name || "e";
    const key = gx + "," + gy + "," + type;
    G.enemySeq[key] = (G.enemySeq[key] || 0) + 1;
    return key + "#" + G.enemySeq[key];
  };

  G.addEnemy = function (def) {
    const e = Object.assign({}, G.ENEMY_DEFAULT, def);
    if (e.maxHp == null) e.maxHp = e.hp;
    if (!e.rig && G.makeRig) e.rig = G.makeRig("enemy", e.scale);
    if (e.home === 0) e.home = e.x;
    e.gx = e.gx != null ? e.gx : G.currentGX;
    e.gy = e.gy != null ? e.gy : G.currentGY;
    if (e.id == null) e.id = G.enemyIdFor(e);
    if (G.applyEnemyState) G.applyEnemyState(e);
    G.enemies.push(e);
  };

  function setAng(bone, ang) { if (bone) bone.ang = ang; }

  G.updateEnemies = function () {
    for (const e of G.enemies) {
      if (e.hp <= 0) continue;
      e.anim += 1;
      e.x += e.vx * e.dir;
      if (Math.abs(e.x - e.home) > e.range) e.dir *= -1;
      const gy = G.onGround(e.x, e.y, e.w, e.h);
      if (gy !== null) e.y = gy - e.h;
      else e.y += 2;
      const r = e.rig;
      if (!r || !r.root) continue;
      const s = Math.sin(e.anim * 0.2);
      setAng(r.lThigh, 90 + 22 * s); setAng(r.rThigh, 90 - 22 * s);
      setAng(r.lShin, Math.max(0, 10 - 8 * s)); setAng(r.rShin, Math.max(0, 10 + 8 * s));
      setAng(r.lArm, -18 * s); setAng(r.rArm, 18 * s);
      setAng(r.torso, -90);
      G.pose(r.root, e.x + (e.w || 32) / 2, e.y + 18, 0);
    }
  };

  G.addDraw("enemies", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, 0);
    for (const e of G.enemies) {
      if (e.hp <= 0 || !e.rig || !e.rig.root) continue;
      G.drawBone(ctx, e.rig.root, e.color || "#e74c3c");
      const h = e.rig.head;
      if (!h) continue;
      const hx = h.x + Math.cos(h.ang * Math.PI / 180) * h.len;
      const hy = h.y + Math.sin(h.ang * Math.PI / 180) * h.len;
      ctx.fillStyle = "#f5b7b1";
      ctx.beginPath();
      ctx.arc(hx, hy - 6, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  G.hitEnemies = function (px, py, facing) {
    const box = { x: px + (facing > 0 ? 8 : -20), y: py, w: 22, h: 18 };
    const w = G.currentWeapon ? G.currentWeapon() : { dmg: 15 };
    const dmg = w.dmg || 15;
    for (const e of G.enemies) {
      if (e.hp <= 0) continue;
      if (G.overlap(box, { x: e.x, y: e.y, w: e.w, h: e.h })) {
        e.hp -= dmg;
        e.x += facing * 12;
        for (let i = 0; i < 8; i++) G.addParticle(e.x + 16, e.y + 20, (Math.random() - 0.5) * 6, -3, 25, "#ff5555", 4);
        if (e.hp <= 0) {
          G.score += 50;
          if (G.recordEnemy) G.recordEnemy(e);
        }
      }
    }
  };

  G.addUpdate(function () { G.updateEnemies(); });
})(G);
