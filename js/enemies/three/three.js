(function (G) {
  G.addEnemy({
    x: 1900, y: 500, vx: 1, w: 32, h: 64, hp: 30,
    dir: -1, range: 150, home: 1900, anim: 0,
    rig: G.makeRig("enemy", 0.8), state: "walk"
  });
})(G);
