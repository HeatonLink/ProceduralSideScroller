(function (G) {
  G.SAVES_KEY = "proc.saves.v1";
  G.MAX_SAVES = 10;
  G.saveBank = { lastPlayed: 0, slots: {} };
  G.activeSave = 0;

  G.loadBank = function () {
    try {
      const raw = localStorage.getItem(G.SAVES_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.slots) G.saveBank = data;
    } catch (e) {}
  };

  G.writeBank = function () {
    try { localStorage.setItem(G.SAVES_KEY, JSON.stringify(G.saveBank)); } catch (e) {}
  };

  G.listSaves = function () {
    const out = [];
    for (let i = 1; i <= G.MAX_SAVES; i++) {
      if (G.saveBank.slots[i]) out.push(G.saveBank.slots[i]);
    }
    return out;
  };

  G.nextEmptySlot = function () {
    for (let i = 1; i <= G.MAX_SAVES; i++) {
      if (!G.saveBank.slots[i]) return i;
    }
    return 0;
  };

  function snapshot() {
    const p = G.player || {};
    return {
      score: G.score || 0,
      level: G.currentLevel || 0,
      x: p.x || 80,
      y: p.y || 500,
      hp: p.hp || G.MAX_HP,
      facing: p.facing || 1,
      coins: (G.coins || []).map(c => !!c.got),
      enemies: (G.enemies || []).map(e => ({ hp: e.hp, x: e.x })),
      updated: Date.now()
    };
  }

  G.applySnapshot = function (data) {
    if (!data) return;
    G.score = data.score || 0;
    if (G.loadLevel) G.loadLevel(data.level || 0);
    const p = G.player || G.makePlayer();
    p.x = data.x || 80;
    p.y = data.y || 500;
    p.hp = data.hp || G.MAX_HP;
    p.facing = data.facing || 1;
    G.player = p;
    (data.coins || []).forEach((got, i) => {
      if (G.coins[i]) G.coins[i].got = !!got;
    });
    (data.enemies || []).forEach((e, i) => {
      if (!G.enemies[i]) return;
      G.enemies[i].hp = e.hp;
      G.enemies[i].x = e.x;
    });
  };

  G.saveRun = function () {
    if (!G.activeSave) return;
    const snap = snapshot();
    snap.id = G.activeSave;
    snap.name = "Save " + G.activeSave;
    G.saveBank.slots[G.activeSave] = snap;
    G.saveBank.lastPlayed = G.activeSave;
    G.writeBank();
  };

  G.loadSlot = function (id) {
    const slot = G.saveBank.slots[id];
    if (!slot) return false;
    G.activeSave = id;
    G.saveBank.lastPlayed = id;
    G.writeBank();
    G.applySnapshot(slot);
    return true;
  };

  G.createSave = function () {
    const id = G.nextEmptySlot();
    if (!id) return 0;
    G.activeSave = id;
    G.score = 0;
    G.player = null;
    G.saveRun();
    return id;
  };

  G.deleteSave = function (id) {
    delete G.saveBank.slots[id];
    if (G.saveBank.lastPlayed === id) {
      const list = G.listSaves();
      G.saveBank.lastPlayed = list[0] ? list[0].id : 0;
    }
    if (G.activeSave === id) G.activeSave = 0;
    G.writeBank();
  };

  G.loadBank();
})(G);
