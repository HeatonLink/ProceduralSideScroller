(function (G) {
  G.saveIndex = 0;

  G.drawSaves = function (ctx) {
    const list = G.listSaves();
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillText("SAVES", G.W / 2, 160);

    const items = list.map(s => s.name + "  (Lv " + ((s.level || 0) + 1) + ")");
    if (G.nextEmptySlot()) items.push("New Save");
    if (!items.length) items.push("No slots");

    items.forEach((label, i) => {
      const on = i === G.saveIndex;
      ctx.fillStyle = on ? "#4a90d9" : "rgba(30,40,60,0.9)";
      ctx.fillRect(G.W / 2 - 160, 200 + i * 50, 320, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillText(label, G.W / 2, 226 + i * 50);
    });
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("Enter to load/create   D to delete   Esc to back", G.W / 2, 520);
  };

  G.confirmSave = function () {
    const list = G.listSaves();
    if (G.saveIndex < list.length) {
      G.loadSlot(list[G.saveIndex].id);
      G.startGame(true);
    } else if (G.nextEmptySlot()) {
      G.createSave();
      G.startGame();
    }
  };

  G.handleSaves = function () {
    const list = G.listSaves();
    const count = list.length + (G.nextEmptySlot() ? 1 : 0);
    if (G.justPressed("ArrowDown") || G.justPressed("KeyS")) G.saveIndex = (G.saveIndex + 1) % Math.max(1, count);
    if (G.justPressed("ArrowUp") || G.justPressed("KeyW")) G.saveIndex = (G.saveIndex - 1 + Math.max(1, count)) % Math.max(1, count);
    if (G.justPressed("Enter") || G.justPressed("Space")) G.confirmSave();
    if (G.justPressed("KeyD") && G.saveIndex < list.length) G.deleteSave(list[G.saveIndex].id);
    if (G.justPressed("Escape")) G.subState = null;
  };
})(G);
