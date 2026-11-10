(function (G) {
  G.SAVES_KEY = "proc.saves.v1";
  G.SAVES_TMP = "proc.saves.v1.tmp";
  G.MAX_SAVES = 10;
  G.saveBank = { lastPlayed: 0, slots: {} };
  G.activeSave = 0;
  G.enemyState = {};
  G.autoSaveTimer = 0;
  G.saving = false;

  G.loadBank = function () {
    try {
      let raw = localStorage.getItem(G.SAVES_KEY);
      if (!raw) raw = localStorage.getItem(G.SAVES_TMP);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.slots) G.saveBank = data;
    } catch (e) {}
  };

  G.writeBank = function () {
    if (G.saving) return;
    G.saving = true;
    try {
      const json = JSON.stringify(G.saveBank);
      localStorage.setItem(G.SAVES_TMP, json);
      localStorage.setItem(G.SAVES_KEY, json);
      localStorage.removeItem(G.SAVES_TMP);
    } catch (e) {}
    G.saving = false;
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

  G.recordEnemy = function (e) {
    if (!e || e.id == null) return;
    const key = (e.gx || G.currentGX || 0) + "," + (e.gy || G.currentGY || 0) + "," + e.id;
    G.enemyState[key] = { hp: e.hp, x: e.x, dead: e.hp <= 0 };
  };

  G.applyEnemyState = function (e) {
    if (!e || e.id == null) return;
    const key = (e.gx || G.currentGX || 0) + "," + (e.gy || G.currentGY || 0) + "," + e.id;
    const st = G.enemyState[key];
    if (!st) return;
    e.hp = st.hp;
    if (st.x != null) e.x = st.x;
  };

  function snapshot() {
    const p = G.player || {};
    const compact = {};
    for (const k in G.enemyState) {
      const st = G.enemyState[k];
      if (st && (st.dead || st.hp < 40)) compact[k] = st;
    }
    return {
      score: G.score || 0,
      level: G.currentLevel || 0,
      gx: G.currentGX || 0,
      gy: G.currentGY || 0,
      x: p.x || 80,
      y: p.y || 432,
      hp: p.hp || G.MAX_HP,
      facing: p.facing || 1,
      flags: G.flags || {},
      inventory: G.inventory || {},
      visited: G.visited || {},
      enemies: compact,
      updated: Date.now()
    };
  }

  G.applySnapshot = function (data) {
    if (!data) return;
    G.score = data.score || 0;
    G.flags = data.flags || {};
    G.inventory = data.inventory || {};
    G.visited = data.visited || {};
    G.enemyState = data.enemies || {};
    if (G.loadGrid) G.loadGrid(data.gx || 0, data.gy || 0);
    else if (G.loadLevel) G.loadLevel(data.level || 0);
    const p = G.player || G.makePlayer();
    p.x = data.x || 80;
    p.y = data.y || 432;
    p.hp = data.hp || G.MAX_HP;
    p.facing = data.facing || 1;
    G.player = p;
    for (const e of (G.enemies || [])) G.applyEnemyState(e);
    if (G.spawnNpcs) G.spawnNpcs();
  };

  G.saveRun = function () {
    if (!G.activeSave) return;
    for (const e of (G.enemies || [])) G.recordEnemy(e);
    const snap = snapshot();
    snap.id = G.activeSave;
    snap.name = "Save " + G.activeSave;
    G.saveBank.slots[G.activeSave] = snap;
    G.saveBank.lastPlayed = G.activeSave;
    G.writeBank();
  };

  G.autoSave = function () {
    if (G.state !== "play" || !G.activeSave || G.saving) return;
    G.saveRun();
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

  // Do not clear G.player. startGame creates the player, then calls this.
  G.createSave = function () {
    const id = G.nextEmptySlot();
    if (!id) return 0;
    G.activeSave = id;
    G.score = 0;
    G.flags = {};
    G.inventory = {};
    G.visited = {};
    G.enemyState = {};
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

  G.addUpdate(function () {
    if (G.state !== "play") return;
    G.autoSaveTimer++;
    if (G.autoSaveTimer >= 300) {
      G.autoSaveTimer = 0;
      G.autoSave();
    }
  });

  G.loadBank();
})(G);
