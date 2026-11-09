(function (G) {
  G.addEnemy({
    x: 1400, y: 340, vx: 1.5, w: 32, h: 64, hp: 50,
    dir: 1, range: 100, home: 1400, anim: 0,
    rig: G.makeRig("enemy", 0.9), state: "walk"
  });
})(G);
