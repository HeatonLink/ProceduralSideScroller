(function (G) {
  // Mouse-shaped player. Scale kept small but large enough to see.
  G.rigMakers.player = function (scale) {
    scale = (scale || 1) * 0.55;
    const root = new G.Bone(0, 0);
    const torso = root.add(new G.Bone(18 * scale, 10 * scale));
    const head = torso.add(new G.Bone(10 * scale, 14 * scale));
    const lEar = head.add(new G.Bone(12 * scale, 4 * scale));
    const rEar = head.add(new G.Bone(12 * scale, 4 * scale));
    const lArm = torso.add(new G.Bone(8 * scale, 5 * scale));
    const lFore = lArm.add(new G.Bone(7 * scale, 4 * scale));
    const rArm = torso.add(new G.Bone(8 * scale, 5 * scale));
    const rFore = rArm.add(new G.Bone(7 * scale, 4 * scale));
    const lThigh = root.add(new G.Bone(10 * scale, 6 * scale));
    const lShin = lThigh.add(new G.Bone(9 * scale, 5 * scale));
    const rThigh = root.add(new G.Bone(10 * scale, 6 * scale));
    const rShin = rThigh.add(new G.Bone(9 * scale, 5 * scale));
    const tail = root.add(new G.Bone(22 * scale, 3 * scale));
    const tail2 = tail.add(new G.Bone(16 * scale, 2 * scale));
    return {
      root, torso, head, lEar, rEar,
      lArm, lFore, rArm, rFore,
      lThigh, lShin, rThigh, rShin,
      tail, tail2,
      mouse: true
    };
  };
})(G);
