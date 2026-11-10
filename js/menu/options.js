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
  G.optTab = "video";
  G.bindTarget = null;

  G.OPT_TABS = [
    { id: "video", label: "Video" },
    { id: "audio", label: "Audio" },
    { id: "controls", label: "Controls" },
    { id: "misc", label: "Misc" }
  ];

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

  G.AUDIO_ITEMS = [
    { id: "master", label: "Master Volume", type: "volume" },
    { id: "music", label: "Music Volume", type: "volume" },
    { id: "sfx", label: "SFX Volume", type: "volume" }
  ];

  G.VIDEO_ITEMS = [
    { id: "scale", label: "Resolution Scale", type: "cycle", values: [0.75, 1, 1.25, 1.5, 2] },
    { id: "fullscreen", label: "Fullscreen", type: "toggle" },
    { id: "quality", label: "Quality", type: "cycle", values: ["low", "medium", "high"] },
    { id: "particles", label: "Particles", type: "toggle" },
    { id: "shadows", label: "Shadows", type: "toggle" },
    { id: "vsync", label: "VSync", type: "toggle" }
  ];

  G.MISC_ITEMS = [
    { id: "showfps", label: "Show FPS", type: "toggle" },
    { id: "screenshake", label: "Screen Shake", type: "toggle" }
  ];
  G.misc = G.misc || { showfps: false, screenshake: true };

  G.tabButtons = function () {
    const w = 160, h = 36, gap = 12;
    const total = G.OPT_TABS.length * w + (G.OPT_TABS.length - 1) * gap;
    const x0 = (G.W - total) / 2;
    return G.OPT_TABS.map((t, i) => ({
      ...t,
      x: x0 + i * (w + gap),
      y: 90,
      w: w,
      h: h
    }));
  };

  G.rowButtons = function (items, y0) {
    return items.map((item, i) => {
      const y = y0 + i * 52;
      return { ...item, x: 180, y: y, w: 600, h: 44, barX: 460, barY: y + 16, barW: 180 };
    });
  };

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

  function drawTabs(ctx) {
    G.tabButtons().forEach(t => {
      const on = t.id === G.optTab;
      ctx.fillStyle = on ? "#4a90d9" : "rgba(40,50,70,0.9)";
      ctx.beginPath();
      ctx.roundRect(t.x, t.y, t.w, t.h, 6);
      ctx.fill();
      if (on) {
        ctx.strokeStyle = "#ffe2a8";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = "#fff";
      ctx.font = "16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t.label, t.x + t.w / 2, t.y + t.h / 2);
    });
    ctx.textBaseline = "alphabetic";
  }

  function drawRows(ctx, items, store) {
    G.rowButtons(items, 150).forEach((b, i) => {
      const on = i === G.optIndex;
      ctx.fillStyle = on ? "#4a90d9" : "rgba(40,50,70,0.9)";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "#fff";
      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(b.label, b.x + 16, b.y + 28);
      if (b.type === "volume") {
        const v = G.volume[b.id];
        ctx.fillStyle = "#333";
        ctx.fillRect(b.barX, b.barY, b.barW, 12);
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(b.barX, b.barY, b.barW * v, 12);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "right";
        ctx.fillText(Math.round(v * 100) + "%", b.x + b.w - 16, b.y + 28);
      } else {
        const val = store[b.id];
        let text = String(val);
        if (b.type === "toggle") text = val ? "On" : "Off";
        if (b.id === "scale") text = val + "x";
        ctx.textAlign = "right";
        ctx.fillText(text, b.x + b.w - 16, b.y + 28);
      }
    });
  }

  G.drawOptions = function (ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("OPTIONS", G.W / 2, 60);
    drawTabs(ctx);
    if (G.optTab === "video") drawRows(ctx, G.VIDEO_ITEMS, G.display);
    else if (G.optTab === "audio") drawRows(ctx, G.AUDIO_ITEMS, G.volume);
    else if (G.optTab === "controls") G.drawBinds(ctx);
    else drawRows(ctx, G.MISC_ITEMS, G.misc);
    ctx.textAlign = "center";
    ctx.fillStyle = "#aaa";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Esc to back", G.W / 2, G.H - 30);
  };

  G.drawBinds = function (ctx) {
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#ffe2a8";
    ctx.textAlign = "left";
    ctx.fillText("Action", 80, 160);
    ctx.fillText("Main", 280, 160);
    ctx.fillText("Secondary", 440, 160);
    ctx.fillText("Controller", 620, 160);
    G.ACTIONS.forEach((act, i) => {
      const y = 196 + i * 48;
      const b = G.binds[act.id];
      const on = G.optIndex === i;
      ctx.fillStyle = on ? "rgba(74,144,217,0.4)" : "transparent";
      ctx.fillRect(60, y - 24, 840, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillText(act.label, 80, y);
      ["main", "secondary", "controller"].forEach((slot, si) => {
        const x = 280 + si * 160;
        const waiting = G.bindTarget && G.bindTarget.action === act.id && G.bindTarget.slot === slot;
        ctx.fillStyle = waiting ? "#e74c3c" : "#333";
        ctx.fillRect(x - 10, y - 16, 140, 26);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(waiting ? "Press key..." : (b[slot] || "-"), x + 60, y);
        ctx.textAlign = "left";
      });
    });
  };

  G.clickOptions = function (x, y) {
    const tabs = G.tabButtons();
    for (const t of tabs) {
      if (x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h) {
        G.optTab = t.id;
        G.optIndex = 0;
        return;
      }
    }
    if (G.optTab === "controls") return;
    const items = G.optTab === "video" ? G.VIDEO_ITEMS : G.optTab === "audio" ? G.AUDIO_ITEMS : G.MISC_ITEMS;
    const store = G.optTab === "video" ? G.display : G.optTab === "audio" ? G.volume : G.misc;
    const rows = G.rowButtons(items, 150);
    for (let i = 0; i < rows.length; i++) {
      const b = rows[i];
      if (x < b.x || x > b.x + b.w || y < b.y || y > b.y + b.h) continue;
      G.optIndex = i;
      if (b.type === "volume") {
        G.volume[b.id] = Math.max(0, Math.min(1, (x - b.barX) / b.barW));
      } else if (b.type === "toggle") {
        store[b.id] = !store[b.id];
        if (G.optTab === "video") G.applyDisplay();
      } else if (b.type === "cycle") {
        const vals = b.values;
        let idx = vals.indexOf(store[b.id]);
        store[b.id] = vals[(idx + 1) % vals.length];
        G.applyDisplay();
      }
      return;
    }
  };

  G.hoverOptions = function (x, y) {
    if (G.optTab === "controls") return;
    const items = G.optTab === "video" ? G.VIDEO_ITEMS : G.optTab === "audio" ? G.AUDIO_ITEMS : G.MISC_ITEMS;
    const rows = G.rowButtons(items, 150);
    for (let i = 0; i < rows.length; i++) {
      const b = rows[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        G.optIndex = i;
        return;
      }
    }
  };

  G.handleOptions = function () {
    if (G.justPressed("ArrowLeft")) {
      const i = G.OPT_TABS.findIndex(t => t.id === G.optTab);
      G.optTab = G.OPT_TABS[(i - 1 + G.OPT_TABS.length) % G.OPT_TABS.length].id;
      G.optIndex = 0;
    }
    if (G.justPressed("ArrowRight")) {
      const i = G.OPT_TABS.findIndex(t => t.id === G.optTab);
      G.optTab = G.OPT_TABS[(i + 1) % G.OPT_TABS.length].id;
      G.optIndex = 0;
    }
    if (G.optTab === "controls") { G.handleBinds(); return; }
    const items = G.optTab === "video" ? G.VIDEO_ITEMS : G.optTab === "audio" ? G.AUDIO_ITEMS : G.MISC_ITEMS;
    if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.optIndex = (G.optIndex + 1) % items.length;
    if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.optIndex = (G.optIndex - 1 + items.length) % items.length;
    const item = items[G.optIndex];
    if (!item) return;
    if (item.type === "volume") {
      if (G.justPressed("KeyA")) G.volume[item.id] = Math.max(0, G.volume[item.id] - 0.05);
      if (G.justPressed("KeyD")) G.volume[item.id] = Math.min(1, G.volume[item.id] + 0.05);
    }
    if (item.type === "toggle" && (G.justPressed("Enter") || G.justPressed("Space"))) {
      const store = G.optTab === "video" ? G.display : G.misc;
      store[item.id] = !store[item.id];
      if (G.optTab === "video") G.applyDisplay();
    }
    if (item.type === "cycle" && (G.justPressed("Enter") || G.justPressed("Space"))) {
      const vals = item.values;
      let idx = vals.indexOf(G.display[item.id]);
      G.display[item.id] = vals[(idx + 1) % vals.length];
      G.applyDisplay();
    }
    if (G.justPressed("Escape")) G.subState = null;
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
    if (G.justPressed("Escape")) G.subState = null;
  };

  G.finishBind = function (code) {
    if (!G.bindTarget) return;
    const { action, slot } = G.bindTarget;
    if (G.binds[action]) G.binds[action][slot] = code;
    G.bindTarget = null;
  };
})(G);
