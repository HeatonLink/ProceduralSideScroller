(function (G) {
  G.keys = Object.create(null);
  G.just = Object.create(null);

  window.addEventListener("keydown", e => {
    if (G.bindTarget && G.finishBind) {
      G.finishBind(e.code);
      e.preventDefault();
      return;
    }
    if (!G.keys[e.code]) G.just[e.code] = true;
    G.keys[e.code] = true;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
  });
  window.addEventListener("keyup", e => { G.keys[e.code] = false; });

  G.pressed = function (code) { return !!G.keys[code]; };
  G.justPressed = function (code) {
    const v = !!G.just[code];
    G.just[code] = false;
    return v;
  };

  // Check any of the three slots for an action
  G.actionPressed = function (action) {
    const b = G.binds && G.binds[action];
    if (!b) return false;
    return G.pressed(b.main) || G.pressed(b.secondary) || G.pressed(b.controller);
  };
  G.actionJust = function (action) {
    const b = G.binds && G.binds[action];
    if (!b) return false;
    return G.justPressed(b.main) || G.justPressed(b.secondary) || G.justPressed(b.controller);
  };
})(G);
