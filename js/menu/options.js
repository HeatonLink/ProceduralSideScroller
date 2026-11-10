(function (G) {
  G.volume = { master: 0.8, music: 0.7, sfx: 0.9 };
  G.optIndex = 0;
  G.bindTarget = null; // { action, slot } when waiting for a key

  G.ACTIONS = [
    { id: "left", label: "Left" },
    { id: "right", label: "Right" },
    { id: "jump", label: "Jump" },
    { id: "attack", label: "Attack" },
    { id: "interact", label: "Interact" },
    { id: "pause", label: "Pause" }
  ];

  // Three slots: main, secondary, controller
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
    { id: "binds", label: "Key Bindings", type: "menu" }
  ];

  G.drawOptions = function (ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("OPTIONS", G.W / 2, 80);

    if (G.subState === "binds") {
      G.drawBinds(ctx);
      return;
    }

    G.OPT_ITEMS.forEach((item, i) => {
      const y = 160 + i * 60;
      const on = i === G.optIndex;
      ctx.fillStyle = on ? "#4a90d9" : "rgba(40,50,70,0.9)";
      ctx.fillRect(180, y - 28, 600, 50);
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
    ctx.fillText("Arrows to select  ·  Left/Right to adjust  ·  Enter to open binds  ·  Esc to back", G.W / 2, G.H - 40);
  };

  G.drawBinds = function (ctx) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("KEY BINDINGS", G.W / 2, 130);

    // Headers
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
    ctx.fillText("Enter on a slot to rebind  ·  Esc to cancel / back", G.W / 2, G.H - 40);
  };

  G.handleOptions = function () {
    if (G.subState === "binds") {
      G.handleBinds();
      return;
    }
    if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.optIndex = (G.optIndex + 1) % G.OPT_ITEMS.length;
    if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.optIndex = (G.optIndex - 1 + G.OPT_ITEMS.length) % G.OPT_ITEMS.length;
    const item = G.OPT_ITEMS[G.optIndex];
    if (item && item.type === "volume") {
      if (G.justPressed("ArrowLeft") || G.justPressed("KeyA")) G.volume[item.id] = Math.max(0, G.volume[item.id] - 0.05);
      if (G.justPressed("ArrowRight") || G.justPressed("KeyD")) G.volume[item.id] = Math.min(1, G.volume[item.id] + 0.05);
    }
    if (item && item.id === "binds" && (G.justPressed("Enter") || G.justPressed("Space"))) {
      G.subState = "binds";
      G.optIndex = 0;
    }
    if (G.justPressed("Escape")) G.subState = null;
  };

  G.handleBinds = function () {
    if (G.bindTarget) return; // waiting for key in input handler
    if (G.justPressed("ArrowDown")) G.optIndex = (G.optIndex + 1) % G.ACTIONS.length;
    if (G.justPressed("ArrowUp")) G.optIndex = (G.optIndex - 1 + G.ACTIONS.length) % G.ACTIONS.length;
    if (G.justPressed("Enter")) {
      // Cycle slots or start bind on main; for simplicity start on main, then secondary, then controller via left/right
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

  // Called from input when a key is pressed while bindTarget is set
  G.finishBind = function (code) {
    if (!G.bindTarget) return;
    const { action, slot } = G.bindTarget;
    if (G.binds[action]) G.binds[action][slot] = code;
    G.bindTarget = null;
  };
})(G);
