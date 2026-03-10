# Brixel Wiki

## 📋 Inhaltsverzeichnis
- [Steuerung](#steuerung)
- [Blöcke](#blöcke)
- [Materialien](#materialien)
- [Werkzeuge](#werkzeuge)
- [Spielmechaniken](#spielmechaniken)

---

## 🎮 Steuerung

### Bewegung
| Taste | Aktion |
|-------|--------|
| `A` / `←` | Nach links bewegen |
| `D` / `→` | Nach rechts bewegen |
| `W` / `↑` / `Space` | Springen |
| `Shift` (gedrückt halten) | Sprinten (2x schneller) |

### Interaktion
| Taste | Aktion |
|-------|--------|
| `Linksklick` (gedrückt halten) | Block abbauen |
| `Rechtsklick` | Block platzieren |
| `Rechtsklick` (auf Item im Inventar) | Item-Stack teilen |
| `Mausrad` / `1-6` | Hotbar-Slot wechseln |

### Menüs
| Taste | Aktion |
|-------|--------|
| `E` | Inventar öffnen/schließen |
| `C` | Crafting-Menü öffnen/schließen |
| `T` | Chat öffnen |
| `Enter` | Chat-Nachricht senden |
| `Esc` | Menü schließen |
| `F3` | Debug-Informationen anzeigen |

---

## 🧱 Blöcke

### Naturblöcke
| Block | ID | Beschreibung | Abbauzeit |
|-------|----|--------------|-----------| 
| **Grass** | `grass` | Hohes Gras, schnell abbaubar | 0.5s |
| **Grass Block** | `dirt-grass` | Erdblock mit Gras | 0.8s |
| **Dirt** | `dirt` | Erdblock | 0.8s |
| **Stone** | `stone` | Grundgestein | 3.0s |
| **Granite** | `granite` | Rötliches Gestein | 3.0s |
| **Diorite** | `diorite` | Weißes Gestein | 3.0s |

### Erze
| Block | ID | Beschreibung | Abbauzeit | Drops |
|-------|----|--------------|-----------| ------|
| **Coal Ore** | `coalore` | Kohle-Erz | 4.0s | Coal |
| **Iron Ore** | `ironore` | Eisen-Erz | 5.0s | Iron Ingot |
| **Gold Ore** | `goldore` | Gold-Erz | 4.5s | Gold Ingot |
| **Diamond Ore** | `diamondore` | Diamant-Erz | 6.0s | Diamond |
| **Emerald Ore** | `emeraldore` | Smaragd-Erz | 7.0s | Emerald |

### Baumblöcke
| Block | ID | Beschreibung | Abbauzeit |
|-------|----|--------------|-----------| 
| **Tree Trunk** | `tree` | Baumstamm | 2.0s |
| **Tree Crown** | `tree-head` | Baumkrone | 1.5s |
| **Tree Leaves** | `tree-leaves` | Baumblätter | 0.3s |
| **Grass Block with Tree** | `dirt-grass-tree` | Grasblock mit Baum | 0.8s |

### Crafting-Blöcke
| Block | ID | Beschreibung | Stack |
|-------|----|--------------| ------|
| **Wood** | `wood` | Holzplanken | 64 |

### Spezialblöcke
| Block | ID | Beschreibung | Abbauzeit |
|-------|----|--------------|-----------| 
| **Bedrock** | `bedrock` | Unzerstörbar | ∞ |

---

## 💎 Materialien

### Erz-Materialien
| Material | ID | Beschreibung | Stack | Platzierbar |
|----------|----|--------------| ------|-------------|
| **Coal** | `coal` | Kohle | 64 | ❌ |
| **Iron Ingot** | `iron` | Eisenbarren | 64 | ❌ |
| **Gold Ingot** | `gold` | Goldbarren | 64 | ❌ |
| **Diamond** | `diamond` | Diamant | 64 | ❌ |
| **Emerald** | `emerald` | Smaragd | 64 | ❌ |

### Crafting-Materialien
| Material | ID | Beschreibung | Stack | Platzierbar |
|----------|----|--------------| ------|-------------|
| **Stick** | `wood-stick` | Holzstab | 64 | ❌ |

---

## 🔨 Werkzeuge

### Spitzhacken (Pickaxe)
Zum Abbauen von Stein, Erzen und harten Materialien.

| Werkzeug | ID | Damage | Mining Speed |
|----------|----| -------|--------------|
| **Wooden Pickaxe** | `pickaxe-wood` | 2 | 2.0x |
| **Stone Pickaxe** | `pickaxe-stone` | 3 | 4.0x |
| **Iron Pickaxe** | `pickaxe-iron` | 4 | 6.0x |
| **Gold Pickaxe** | `pickaxe-gold` | 2 | 8.0x |
| **Diamond Pickaxe** | `pickaxe-diamond` | 5 | 10.0x |
| **Emerald Pickaxe** | `pickaxe-emerald` | 6 | 15.0x |

### Äxte (Axe)
Zum Abbauen von Holz und Bäumen.

| Werkzeug | ID | Damage | Mining Speed |
|----------|----| -------|--------------|
| **Wooden Axe** | `axe-wood` | 3 | 2.0x |
| **Stone Axe** | `axe-stone` | 4 | 4.0x |
| **Iron Axe** | `axe-iron` | 5 | 6.0x |
| **Gold Axe** | `axe-gold` | 3 | 8.0x |
| **Diamond Axe** | `axe-diamond` | 6 | 10.0x |
| **Emerald Axe** | `axe-emerald` | 7 | 15.0x |

### Schaufeln (Shovel)
Zum Abbauen von Erde, Sand und weichen Materialien.

| Werkzeug | ID | Damage | Mining Speed |
|----------|----| -------|--------------|
| **Wooden Shovel** | `shovel-wood` | 2 | 2.0x |
| **Stone Shovel** | `shovel-stone` | 3 | 4.0x |
| **Iron Shovel** | `shovel-iron` | 4 | 6.0x |
| **Gold Shovel** | `shovel-gold` | 2 | 8.0x |
| **Diamond Shovel** | `shovel-diamond` | 5 | 10.0x |
| **Emerald Shovel** | `shovel-emerald` | 6 | 15.0x |

### Schwerter (Sword)
Zum Kampf (aktuell nur Damage-Werte).

| Werkzeug | ID | Damage | Mining Speed |
|----------|----| -------|--------------|
| **Wooden Sword** | `sword-wood` | 4 | 1.5x |
| **Stone Sword** | `sword-stone` | 5 | 1.5x |
| **Iron Sword** | `sword-iron` | 6 | 1.5x |
| **Gold Sword** | `sword-gold` | 4 | 1.5x |
| **Diamond Sword** | `sword-diamond` | 7 | 1.5x |
| **Emerald Sword** | `sword-emerald` | 8 | 1.5x |

---

## 🎯 Spielmechaniken

### Crafting
- Öffne das Crafting-Menü mit `C`
- 4x4 Crafting-Grid verfügbar
- Rezepte können im Start-Menü unter "Recipes" eingesehen werden
- Shaped Recipes: Position der Items im Grid ist wichtig

### Inventar
- 6 Spalten × 7 Reihen = 42 Slots
- Hotbar: 6 Slots (schneller Zugriff)
- Items können gestackt werden (max. 64)
- Rechtsklick auf Item-Stack teilt diesen in zwei Hälften

### Baumfällen
- Beim Abbauen eines Baumblocks kollabiert der gesamte Baum
- Blöcke fallen von unten nach oben
- Leaves haben eine längere Fall-Verzögerung
- Alle Blöcke droppen als Items

### Fallschaden
- Ab 7 Blöcken Fallhöhe nimmt der Spieler Schaden
- 1 Herz Schaden pro 7 Blöcke Fallhöhe
- Beispiel: 14 Blöcke = 2 Herzen Schaden

### Tag-Nacht-Zyklus
- Vollständiger Zyklus: ~17 Minuten
- Sonnenaufgang: 20% des Zyklus
- Sonnenuntergang: 70% des Zyklus
- Nachts wird es dunkler (30% Dunkelheit)

### Chunk-System
- Welt wird in Chunks generiert (16 Blöcke breit)
- Maximal 3 Chunks gleichzeitig geladen
- Chunks außerhalb der Reichweite werden entladen

### Admin-Befehle
| Befehl | Beschreibung |
|--------|--------------|
| `/adm` | Gibt alle Werkzeuge und Blöcke |
| `/adm2` | Gibt alle Erze und Materialien (je 100x) |

---

## 📊 Statistiken

### Performance
- FPS-Anzeige mit `F3`
- VSync FPS und Raw FPS werden angezeigt
- Chunk-Informationen
- Item/Particle-Counts

### Debug-Informationen (F3)
- Koordinaten (X, Y)
- FPS (VSync + Raw)
- Geladene Chunks
- Broken Blocks
- Animationen
- Item Drops
- Partikel

---

## 🎨 Features

### Alpha 0.17 Dev
- ✅ Item Index im Start-Menü
- ✅ Crafting-Rezepte Overlay
- ✅ Performance-Optimierungen
- ✅ GPU Hardware Acceleration
- ✅ Tree Collapse System
- ✅ Item Splitting (Rechtsklick)
- ✅ Material Items (Coal, Iron, Gold, Diamond, Emerald)
- ✅ FPS Counter & Debug Stats
- ✅ Hotbar Configuration System

---

**Version:** Alpha 0.17 Dev  
**Entwickler:** Fynn Summers  
**Repository:** [github.com/fynnsummers/brixel](https://github.com/fynnsummers/brixel)
