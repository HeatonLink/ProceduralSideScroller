# Procedural Side Scroller

High-quality HTML5 canvas side-scroller using **procedural skeletal rigging** for all characters instead of pixel sprite sheets.

Open `index.html` in a browser.

## Controls
- A / D or Left / Right: move
- Space or Up: jump (coyote time + jump buffer)
- J: attack
- Esc: pause
- Menu / Pause: Up/Down or click, Enter to confirm

## Folder structure
- `js/character/` — player logic
- `js/characters/` — optional per-character rig overrides (default to makeHuman)
- `js/enemies/` — shared enemy code + subfolder per enemy (`one/`, `two/`, `three/`)
- `js/menu/` — main menu
- `js/pause/` — pause menu
- `js/level/1/` — level data (add more numbered folders for new levels)

## Features
- Procedural character and enemy rigs
- Main menu (Play, Character, Options, Achievements, How to Play)
- Pause menu (Resume, Options, Quit to Menu)
- Platforming, patrol enemies, particles, camera, health, score

Inspired by [BonkySideScroller](https://github.com/HeatonLink/BonkySideScroller).
