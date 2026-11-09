(function (G) {
  // Simple bone: length, local angle, width
  G.Bone = function (len, w) {
    this.len = len;
    this.w = w || 8;
    this.ang = 0;
    this.x = 0;
    this.y = 0;
    this.children = [];
  };
  G.Bone.prototype.add = function (b) { this.children.push(b); return b; };

  G.pose = function (bone, x, y, a) {
    bone.x = x;
    bone.y = y;
    bone.ang = a;
    const rad = a * Math.PI / 180;
    const nx = x + Math.cos(rad) * bone.len;
    const ny = y + Math.sin(rad) * bone.len;
    for (const c of bone.children) G.pose(c, nx, ny, a + c.ang);
  };

  G.drawBone = function (ctx, bone, color) {
    const rad = bone.ang * Math.PI / 180;
    const x2 = bone.x + Math.cos(rad) * bone.len;
    const y2 = bone.y + Math.sin(rad) * bone.len;
    ctx.strokeStyle = color;
    ctx.lineWidth = bone.w;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(bone.x, bone.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    for (const c of bone.children) G.drawBone(ctx, c, color);
  };

  // Build a humanoid rig
  G.makeHuman = function (scale) {
    scale = scale || 1;
    const root = new G.Bone(0, 0);
    const torso = root.add(new G.Bone(40 * scale, 14 * scale));
    const head = torso.add(new G.Bone(18 * scale, 16 * scale));
    const lArm = torso.add(new G.Bone(22 * scale, 7 * scale));
    const lFore = lArm.add(new G.Bone(20 * scale, 6 * scale));
    const rArm = torso.add(new G.Bone(22 * scale, 7 * scale));
    const rFore = rArm.add(new G.Bone(20 * scale, 6 * scale));
    const lThigh = root.add(new G.Bone(24 * scale, 9 * scale));
    const lShin = lThigh.add(new G.Bone(22 * scale, 7 * scale));
    const rThigh = root.add(new G.Bone(24 * scale, 9 * scale));
    const rShin = rThigh.add(new G.Bone(22 * scale, 7 * scale));
    return { root, torso, head, lArm, lFore, rArm, rFore, lThigh, lShin, rThigh, rShin };
  };
})(G);
