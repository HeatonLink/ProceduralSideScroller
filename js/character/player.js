(function (G) {
  G.makePlayer = function () {
    const rig = G.makeRig("player", 1);
    const floor = G.FLOOR_Y || 480;
    return {
      x: 80, y: floor - 28, vx: 0, vy: 0, w: 20, h: 28,
      hp: G.MAX_HP, maxHp: G.MAX_HP, facing: 1, grounded: false,
      coyote: 0, buffer: 0, attack: 0, anim: 0,
      iFrames: 0, knock: 0,
      jumpT: 0, landT: 0,
      surface: "normal",
      weapon: 0,
      rig, state: "idle"
    };
  };

  function act(name, just) {
    if (just && G.actionJust) return G.actionJust(name);
    if (!just && G.actionPressed) return G.actionPressed(name);
    return false;
  }

  G.updatePlayer = function (p, dt) {
    p.anim += dt;
    if (p.iFrames > 0) p.iFrames--;
    if (p.knock > 0) p.knock--;
    if (p.jumpT > 0) p.jumpT--;
    if (p.landT > 0) p.landT--;

    const left = act("left") || G.pressed("KeyA") || G.pressed("ArrowLeft");
    const right = act("right") || G.pressed("KeyD") || G.pressed("ArrowRight");
    const jump = act("jump", true) || G.justPressed("Space") || G.justPressed("ArrowUp");
    const atk = act("attack", true) || G.justPressed("KeyJ");

    if (G.justPressed("KeyQ")) G.cycleWeapon(-1);
    if (G.justPressed("KeyE")) G.cycleWeapon(1);
    p.weapon = G.weaponIndex;

    p.surface = G.surfaceAt ? G.surfaceAt(p.x, p.y, p.w, p.h) : "normal";
    const speed = G.speedFor ? G.speedFor(p.surface) : G.SPEED;

    if (p.knock <= 0) {
      if (left) { p.vx = -speed; p.facing = -1; }
      else if (right) { p.vx = speed; p.facing = 1; }
      else p.vx *= G.FRICTION;
    } else {
      p.vx *= 0.92;
    }

    if (jump) p.buffer = G.BUFFER;
    if (p.buffer > 0) p.buffer--;

    const wasGround = p.grounded;
    const gy = G.onGround(p.x, p.y, p.w, p.h);
    p.grounded = gy !== null;
    if (p.grounded) {
      p.coyote = G.COYOTE;
      p.y = gy - p.h;
      p.vy = 0;
      if (!wasGround) p.landT = 8;
    } else {
      p.coyote = Math.max(0, p.coyote - 1);
      p.vy += G.GRAVITY;
    }

    if (p.buffer > 0 && p.coyote > 0 && p.knock <= 0) {
      p.vy = G.JUMP;
      p.buffer = 0;
      p.coyote = 0;
      p.grounded = false;
      p.jumpT = 6;
      p.landT = 0;
      for (let i = 0; i < 4; i++) G.addParticle(p.x + 6, p.y + 18, (Math.random()-0.5)*2, -1, 16, "#aaa", 2);
    }

    p.x += p.vx;
    p.y += p.vy;
    p.x = Math.max(0, Math.min(G.STAGE_W - p.w, p.x));
    p.y = Math.max(0, p.y);

    if (atk && p.attack <= 0) p.attack = 18;
    if (p.attack > 0) p.attack--;

    if (p.attack > 0) p.state = "attack";
    else if (p.landT > 0) p.state = "land";
    else if (!p.grounded) {
      if (p.jumpT > 0) p.state = "jump";
      else if (p.vy < 0) p.state = "rise";
      else p.state = "fall";
    } else if (Math.abs(p.vx) > 0.5) p.state = "walk";
    else p.state = "idle";

    G.animate(p);
  };

  function setAng(bone, ang) { if (bone) bone.ang = ang; }

  G.animate = function (p) {
    const r = p.rig;
    if (!r || !r.root) return;
    const t = p.anim * 0.15;
    const face = p.facing < 0 ? -1 : 1;
    setAng(r.torso, -90);
    setAng(r.head, 0);
    setAng(r.lEar, -50);
    setAng(r.rEar, 50);
    if (r.tail) setAng(r.tail, 160);
    setAng(r.tail2, 20);
    setAng(r.lArm, 20 * face); setAng(r.lFore, 10);
    setAng(r.rArm, -20 * face); setAng(r.rFore, -10);
    setAng(r.lThigh, 85); setAng(r.lShin, 8);
    setAng(r.rThigh, 95); setAng(r.rShin, -6);

    if (p.state === "walk") {
      const s = Math.sin(t * 10);
      setAng(r.lThigh, 90 + 28 * s); setAng(r.lShin, Math.max(0, 12 - 15 * s));
      setAng(r.rThigh, 90 - 28 * s); setAng(r.rShin, Math.max(0, 12 + 15 * s));
      setAng(r.lArm, -22 * s * face); setAng(r.rArm, 22 * s * face);
      setAng(r.torso, -90 + s * 4);
      if (r.tail) setAng(r.tail, 160 + s * 12);
    } else if (p.state === "jump") {
      setAng(r.torso, -100);
      setAng(r.lArm, -50); setAng(r.rArm, -50);
      setAng(r.lThigh, 60); setAng(r.rThigh, 120);
      setAng(r.lShin, 50); setAng(r.rShin, 45);
      if (r.tail) setAng(r.tail, 130);
    } else if (p.state === "rise") {
      setAng(r.torso, -95);
      setAng(r.lArm, -30); setAng(r.rArm, -30);
      setAng(r.lThigh, 75); setAng(r.rThigh, 105);
      setAng(r.lShin, 20); setAng(r.rShin, 15);
      if (r.tail) setAng(r.tail, 145);
    } else if (p.state === "fall") {
      setAng(r.torso, -80);
      setAng(r.lArm, 40); setAng(r.rArm, 40);
      setAng(r.lFore, 20); setAng(r.rFore, -20);
      setAng(r.lThigh, 100); setAng(r.rThigh, 80);
      setAng(r.lShin, 10); setAng(r.rShin, 25);
      if (r.tail) setAng(r.tail, 190);
    } else if (p.state === "land") {
      setAng(r.torso, -75);
      setAng(r.lArm, 30); setAng(r.rArm, 30);
      setAng(r.lThigh, 110); setAng(r.rThigh, 70);
      setAng(r.lShin, 40); setAng(r.rShin, 35);
      if (r.tail) setAng(r.tail, 175);
    } else if (p.state === "attack" && G.weaponPose) {
      G.weaponPose(r, p);
    } else if (p.state === "attack") {
      const a = 1 - p.attack / 18;
      setAng(r.rArm, -20 - 90 * a);
      setAng(r.rFore, -30 * a);
    }
    G.pose(r.root, p.x + p.w / 2, p.y + p.h * 0.55, 0);
  };

  G.addDraw("player", function (ctx, player) {
    if (!player) return;
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
    if (player.iFrames > 0 && Math.floor(player.iFrames / 3) % 2 === 0) {
      ctx.restore();
      return;
    }
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h * 0.45;
    const face = player.facing < 0 ? -1 : 1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(face, 1);
    ctx.translate(-cx, -cy);
    ctx.fillStyle = "#ff9800";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (player.rig && player.rig.root) {
      const w = G.currentWeapon ? G.currentWeapon() : { color: "#5d4037" };
      const col = player.attack > 0 ? w.color : "#5d4037";
      G.drawBone(ctx, player.rig.root, col);
      const h = player.rig.head;
      if (h) {
        const a = h.world != null ? h.world : h.ang;
        const hx = h.x + Math.cos(a * Math.PI / 180) * h.len;
        const hy = h.y + Math.sin(a * Math.PI / 180) * h.len;
        ctx.fillStyle = "#ffcc80";
        ctx.beginPath();
        ctx.arc(hx, hy - 1, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(hx + face * 3, hy - 5, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    ctx.restore();
  });

  G.addUpdate(function () {
    if (G.player && G.state === "play") G.updatePlayer(G.player, 1);
  });
})(G);
