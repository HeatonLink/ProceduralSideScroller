(function (G) {
  G.state = "menu";
  G.score = 0;
  G.player = null;
  G.canvas = null;
  G.ctx = null;

  G.startGame = function () {
    G.player = G.makePlayer();
    G.score = 0;
    G.camX = 0;
    G.particles = [];
    for (const c of G.coins) c.got = false;
    for (const e of G.enemies) { e.hp = 40; e.x = e.home; }
    G.state = "play";
    G.subState = null;
    document.getElementById("hud").classList.remove("hidden");
    document.getElementById("dead").classList.add("hidden");
  };

  G.update = function () {
    if (G.state === "menu") {
      if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.menuIndex = (G.menuIndex + 1) % G.MENU.length;
      if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.menuIndex = (G.menuIndex - 1 + G.MENU.length) % G.MENU.length;
      if (G.justPressed("Enter") || G.justPressed("Space")) G.confirmMenu();
      if (G.subState && (G.justPressed("Escape") || G.justPressed("Backspace"))) G.subState = null;
      return;
    }
    if (G.state !== "play") return;
    const p = G.player;
    G.updatePlayer(p, 1);
    G.updateEnemies();
    G.updateParticles();
    G.updateCamera(p.x);

    for (const c of G.coins) {
      if (!c.got && Math.abs(p.x + 18 - c.x) < 20 && Math.abs(p.y + 30 - c.y) < 30) {
        c.got = true;
        G.score += 10;
        G.addParticle(c.x, c.y, 0, -2, 30, "#ffd700", 5);
      }
    }

    if (p.attack > 12) G.hitEnemies(p.x, p.y, p.facing);

    for (const e of G.enemies) {
      if (e.hp <= 0) continue;
      if (G.overlap({ x: p.x, y: p.y, w: p.w, h: p.h }, { x: e.x, y: e.y, w: e.w, h: e.h })) {
        p.hp -= 0.5;
        if (p.hp <= 0) {
          G.state = "dead";
          document.getElementById("dead").classList.remove("hidden");
        }
      }
    }

    document.getElementById("hp").textContent = Math.max(0, Math.floor(p.hp));
    document.getElementById("score").textContent = G.score;
  };

  G.loop = function () {
    G.update();
    if (G.ctx) {
      G.ctx.clearRect(0, 0, G.W, G.H);
      if (G.state === "menu") {
        G.drawMenu(G.ctx);
        G.drawSub(G.ctx);
      } else if (G.state === "play" || G.state === "dead") {
        G.drawAll(G.ctx, G.player);
      }
    }
    requestAnimationFrame(G.loop);
  };
})(G);
