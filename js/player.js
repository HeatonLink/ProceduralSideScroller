(function (G) {
  G.makePlayer = function () {
    const rig = G.makeHuman(1);
    return {
      x: 80, y: 500, vx: 0, vy: 0, w: 36, h: 72,
      hp: G.MAX_HP, facing: 1, grounded: false,
      coyote: 0, buffer: 0, attack: 0, anim: 0,
      rig, state: "idle"
    };
  };

  G.updatePlayer = function (p, dt) {
    p.anim += dt;
    const left = G.pressed("KeyA") || G.pressed("ArrowLeft");
    const right = G.pressed("KeyD") || G.pressed("ArrowRight");
    const jump = G.justPressed("Space") || G.justPressed("ArrowUp");
    const atk = G.justPressed("KeyJ");

    if (left) { p.vx = -G.SPEED; p.facing = -1; }
    else if (right) { p.vx = G.SPEED; p.facing = 1; }
    else p.vx *= G.FRICTION;

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

    if (p.buffer > 0 && p.coyote > 0) {
      p.vy = G.JUMP;
      p.buffer = 0;
      p.coyote = 0;
      p.grounded = false;
      for (let i = 0; i < 6; i++) G.addParticle(p.x + 18, p.y + 70, (Math.random()-0.5)*3, -1, 20, "#aaa", 3);
    }

    p.x += p.vx;
    p.y += p.vy;
    p.y = Math.max(0, p.y);

    if (atk && p.attack <= 0) p.attack = 18;
    if (p.attack > 0) p.attack--;

    if (p.attack > 0) p.state = "attack";
    else if (!p.grounded) p.state = p.vy < 0 ? "jump" : "fall";
    else if (Math.abs(p.vx) > 0.5) p.state = "walk";
    else p.state = "idle";

    G.animate(p);
  };

  G.animate = function (p) {
    const r = p.rig;
    const t = p.anim * 0.15;
    const f = p.facing;
    // reset
    r.torso.ang = -90 + Math.sin(t * 2) * 2;
    r.head.ang = 0;
    r.lArm.ang = 20; r.lFore.ang = 10;
    r.rArm.ang = -20; r.rFore.ang = -10;
    r.lThigh.ang = 10; r.lShin.ang = 5;
    r.rThigh.ang = -10; r.rShin.ang = -5;

    if (p.state === "walk") {
      const s = Math.sin(t * 8);
      r.lThigh.ang = 30 * s; r.lShin.ang = Math.max(0, -20 * s);
      r.rThigh.ang = -30 * s; r.rShin.ang = Math.max(0, 20 * s);
      r.lArm.ang = -25 * s; r.rArm.ang = 25 * s;
      r.torso.ang = -90 + s * 4;
    } else if (p.state === "jump") {
      r.lArm.ang = -40; r.rArm.ang = -40;
      r.lThigh.ang = 20; r.rThigh.ang = -20;
      r.lShin.ang = 30; r.rShin.ang = 30;
    } else if (p.state === "fall") {
      r.lArm.ang = 30; r.rArm.ang = 30;
      r.lThigh.ang = 10; r.rThigh.ang = -10;
    } else if (p.state === "attack") {
      const a = 1 - p.attack / 18;
      r.rArm.ang = -20 - 90 * a;
      r.rFore.ang = -30 * a;
    }
    G.pose(r.root, p.x + 18, p.y + 20, 0);
  };

  G.drawPlayer = function (ctx, p) {
    const col = p.attack > 0 ? "#ffcc44" : "#4a90d9";
    G.drawBone(ctx, p.rig.root, col);
    // head circle
    const h = p.rig.head;
    const hx = h.x + Math.cos(h.ang * Math.PI/180) * h.len;
    const hy = h.y + Math.sin(h.ang * Math.PI/180) * h.len;
    ctx.fillStyle = "#f5d7b5";
    ctx.beginPath();
    ctx.arc(hx, hy - 8, 12, 0, Math.PI * 2);
    ctx.fill();
  };
})(G);
