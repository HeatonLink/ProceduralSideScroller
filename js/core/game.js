(function (G) {
  G.state = "menu";
  G.score = 0;
  G.player = null;
  G.canvas = null;
  G.ctx = null;
  G.IFRAMES = 45;

  G.startGame = function (fromSave) {
    if (G.loadGrid) G.loadGrid(0, 0);
    if (!fromSave) {
      G.player = G.makePlayer();
      G.score = 0;
      G.inventory = {};
      G.visited = {};
      G.status = { burn: 0, freeze: 0, poison: 0, slow: 0, stun: 0, bleed: 0, shock: 0 };
      for (const e of (G.enemies || [])) { e.hp = e.maxHp || e.hp || 40; e.x = e.home; }
      if (!G.activeSave) G.createSave();
    } else if (!G.player) {
      G.player = G.makePlayer();
    }
    if (!G.platforms || !G.platforms.length) {
      G.platforms = [{ x: 0, y: G.FLOOR_Y || 480, w: 1000, h: 120 }];
    }
    const floor = G.FLOOR_Y || 480;
    if (G.player) {
      G.player.x = 80;
      G.player.y = floor - (G.player.h || 48);
      G.player.vx = 0;
      G.player.vy = 0;
    }
    G.particles = [];
    G.camX = 0;
    G.camY = Math.max(0, floor - G.PLAY_H + 80);
    if (G.player && G.updateCamera) G.updateCamera(G.player.x, G.player.y, true);
    G.state = "play";
    G.subState = null;
    document.getElementById("hud").classList.remove("hidden");
    document.getElementById("dead").classList.add("hidden");
  };

  function pauseKey() {
    if (G.actionJust) return G.actionJust("pause");
    return G.justPressed("Escape");
  }

  G.killPlayer = function (p, type) {
    p.hp = 0;
    p.deathType = type || p.lastHit || "blunt";
    p.deathAnim = 0;
    G.state = "dead";
    document.getElementById("dead").classList.remove("hidden");
  };

  G.hurtPlayer = function (p, e) {
    if (p.iFrames > 0) return;
    if (G.flags && G.flags.shield > 0) return;
    if (G.applyAttack) G.applyAttack(e, p);
    else p.hp -= 8;
    p.iFrames = G.IFRAMES;
    p.knock = 12;
    const dir = p.x < e.x ? -1 : 1;
    p.vx = dir * 5;
    p.vy = -6;
    if (p.hp <= 0) G.killPlayer(p, p.lastHit);
  };

  G.update = function () {
    if (G.state === "menu") {
      if (G.subState === "saves") { G.handleSaves(); return; }
      if (G.subState === "options" || G.subState === "binds" || G.subState === "display") {
        G.handleOptions();
        return;
      }
      if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.menuIndex = (G.menuIndex + 1) % G.MENU.length;
      if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.menuIndex = (G.menuIndex - 1 + G.MENU.length) % G.MENU.length;
      if (G.justPressed("Enter") || G.justPressed("Space")) G.confirmMenu();
      if (G.subState && (G.justPressed("Escape") || G.justPressed("Backspace"))) G.subState = null;
      return;
    }
    if (G.state === "pause") {
      if (G.subState) {
        if (G.justPressed("Escape") || G.justPressed("Backspace")) G.subState = null;
        return;
      }
      if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.pauseIndex = (G.pauseIndex + 1) % G.PAUSE.length;
      if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.pauseIndex = (G.pauseIndex - 1 + G.PAUSE.length) % G.PAUSE.length;
      if (G.justPressed("Enter") || G.justPressed("Space")) G.confirmPause();
      if (pauseKey()) G.state = "play";
      return;
    }
    if (G.state === "dead") {
      if (G.runUpdates) G.runUpdates();
      if (G.player && G.playDeath) G.playDeath(G.player);
      return;
    }
    if (G.state !== "play") return;
    if (pauseKey()) { G.saveRun(); G.state = "pause"; G.pauseIndex = 0; G.subState = null; return; }

    if (G.runUpdates) G.runUpdates();
    else for (const fn of (G.updates || [])) fn();

    const p = G.player;
    if (!p) return;
    const reach = Math.max(16, p.w);
    for (const c of (G.coins || [])) {
      if (!c.got && Math.abs(p.x + p.w / 2 - c.x) < reach && Math.abs(p.y + p.h / 2 - c.y) < reach + 10) {
        c.got = true;
        G.score += 10;
        G.addParticle(c.x, c.y, 0, -2, 30, "#ffd700", 5);
      }
    }
    if (p.attack > 12) G.hitEnemies(p.x, p.y, p.facing);
    for (const e of (G.enemies || [])) {
      if (e.hp <= 0) continue;
      if (G.overlap({ x: p.x, y: p.y, w: p.w, h: p.h }, { x: e.x, y: e.y, w: e.w, h: e.h })) {
        G.hurtPlayer(p, e);
      }
    }
    G.updateCamera(p.x, p.y);
    G.updateParticles();
    document.getElementById("hp").textContent = Math.max(0, Math.floor(p.hp));
    document.getElementById("score").textContent = G.score;
  };

  G.loop = function () {
    try { G.update(); }
    catch (err) { console.warn("update crash", err); }
    if (G.ctx) {
      G.ctx.clearRect(0, 0, G.W, G.H);
      if (G.state === "menu") {
        G.drawMenu(G.ctx);
        G.drawSub(G.ctx);
      } else if (G.state === "play" || G.state === "dead" || G.state === "pause") {
        G.drawAll(G.ctx, G.player);
        if (G.state === "pause") G.drawPause(G.ctx);
      }
    }
    requestAnimationFrame(G.loop);
  };
})(G);
