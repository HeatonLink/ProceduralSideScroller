(function (G) {
  G.makePlayer = function () {
    const rig = G.makeRig("player", 1);
    const floor = G.FLOOR_Y || 480;
    return {
      x: 80, y: floor - 28, vx: 0, vy: 0, w: 20, h: 28,
      hp: G.MAX_HP, maxHp: G.MAX_HP, facing: 1, grounded: false,
      coyote: 0, buffer: 0, attack: 0, anim: 0,
      iFrames: 0, knock: 0,
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

    const gy = G.onGround(p.x, p.y, p.w, p.h);
    p.grounded = gy !== null;
    if (p.grounded) {
      p.coyote = G.COYOTE;
      p.y = gy - p.h;
      p.vy = 0;
    } else {
      p.coyote = Math.max(0, p.coyote - 1);
      p.vy += G.GRAVITY;
    }

    if (p.buffer > 0 && p.coyote > 0 && p.knock <= 0) {
      p.vy = G.JUMP;
      p.buffer = 0;
      p.coyote = 0;
      p.grounded = false;
      for (let i = 0; i < 4; i++) G.addParticle(p.x + 6, p.y + 18, (Math.random()-0.5)*2, -1, 16, "#aaa", 2);
    }

    p.x += p.vx;
    p.y += p.vy;
    p.x = Math.max(0, Math.min(G.STAGE_W - p.w, p.x));
    p.y = Math.max(0, p.y);

    if (atk && p.attack <= 0) p.attack = 18;
    if (p.attack > 0) p.attack--;

    if (p.attack > 0) p.state = "attack";
    else if (!p.grounded) p.state = p.vy < 0 ? "jump" : "fall";
    else if (Math.abs(p.vx) > 0.5) p.state = "walk";
    else p.state = "idle";

    G.animate(p);
  };

  function setAng(bone, ang) { if (bone) bone.ang = ang; }

  G.animate = function (p) {
    const r = p.rig;
    if (!r || !r.root) return;
    const t = p.anim * 0.15;
    setAng(r.torso, -90 + Math.sin(t * 2) * 2);
    setAng(r.head, 0);
    setAng(r.lEar, -50);
    setAng(r.rEar, 50);
    if (r.tail) setAng(r.tail, 160 + Math.sin(t * 4) * 8);
    setAng(r.tail2, 20);
    setAng(r.lArm, 20); setAng(r.lFore, 10);
    setAng(r.rArm, -20); setAng(r.rFore, -10);
    setAng(r.lThigh, 85); setAng(r.lShin, 8);
    setAng(r.rThigh, 95); setAng(r.rShin, -6);

    if (p.state === "walk") {
      const s = Math.sin(t * 10);
      setAng(r.lThigh, 90 + 28 * s); setAng(r.lShin, Math.max(0, 12 - 15 * s));
      setAng(r.rThigh, 90 - 28 * s); setAng(r.rShin, Math.max(0, 12 + 15 * s));
      setAng(r.lArm, -22 * s); setAng(r.rArm, 22 * s);
      setAng(r.torso, -90 + s * 4);
      if (r.tail) setAng(r.tail, 160 + s * 12);
    } else if (p.state === "jump") {
      setAng(r.lArm, -40); setAng(r.rArm, -40);
      setAng(r.lThigh, 70); setAng(r.rThigh, 110);
      setAng(r.lShin, 40); setAng(r.rShin, 35);
    } else if (p.state === "fall") {
      setAng(r.lArm, 25); setAng(r.rArm, 25);
      setAng(r.lThigh, 80); setAng(r.rThigh, 100);
      setAng(r.lShin, 15); setAng(r.rShin, 10);
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
    if (!(player.iFrames > 0 && Math.floor(player.iFrames / 3) % 2 === 0)) {
      const cx = player.x + player.w / 2;
      const cy = player.y + player.h * 0.45;
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
          ctx.arc(hx - 4, hy - 5, 3, 0, Math.PI * 2);
          ctx.arc(hx + 4, hy - 5, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  });

  G.addUpdate(function () {
    if (G.player && G.state === "play") G.updatePlayer(G.player, 1);
  });
})(G);
