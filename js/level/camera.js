(function (G) {
  G.camX = 0;
  G.camY = 0;

  G.updateCamera = function (px, py, snap) {
    const tx = px - G.W * 0.4;
    const ty = (py || 0) - G.PLAY_H * 0.6;
    if (snap) {
      G.camX = tx;
      G.camY = ty;
    } else {
      G.camX += (tx - G.camX) * 0.2;
      G.camY += (ty - G.camY) * 0.2;
    }
  };
})(G);
