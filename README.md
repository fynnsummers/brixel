<img width="381" height="159" alt="title" src="https://github.com/user-attachments/assets/8bd2e83e-049c-474f-8252-51fb12ae0da4" />

<p align="center">

<img src="https://img.shields.io/badge/version-Alpha%201.0%20Dev-blue?style=for-the-badge">
<img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge">
<img src="https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript&logoColor=black">

</p>

# <img src="https://img.icons8.com/fluency/28/controller.png"/> Brixels

A **2D Minecraft-inspired sandbox game** built with **vanilla JavaScript** and **HTML5 Canvas**.  
Explore procedurally generated worlds, mine resources, craft tools, and survive the day-night cycle.

---

# <img src="https://img.icons8.com/fluency/28/star.png"/> Features

## <img src="https://img.icons8.com/fluency/26/terrain.png"/> World Generation

- **Procedural Terrain**: Infinite world generation with smooth hills and mountains
- **Multiple Biomes**: Varied terrain with different heights and formations
- **Underground Layers**: Deep underground with stone and valuable ores
- **Chunk System**: Efficient chunk-based world loading and rendering

---

## <img src="https://img.icons8.com/fluency/26/pickaxe.png"/> Mining & Resources

### Block Types

- Grass, Dirt, Stone *(basic blocks)*
- Coal Ore, Iron Ore, Diamond Ore, Emerald Ore *(valuable resources)*
- Bedrock *(unbreakable bottom layer)*

### Mechanics

- **Breaking Animation** – 4-frame break animation
- **Item Drops** – Resources drop when blocks break
- **Auto-Pickup** – Magnetic item collection system

---

## <img src="https://img.icons8.com/fluency/26/hammer.png"/> Tools & Crafting

### Tool Tiers

```
Wood → Stone → Iron → Diamond → Emerald
```

### Tool Types

| Tool | Function |
|-----|-----|
| Pickaxe | Mining |
| Axe | Chopping |
| Shovel | Digging |
| Sword | Combat |

### Features

- Tool rendering when equipped
- Different mining speeds
- Tier based progression

---

## <img src="https://img.icons8.com/fluency/26/backpack.png"/> Inventory System

- **48 Slots** *(6 hotbar + 42 inventory)*
- **Drag & Drop** item management
- **Item Stacking** up to 999
- **Tooltips** for item information
- **Hotbar Access** using keys 1-6

---

## <img src="https://img.icons8.com/fluency/26/sun.png"/> Day-Night Cycle

- **Dynamic Sky** gradient transitions
- **4-Minute Cycle**
- **Darkness System** during night
- **Pixelated Gradient Rendering**

### Time Phases

```
Night → Sunrise → Day → Sunset → Night
```

---

## <img src="https://img.icons8.com/fluency/26/player.png"/> Player Mechanics

- **Smooth Movement** (WASD)
- **Sprint** using Shift
- **Jump Physics**
- **Fly Mode** via `/fly on`
- **Player Animations**
- **Fall Damage System**

---

## <img src="https://img.icons8.com/fluency/26/chat.png"/> Chat & Commands

### Chat System

- Press **T** to open chat
- **Color Codes** supported (§a, §c, §e etc.)

### Commands

```
/give <item> [count]
/list [category]
/adm
/fly <on|off>
/time <day|night>
/clear
/help
```

---

## <img src="https://img.icons8.com/fluency/26/interface.png"/> User Interface

- **Health Bar** with hearts
- **Hotbar** with quick items
- **Inventory Screen** (E)
- **Block Highlight**
- **Break Progress Overlay**
- **Pixel Art Cursor**

---

## <img src="https://img.icons8.com/fluency/26/music.png"/> Audio & Visuals

- Background music on title screen
- Particle effects when breaking blocks
- Smooth camera following system
- Retro pixel-style graphics

---

## <img src="https://img.icons8.com/fluency/26/monitor.png"/> Screens

- **Title Screen** with animated background
- **Loading Screen** with world generation progress
- **Game Screen** with full gameplay

---

# <img src="https://img.icons8.com/fluency/26/folder-invoices.png"/> Project Structure

```
block-world/
├── assets/
│   ├── textures/
│   ├── tools/
│   ├── ui/
│   ├── break/
│   ├── cursor.png
│   ├── title.png
│   └── homemc.mp3
│
├── css/
│   ├── style.css
│   └── load.css
│
├── js/
│   ├── core/
│   ├── entities/
│   ├── rendering/
│   ├── world/
│   ├── ui/
│   └── screens/
│
├── world.html
├── index.html
└── README.md
```

---

# <img src="https://img.icons8.com/fluency/26/keyboard.png"/> Controls

## Movement

| Key | Action |
|----|----|
| W / ↑ | Jump |
| A / ← | Move Left |
| S / ↓ | Reserved |
| D / → | Move Right |
| Shift | Sprint |

## Interaction

| Action | Control |
|------|------|
| Break Block | Left Click |
| Place Block | Right Click |
| Scroll Hotbar | Mouse Wheel |
| Select Slot | 1-6 |

## Interface

| Key | Action |
|----|----|
| E | Inventory |
| T | Chat |
| Enter | Send Message |
| Escape | Close UI |

## Debug

| Key | Action |
|----|----|
| F3 | Toggle Debug |

## Fly Mode

| Key | Action |
|----|----|
| Space | Fly Up |
| Shift | Fly Down |

---

# <img src="https://img.icons8.com/fluency/26/rocket.png"/> Getting Started

### Clone Repository

```bash
git clone https://github.com/fynnsummers/brixel.git
cd brixel
```

### Start Local Server

Python

```bash
python -m http.server 8000
```

Node

```bash
npx http-server
```

PHP

```bash
php -S localhost:8000
```

Open:

```
http://localhost:8000/index.html
```

---

# <img src="https://img.icons8.com/fluency/26/settings.png"/> Configuration

Located in:

```
js/core/config.js
```

### World Settings

```javascript
BLOCK_SIZE: 32
CHUNK_WIDTH: 16
MIN_HEIGHT: 6
MAX_HEIGHT: 18
UNDERGROUND_DEPTH: 100
```

### Physics

```javascript
GRAVITY: 0.5
JUMP_FORCE: -8
MOVE_SPEED: 2
SPRINT_SPEED: 4
```

### Day Night Cycle

```javascript
CYCLE_DURATION: 240000
NIGHT_DARKNESS: 0.65
```

### Camera

```javascript
CAMERA_SMOOTH: 0.08
CAMERA_ZOOM: 2.5
```

---

# <img src="https://img.icons8.com/fluency/26/brick.png"/> Item System

## Blocks

| ID | Name | Break Time |
|----|----|----|
| 1 | Grass | 0.5s |
| 2 | Dirt-Grass | 0.8s |
| 3 | Dirt | 0.8s |
| 4 | Stone | 3.0s |
| 5 | Coal Ore | 4.0s |
| 6 | Iron Ore | 5.0s |
| 7 | Bedrock | ∞ |
| 8 | Diamond Ore | 6.0s |
| 9 | Emerald Ore | 7.0s |

---

# <img src="https://img.icons8.com/fluency/26/diamond.png"/> Ore Generation

- Coal Ore → 2%
- Iron Ore → 1%
- Diamond Ore → 0.3%
- Emerald Ore → 0.15%

---

# <img src="https://img.icons8.com/fluency/26/bug.png"/> Known Issues

No issues currently reported.

---

# <img src="https://img.icons8.com/fluency/26/future.png"/> Planned Features

- Crafting System
- Mobs & Combat
- More Biomes
- Multiplayer
- Save System
- More Blocks
- Structures
- Weather System

---

# <img src="https://img.icons8.com/fluency/26/code.png"/> Contributing

1. Fork the project  
2. Create a feature branch  
3. Commit changes  
4. Push branch  
5. Create Pull Request

---

# <img src="https://img.icons8.com/fluency/26/document.png"/> License

MIT License

---

# <img src="https://img.icons8.com/fluency/26/handshake.png"/> Acknowledgments

- Inspired by **Minecraft** and Terraria
- Built with **Vanilla JavaScript**
- Pixel-art textures
- Procedural generation algorithms

---

# <img src="https://img.icons8.com/fluency/26/link.png"/> Contact

Project Link

```
https://github.com/fynnsummers/brixel
```

---

<p align="center">

Made by **Fynn Summers, Kai, Finn**

</p>



