(function (G) {
  G.audio = null;
  G.musicGain = null;
  G.musicMood = "calm";
  G.musicTheme = "forest";
  G.musicStep = 0;
  G.musicTimer = 0;

  // Scale notes per theme (Hz). Combat uses a faster minor variant.
  G.SCALES = {
    forest:  [262, 294, 330, 349, 392, 440, 494],
    cave:    [196, 220, 247, 262, 294, 330, 349],
    lava:    [220, 247, 277, 311, 330, 370, 415],
    ice:     [330, 349, 392, 415, 466, 523, 587],
    sky:     [392, 440, 494, 523, 587, 659, 698],
    desert:  [247, 277, 311, 330, 370, 415, 440],
    ocean:   [196, 233, 262, 294, 311, 349, 392],
    ruins:   [174, 196, 220, 233, 262, 294, 311],
    combat:  [220, 233, 262, 277, 311, 330, 349]
  };

  G.ensureAudio = function () {
    if (G.audio) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    G.audio = new AC();
    G.musicGain = G.audio.createGain();
    G.musicGain.gain.value = 0.08;
    G.musicGain.connect(G.audio.destination);
  };

  G.setMusicVolume = function () {
    if (!G.musicGain) return;
    const m = (G.volume && G.volume.master) || 0.8;
    const mu = (G.volume && G.volume.music) || 0.7;
    G.musicGain.gain.setTargetAtTime(0.12 * m * mu, G.audio.currentTime, 0.1);
  };

  G.playNote = function (freq, dur, type) {
    if (!G.audio || !G.musicGain) return;
    const o = G.audio.createOscillator();
    const g = G.audio.createGain();
    o.type = type || "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, G.audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, G.audio.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, G.audio.currentTime + dur);
    o.connect(g);
    g.connect(G.musicGain);
    o.start();
    o.stop(G.audio.currentTime + dur + 0.05);
  };

  G.enemiesNear = function () {
    const p = G.player;
    if (!p) return 0;
    let n = 0;
    for (const e of (G.enemies || [])) {
      if (e.hp <= 0) continue;
      if (Math.abs(e.x - p.x) < 280 && Math.abs(e.y - p.y) < 200) n++;
    }
    return n;
  };

  G.updateMusic = function () {
    if (G.state !== "play" && G.state !== "dead") return;
    G.ensureAudio();
    if (!G.audio) return;
    if (G.audio.state === "suspended") G.audio.resume();
    G.setMusicVolume();

    const theme = (G.themeFor && G.themeFor(G.currentGX || 0, G.currentGY || 0).name) || "forest";
    const near = G.enemiesNear();
    const mood = near > 0 ? "combat" : "calm";
    G.musicTheme = theme;
    G.musicMood = mood;

    G.musicTimer++;
    const rate = mood === "combat" ? 12 : 22;
    if (G.musicTimer < rate) return;
    G.musicTimer = 0;

    const scale = mood === "combat" ? G.SCALES.combat : (G.SCALES[theme] || G.SCALES.forest);
    const note = scale[G.musicStep % scale.length];
    const bass = scale[0] / 2;
    G.playNote(note, mood === "combat" ? 0.18 : 0.35, mood === "combat" ? "sawtooth" : "triangle");
    if (G.musicStep % 2 === 0) G.playNote(bass, 0.4, "sine");
    G.musicStep++;
  };

  // Start audio on first user gesture (browsers require it)
  window.addEventListener("keydown", function once() {
    G.ensureAudio();
    if (G.audio && G.audio.state === "suspended") G.audio.resume();
  }, { once: true });

  G.addUpdate(function () { G.updateMusic(); });
})(G);
