(function (G) {
  G.volume = { master: 0.8, music: 0.7, sfx: 0.9 };
  G.display = {
    scale: 1,
    fullscreen: false,
    quality: "high",
    particles: true,
    shadows: true,
    vsync: true
  };
  G.optIndex = 0;
  G.bindTarget = null;

  G.ACTIONS = [
    { id: "left", label: "Left" },
    { id: "right", label: "Right" },
    { id: "jump", label: "Jump" },
    { id: "attack", label: "Attack" },
    { id: "interact", label: "Interact" },
    { id: "pause", label: "Pause" }
  ];

  G.binds = {
    left:     { main: "KeyA", secondary: "ArrowLeft", controller: "DPadLeft" },
    right:    { main: "KeyD", secondary: "ArrowRight", controller: "DPadRight" },
    jump:     { main: "Space", secondary: "ArrowUp", controller: "Button0" },
    attack:   { main: "KeyJ", secondary: "KeyK", controller: "Button1" },
    interact: { main: "KeyE", secondary: "Enter", controller: "Button2" },
    pause:    { main: "Escape", secondary: "KeyP", controller: "Button9" }
  };

  G.OPT_ITEMS = [
    { id: "master", label: "Master Volume", type: "volume" },
    { id: "music", label: "Music Volume", type: "volume" },
    { id: "sfx", label: "SFX Volume", type: "volume" },
    { id: "display", label: "Display", type: "menu" },
    { id: "binds", label: "Key Bindings", type: "menu" }
  ];

  G.DISPLAY_ITEMS = [
    { id: "scale", label: "Resolution Scale", type: "cycle", values: [0.75, 1, 1.25, 1.5, 2] },
    { id: "fullscreen", label: "Fullscreen", type: "toggle" },
    { id: "quality", label: "Quality", type: "cycle", values: ["low", "medium", "high"] },
    { id: "particles", label: "Particles", type: "toggle" },
    { id: "shadows", label: "Shadows", type: "toggle" },
    { id: "vsync", label: "VSync", type: "toggle" }
  ];

  G.applyDisplay = function () {
    const d = G.display;
    if (G.canvas) {
      const s = d.scale || 1;
      G.canvas.style.width = (G.W * s) + "px";
      G.canvas.style.height = (G.H * s) + "px";
    }
    if (d.fullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!d.fullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    G.particlesEnabled = d.particles;
  };

  G.drawOptions = function (ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("OPTIONS", G.W / 2, 70);

    if (G.subState === "binds") { G.drawBinds(ctx); return; }
    if (G.subState === "display") { G.drawDisplay(ctx); return; }

    G.OPT_ITEMS.forEach((item, i) => {
      const y = 140 + i * 55;
      const on = i === G.optIndex;
      ctx.fillStyle = on ? "#4a90d9" : "rgba(40,50,70,0.9)";
      ctx.fillRect(180, y - 28, 600, 48);
      ctx.fillStyle = "#fff";
      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item.label, 200, y);
      if (item.type === "volume") {
        const v = G.volume[item.id];
        ctx.fillStyle = "#333";
        ctx.fillRect(450, y - 10, 200, 12);
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(450, y - 10, 200 * v, 12);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "right";
        ctx.fillText(Math.round(v * 100) + "%", 680, y);
      }
    });
    ctx.textAlign = "center";
    ctx.fillStyle = "#aaa";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Arrows to select  ·  Left/Right to adjust  ·  Enter to open  ·  Esc to back", G.W / 2, G.H - 40);
  };

  G.drawDisplay = function (ctx) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DISPLAY", G.W / 2, 120);

    G.DISPLAY_ITEMS.forEach((item, i) => {
      const y = 180 + i * 55;
      const on = i === G.optIndex;
      ctx.fillStyle = on ? "#4a90d9" : "rgba(40,50,70,0.9)";
      ctx.fillRect(160, y - 28, 640, 48);
      ctx.fillStyle = "#fff";
      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item.label, 180, y);
      ctx.textAlign = "right";
      const val = G.display[item.id];
      let text = String(val);
      if (item.type === "toggle") text = val ? "On" : "Off";
      if (item.id === "scale") text = val + "x";
      ctx.fillText(text, 760, y);
    });
    ctx.textAlign = "center";
    ctx.fillStyle = "#aaa";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Left/Right to change  ·  Esc to back", G.W / 2, G.H - 40);
  };

  G.drawBinds = function (ctx) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("KEY BINDINGS", G.W / 2, 130);

    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#ffe2a8";
    ctx.textAlign = "left";
    ctx.fillText("Action", 80, 180);
    ctx.fillText("Main", 280, 180);
    ctx.fillText("Secondary", 440, 180);
    ctx.fillText("Controller", 620, 180);

    G.ACTIONS.forEach((act, i) => {
      const y = 220 + i * 50;
      const b = G.binds[act.id];
      const on = G.optIndex === i;
      ctx.fillStyle = on ? "rgba(74,144,217,0.4)" : "transparent";
      ctx.fillRect(60, y - 28, 840, 44);
      ctx.fillStyle = "#fff";
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillText(act.label, 80, y);

      const slots = ["main", "secondary", "controller"];
      slots.forEach((slot, si) => {
        const x = 280 + si * 160;
        const waiting = G.bindTarget && G.bindTarget.action === act.id && G.bindTarget.slot === slot;
        ctx.fillStyle = waiting ? "#e74c3c" : "#333";
        ctx.fillRect(x - 10, y - 18, 140, 28);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(waiting ? "Press key..." : (b[slot] || "-"), x + 60, y);
        ctx.textAlign = "left";
      });
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#aaa";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Enter = Main  ·  Q = Secondary  ·  R = Controller  ·  Esc to back", G.W / 2, G.H - 40);
  };

  G.handleOptions = function () {
    if (G.subState === "binds") { G.handleBinds(); return; }
    if (G.subState === "display") { G.handleDisplay(); return; }
    if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.optIndex = (G.optIndex + 1) % G.OPT_ITEMS.length;
    if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.optIndex = (G.optIndex - 1 + G.OPT_ITEMS.length) % G.OPT_ITEMS.length;
    const item = G.OPT_ITEMS[G.optIndex];
    if (item && item.type === "volume") {
      if (G.justPressed("ArrowLeft") || G.justPressed("KeyA")) G.volume[item.id] = Math.max(0, G.volume[item.id] - 0.05);
      if (G.justPressed("ArrowRight") || G.justPressed("KeyD")) G.volume[item.id] = Math.min(1, G.volume[item.id] + 0.05);
    }
    if (item && item.type === "menu" && (G.justPressed("Enter") || G.justPressed("Space"))) {
      G.subState = item.id;
      G.optIndex = 0;
    }
    if (G.justPressed("Escape")) G.subState = null;
  };

  G.handleDisplay = function () {
    if (G.justPressed("ArrowDown")) G.optIndex = (G.optIndex + 1) % G.DISPLAY_ITEMS.length;
    if (G.justPressed("ArrowUp")) G.optIndex = (G.optIndex - 1 + G.DISPLAY_ITEMS.length) % G.DISPLAY_ITEMS.length;
    const item = G.DISPLAY_ITEMS[G.optIndex];
    if (!item) return;
    if (item.type === "toggle" && (G.justPressed("ArrowLeft") || G.justPressed("ArrowRight") || G.justPressed("Enter"))) {
      G.display[item.id] = !G.display[item.id];
      G.applyDisplay();
    }
    if (item.type === "cycle") {
      const vals = item.values;
      let idx = vals.indexOf(G.display[item.id]);
      if (idx < 0) idx = 0;
      if (G.justPressed("ArrowRight") || G.justPressed("Enter")) idx = (idx + 1) % vals.length;
      if (G.justPressed("ArrowLeft")) idx = (idx - 1 + vals.length) % vals.length;
      G.display[item.id] = vals[idx];
      G.applyDisplay();
    }
    if (G.justPressed("Escape")) {
      G.subState = "options";
      G.optIndex = 0;
    }
  };

  G.handleBinds = function () {
    if (G.bindTarget) return;
    if (G.justPressed("ArrowDown")) G.optIndex = (G.optIndex + 1) % G.ACTIONS.length;
    if (G.justPressed("ArrowUp")) G.optIndex = (G.optIndex - 1 + G.ACTIONS.length) % G.ACTIONS.length;
    if (G.justPressed("Enter")) {
      const act = G.ACTIONS[G.optIndex];
      G.bindTarget = { action: act.id, slot: "main" };
    }
    if (G.justPressed("KeyQ")) {
      const act = G.ACTIONS[G.optIndex];
      G.bindTarget = { action: act.id, slot: "secondary" };
    }
    if (G.justPressed("KeyR")) {
      const act = G.ACTIONS[G.optIndex];
      G.bindTarget = { action: act.id, slot: "controller" };
    }
    if (G.justPressed("Escape")) {
      G.subState = "options";
      G.optIndex = 0;
    }
  };

  G.finishBind = function (code) {
    if (!G.bindTarget) return;
    const { action, slot } = G.bindTarget;
    if (G.binds[action]) G.binds[action][slot] = code;
    G.bindTarget = null;
  };
})(G);
