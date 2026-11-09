(function (G) {
  G.keys = Object.create(null);
  G.just = Object.create(null);

  window.addEventListener("keydown", e => {
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
})(G);
