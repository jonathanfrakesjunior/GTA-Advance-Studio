# GTA Advance Studio

**Languages:** [Deutsch](LIESMICH.md) · English · [Español](LEEME.md) · [Français](LISEZMOI.md) · [Italiano](LEGGIMI.md)

Modding tool for *Grand Theft Auto Advance* (Game Boy Advance, European version).
Runs in the browser without installation: **double-click `index.html`** (or
`GTA Advance Studio starten.bat`). No server, no Python, no internet connection needed.

Tested with Chrome, Edge and Firefox.

---

## Get started in 30 seconds

1. Open `index.html`.
2. **Load ROM** – your own, legally dumped copy of *Grand Theft Auto Advance (Europe)*.
   You can also simply drag the file into the window.
3. Pick an area on the left and edit.
4. Save the project (`.gtastudio`) under **ROM & project** – it only stores your changes.
5. **Save ROM** creates the finished `.gba`. Always test it in an emulator (e.g. mGBA) first.
   To share a mod: **Create IPS patch** (under ROM & project).

**Language:** The interface can be switched to Deutsch, English, Español, Français or
Italiano at the top right – the five languages the ROM itself contains. The choice is
remembered by the browser; on first start the system language is used.

The original ROM is never modified. All changes live in memory until you save them as
a new ROM or as a project file.

Expected original ROM: SHA-1 `06230842626da504f92396074f7c655e100f5d44`, 16 MB.
Other versions can be loaded, but hard-coded addresses may differ – the studio warns
you in that case.

---

## The areas

### ROM & project
Header data, checksum, free space, list of changes. Save/open projects, expand the
ROM to 32 MB (for large conversions), reset everything. The header checksum is
recalculated automatically on saving.

**Mod as IPS patch:** *Create IPS patch* saves only the differences to the original
ROM as `.ips`. This lets you share a mod without distributing the ROM – others apply
the patch to their own copy with a common patcher (e.g. Lunar IPS, Floating IPS,
RomPatcher.js). Details:

* Standard IPS (`PATCH` … `EOF`); long fill runs are encoded as RLE records, which
  keeps the patch small.
* The special case of offset `0x454F46` (which looks like "EOF") is avoided.
* If the ROM was expanded to 32 MB, the 24-bit format is no longer enough – then
  **IPS32** (`IPS32` … `EEOF`) is written automatically. Floating IPS and RomPatcher.js
  support it; older patchers do not. The studio points this out when saving.
* Self-check: before saving, the patch is applied to the original ROM and compared
  with your current state. It is only saved if both match exactly. The header
  checksum is already fixed inside the patch.

### Complete package
Write all editable data out at once and import it back, without picking each file.

**Export** creates a ZIP with about 3,550 files (around 6 MB, ~4 seconds):

```
manifest.json          ROM checksum and count per area
sprites/    2,475 PNG  vollbilder/  10 PNG    menue/     116 PNG
texturen/     640 PNG  schriften/    3 PNG    karten/      3 JSON
sounds/       282 WAV  texte/        1 CSV    missionen/  18 CSV
hud/            7 PNG
```

**Import** reads the same ZIP back in. You can unpack it, edit it with your own tools
and pack it again – the file names just have to stay the same, because they are used
to match the data (`spr_a827e0`, `menu_c7a5fc`, `tex_3f0218`, `snd_071e1c`, …).
"Import single files" works without a ZIP, with a multiple selection.

* Each area can be switched on and off with a checkbox.
* Only what actually differs is written. Re-importing an unchanged package leaves the
  ROM **byte-identical**.
* Unknown or extra files are skipped silently.
* All areas share one space allocator so that relocated data never overwrite each other.
* A report at the end lists what was changed and what did not fit.

### Sprites
2,475 sprites (2,303 BIOS-RLE compressed, 172 uncompressed), 4bpp with 16 colours:
cars, characters, weapons, effects, objects. 304 of them contain two frames in one
block (mostly 32×64 + 64×32 for vehicles); in the PNG they are stacked vertically.

* Export as indexed PNG (single or all as ZIP, including `.pal` files).
* Import via PNG. **Do not change the image size.** Indexed PNGs keep their indices;
  RGB/RGBA PNGs are matched to the palette (switch *"Map colours instead of indices"*).
* Edit palettes directly in the studio (click a colour swatch). Note: many sprites
  share one palette.
* If a graphic becomes larger than its slot after packing, it moves to the end of the
  ROM and **all pointers to it are updated**. If there is not enough room, the studio
  says so instead of overwriting anything.
* Identical copies (duplicate groups) are updated automatically on import.

**Palettes:** every sprite has its real palette. Usually an object points directly to
the sprite record and, next to it, to the palette. For animations (buses, fire
engine, taxi, ambulance, crane), however, the object points to a frame list –
`[count][pointer to list][palette]` – and all frames of the list use that palette.
This also solves the 116 sprites that previously showed a substitute palette.

For bulk import the file is matched by its name – `spr_a827e0_64x64.png` belongs to
sprite `spr_a827e0`. So do not rename files.

**Sets (sheets):** the **Sets** switch at the top shows sprites that belong together as
one image. The game stores all views of a vehicle, all frames of a character or an
effect as a table of consecutive pointers to the sprite records – every such table is a
set (239 sets with 2 to 170 sprites, together 2,295 of the 2,475 sprites; e.g. 23 per
vehicle, 30 per pedestrian). The sheet arranges the sprites in rows with a 2-pixel gap
(index 0 = transparent); duplicates appear only once.

* **Export / import sheet** for one set, **Export all sheets as ZIP** and **Import
  sheets** (multiple selection; matched by the name `set_f73dec_…`).
* On import every part goes the same way as a single PNG: packing, moving with pointer
  update if needed, duplicates follow. Only sprites that really changed are written.
* Keep layout and image size. Indexed PNGs keep their indices; RGB PNGs are matched to
  each sprite's own palette with "match colours".
* The set's palette can be edited right in the side panel. Six sets mix palettes – there
  the sheet shows all sprites with the palette of the first one.

### Menu graphics
116 images made of **4bpp tiles + tilemap + 16-colour palette** – a different format
from the sprites, hence a separate area:

* **Title screen** (#57): the city panorama, 480×320 pixels
* **Logo** (#11–#15): the "Grand Theft Auto Advance" lettering in five animation stages
* **Rockstar Games logo** (#21) and **Digital Eclipse logo** (#22) – the boot screens
* 71 full screens 240×160: character portraits, cutscenes, briefing boards
* one 240×320 cutscene, two 240×40 frames, two 240×16 bars
* 39 icons 64×64: weapons, objects, map markers

Export as indexed PNG (index 0 is transparent). Import rebuilds tiles **and** tilemap
and detects mirrored repeats – the result often needs even less space than the
original. If it no longer fits, the block (tiles and map stay together) moves to the
end of the ROM and the record is updated. Keep the image size, at most 16 colours,
at most 1,024 different tiles. The palette can be edited directly in the studio.

Known images are marked with ★ and can be found by name.

The table is at `0xC98D28`, 116 entries of 28 bytes:
`{palPtr, flags, tilesPtr, tilesSize, mapPtr, u16 w, u16 h, u32}` – where always
`mapPtr == tilesPtr + tilesSize`.

### Full screens (interiors)
The ten 240×160 screens (8bpp, 128-colour palette) – the walkable interiors
(apartment, club, …). Same handling as sprites; nine of the ten are identical and are
updated together.

### World textures
640 uncompressed 8-bit city textures: 146× 32×32, 348× 64×64, 146× 128×128 –
roofs, facades, road surfaces, car parks, pools. Position and size are fixed; the
import writes in place.

**The world palette has been found:** 256 colours, stored four times in the ROM –
`0x853DDC`, `0x91E32C`, `0x9D07F0`, `0xCAC048`, all four byte-identical. The copies at
`0x91E32C` and `0x9D07F0` are located directly behind the map data of island 1 and 2.
Proven via the palette RAM of the included savestate: this exact block is there, byte
for byte. The studio recognises it by its first four entries (`7C1F F3FF EBBD E37B`)
and uses it as the default; the drop-down additionally lists all other palettes found
in the ROM for experimenting.

### Fonts
The game texts are drawn at runtime from **8×8 glyphs**: 4bpp, 32 bytes per character,
stored consecutively in the ROM. Three fonts have been found:

| Offset | Characters | Description |
|---|---|---|
| `0x342E08` | 16 | HUD font: hearts, stars, colon, digits 0–9 |
| `0x346808` | 88 | Text font, anti-aliased (colour levels 0,1,3,6,8,11–14) |
| `0x347308` | 88 | Text font, plain (colour levels 0,1,3,6) |

Layout of a text font block (88 glyphs):

```
0        arrow/marker character
1–26     A–Z
27 -     28–30 empty    31 .
32–36    , ' ? ! $
37–46    0–9            47 +
48–66    accented letters (19)
67–72    / : ; ( ) %
73–87    symbols and filler characters
```

Export and import use a tile sheet with 16 characters per row (128×48 pixels for the
text font). Keep the size, at most 16 colour levels; data is written in place,
nothing is moved.

**How they were found:** via the video memory of the included savestate. It visibly
contained `CHINATOW…`, `MPH` and the HUD digits – these tiles were found byte for byte
in the ROM. The order (A = glyph 1, B = 2, …) followed directly from matching the
individual letters.

> **About the encoding:** A–Z, digits and common punctuation are confirmed. Which
> character code points to which glyph is computed by the program code – there is no
> table for it in the ROM. Characters above `0x7F` in the texts follow the game's own
> encoding, not Latin-1. The 19 accented letters are therefore named by position
> (`Akz1`…`Akz19`), not by letter.

### HUD graphics
The game loads the graphics of the on-screen display directly from its program code
(via DMA, without a table) – which is why they are not listed under sprites. Found
with the emulator (video memory and HUD tilemap of the running game compared with
the ROM):

| Element | Offset | Format | Palette |
|---|---|---|---|
| Weapon icons (16 × 32×32) | `0x3444E8` | 4bpp tiles | `0xCA635C` |
| Money digits `$0–9` (8×16) | `0x343028` | 4bpp, upper/lower half separate | world palette bank 15 |
| Clock digits `0–9` | `0x342EE8` | 4bpp | world palette bank 15 |
| Radar icons (L, J, V, C, A, K, M, targets) | `0x3464E8` | 25 tiles | `0xCA637C` |
| Radar dots | `0x342B28` | 23 tiles | `0xCA637C` |
| Radar ring with "N" (48×48) | `0x343BE8` | one byte per pixel | world palette bank 15 |
| Radar mask (48×48) | `0x3432E8` | one byte per pixel | world palette bank 15 |

Export/import as indexed PNG (16 colours), in place. Hearts, stars and the digits of
the health display belong to the HUD font under "Fonts". The game assembles the radar
content and the health number at runtime from these parts.

**Palette editor:** below every graphic its palette is shown as swatches – as with
sprites and menu graphics, click a swatch and pick the colour (15 bits, rounded). The
studio names the other HUD elements that use the same palette. Money and clock digits,
radar ring and mask share colours 240–255 of the world palette.

### Map editor
All three islands (island 1: 256×256 cells, islands 2 and 3: 128×256). One cell
corresponds to 64×64 world units.

Four layers per cell:
* **Ground graphic** (16 bits) – number of a 40×40-pixel cell graphic made of 5×5
  tiles. This is exactly what the game draws as the ground (proven in the emulator).
* **Tiles** (16 bits) – the cell value: bits 0–9 the surface type, bits 10–15 the
  district (rectangular areas; the district name in the game such as CHINATOWN comes from it)
* **Collision** (8 bits) – only two values: 0 (road network) and 11 (building blocks
  including pavements and squares)
* **Height** (layer B, 8 bits) – essentially 0 (sea around the city), 16 (city level)
  and 32 (upper level, elevated road)

When painting with the tile picker, the ground graphic is written too (can be switched
off): by default the most common graphic of the value, any other one via the
**graphic variants** bar in the brush panel (e.g. centre line, zebra crossing, shore).
The **eyedropper** takes the exact graphic of a cell – so crossings, squares or parks
can be copied exactly to other places. Copy/paste includes the ground graphic.

**Five views**, each with its own legend including cell counts:

| View | shows |
|---|---|
| Textures | the real ground graphics of the game |
| **Building types** | colours each cell as water, road, block, upper level, ramp |
| Texture + type | both on top of each other |
| Collision | road network / block |
| Height | layer B as greyscale |

The surface types are not guessed but follow from collision and height. The analysis of
all three islands (ground graphics laid next to collision and height) shows: height 0 is
the sea around the city; at height 16, collision 0 is the road network and collision 11
the block including pavement and squares; height 32 is the upper level, values in
between are ramps. The types view therefore shows road network, blocks, water and the
elevated road with its ramps at a glance. (Up to version 1.1 these types were named
wrongly – height 0 was called "road" there.)

More helpers:
* **Tile picker grouped by building type**, with colour dot, frequency on this island,
  search field, type filter and a "recently used" row.
* **Also write collision and height** (on by default): if you paint a road or block
  tile, the cell automatically gets the matching collision and height.
* **Overview map** at the top right with the view frame – a click jumps there.
* **Cell inspector**: shows the current brush (tile image, type, collision, height) and
  below it, live, the cell under the mouse pointer including world coordinates.
* **Status bar** below the map with position, cell value, surface type and step counter.
* Objects and zones can be clicked and edited.

Tools: pen, line, rectangle, fill, eyedropper, selection, pan; brush sizes 1–8;
undo/redo across all layers; copy/paste; grid.

Keyboard: `P` `L` `R` `F` `I` `S` `H` for the tools, `G` grid, `Ctrl+Z` / `Ctrl+Y`
undo/redo, `Ctrl+C` / `Ctrl+V`, `Del` fills the selection, hold the space bar to pan,
mouse wheel zooms.

**Write to ROM** transfers the current island. Size and position stay the same,
nothing is moved. `JSON` / `Load` exchanges whole maps (including ground graphics).

#### Importing and exporting world tiles (ground graphics)

In the side panel under "World tiles":
* **Tile set** – all 8×8 tiles of an island as one PNG (32 tiles per row, 256 colours of
  the world palette). Edit it, keep the size, import it again – every tile is replaced
  in place and applies everywhere it is used.
  (Island 1: 1,687 tiles, island 2: 1,818, island 3: 1,476.)
* **Area** – mark an area with the selection tool, **Export as image** (40 pixels per
  cell), paint a new street, a crossing or a whole district into it and **Import
  image**. The studio splits the image into tiles, reuses identical tiles, reuses slots
  that became free and writes the ground graphics to the ROM immediately.

Room for new tiles: in the original, tiles, cell graphics and ground map are stored in
one piece. If the freed slots are not enough, the ground map moves to the free ROM area
and tiles/cell graphics grow in place (island 1: about 130 KB, islands 2/3: about
64 KB). Only after that would an expansion to 32 MB be needed – the studio asks first.

Limit of the game: the engine loads visible tiles into a cache with 256 slots. The
original maps need at most about 200 per screen. The studio warns if an imported image
puts more than 240 different tiles on one screen – the game may then show wrong tiles
there.

#### Image → city

The **Image → city** button brings any image (PNG, JPEG, WebP, BMP, GIF) into the
island – into the selection or, without a selection, into the whole island. The image
is stretched, fitted (border stays) or cropped. The image is on the left, the live
result on the right. **Apply** writes into the editor; undo works.

**City plan (colours → surfaces)** – for large-scale map mods. Each image colour stands
for a surface type (water, road, block, upper level …):
* The studio suggests the legend from the most common image colours. Every colour can
  be picked in the image with the **eyedropper**; the target is a surface type, the
  current brush or "leave unchanged".
* **Colour tolerance**: how far an image colour may differ from the legend colour. On
  top of that, a majority of up to 16 pixels decides each cell – so JPEG artefacts and
  soft edges don't matter. Colours outside the tolerance take the nearest legend colour
  or leave the cell unchanged.
* Graphics, cell value, collision and height come from the original island: for every
  cell the studio looks up how the original designs a cell of this type with exactly
  these eight neighbours. Kerbs, corners, pavements and shores therefore fit by
  themselves. No new tiles are created and no extra ROM space is needed.
* **Surface** per legend entry: automatic or one of the typical inner surfaces of this
  type (e.g. lawn, concrete, roof, gravel) – with a preview image.
* **Road markings**: straight roads of even width get the yellow centre line exactly in
  the middle, the rest plain asphalt.
* **Keep districts**: the district (upper 6 bits of the cell value) is kept, only the
  surface type changes – the district name in the game stays correct.
* **Export template** saves the target area as PNG with one pixel per cell in the
  colours of the "Building types" view. Paint over it in an image editor, load it again,
  legend "Editor colours" – done.

**Ground graphics (image → tiles)** – the image itself becomes the ground graphics
(40×40 pixels per cell, area up to 64×64 cells):
* **Matching palette**: the 256 colours of the world palette are shared by the ground,
  640 textures and the HUD. The studio finds out which colour slots no tile and no
  texture uses (13 in the original ROM) and, if wanted, fills them automatically with
  the image colours the existing palette matches worst. All other image colours get the
  nearest existing colour. Slot 0 (transparent) and 240–255 (HUD) stay untouched.
* **Eyedropper**: click a free colour slot, then the colour in the image – or
  "Eyedropper: next free slot" for several colours in a row. Right-click releases a
  slot. The eyedropper averages 3×3 pixels so that a single JPEG outlier doesn't
  distort the colour.
* **Colour tolerance**: image colours closer together than this are merged into one
  colour before matching – against JPEG artefacts and noise.
* **Tile tolerance**: 8×8 image tiles that barely differ from an existing tile reuse it.
  **Keep the tile limit automatically** raises the tolerance until at most 240 different
  tiles appear on one screen.
* Transparent parts of the image keep the existing ground graphics.

#### 3D view

The **3D view** switch shows the area around the current position as a relief: tops
with the real ground graphics, height from layer B, blocks (collision 11) as raised
blocks – so you see blocks and the road network in three dimensions. All tools also
work in 3D – the left mouse button paints, fills, selects or picks with the eyedropper.

Controls: right mouse button rotates, mouse wheel zooms, middle button / space bar /
hand tool pans, arrow keys move, `Q`/`E` turn. A click on the overview map also jumps
there in 3D.

The blocks are an editing aid: the real buildings are 3D models of the game (their own
data structure); their height is not reproduced here. If WebGL does not run, the
studio says so and the 2D view remains usable.

### Camera hack

Changes camera distance and tilt with extra code in the ROM, as a fixed preset and, if
you like, adjustable in game. Can be removed completely at any time (**Remove hack**
restores all original bytes).

**How the game camera works** (determined by emulator analysis):
* Camera in IWRAM at `0x03000014`: X, Y, **height** (16.16 fixed point). The visible
  width is 2 × height; ground (affine background layer) and sprites are scaled together
  accordingly.
* Target heights: 164 on foot and with pause menu "Camera 1", 192 with "Camera 2", 220
  with "Camera 3" and in vehicles; limits 164…220.
* Buildings are real 3D models; their vertices are projected in perspective at
  `0x0800EEBA` with `k = 118 / (camera height − z)`.

**What the hack does:**
* **Distance**: own target heights for on foot, the three camera levels of the pause
  menu and vehicles, plus own limits (64…255; below 96 experimental, because tall
  buildings can then be higher than the camera). More than 255 is not possible – the
  GBA ground layer is only 512 pixels wide.
* **Tilt**: shifts the vanishing point of the 3D projection. Everything at ground level
  stays exact, higher parts lean – you see the side walls of the buildings like with a
  tilted camera.
* **In-game control** (can be switched off): **hold SELECT** + D-pad = tilt, + `L`/`R` =
  closer/further, + `A` = back to the preset. While SELECT is held, the game sees no
  buttons; SELECT alone is passed on to the game when released.
* **Extend visible area**: buildings are drawn from 64 instead of 16 world units outside
  the screen – prevents pop-in at the edge with strong tilt.

The preview shows example buildings with the same projection formula as the game.

**First-person view:** not possible. The engine draws the ground as a flat background
layer seen from above and cars/characters as flat sprites seen from above. A
first-person view would need a completely new renderer. The closest you can get is a
small distance and strong tilt.

Technical: the code (about 420 bytes of Thumb, signature `GTASCAM1`) is located in the
free ROM area and hooked in at three places: projection `0x0800EED8`, button input
`0x080656F8`, target height `0x0800A040`. The values changed in game are stored in
IWRAM at `0x030000C0` – a 60-byte padding area between the variables and the ARM code
of the game that no part of the program refers to. A signature additionally protects
against accidental overwriting.

### Text editor
13,775 strings reachable via pointers – 8,698 game texts and 5,077 internal
identifiers. The mission dialogues exist in five languages (EN/ES/FR/IT/DE); the studio
recognises 1,166 such language groups and shows them together for editing.

* Full-text search, filter by language, find & replace over the visible selection.
* CSV export/import for whole translations.
* Shorter texts are written in place. **Longer texts move to the end of the ROM, and
  all pointers to them are updated** – new texts may be as long as you like, as long as
  there is room.
* Character set: Latin-1 (codes up to 255). Characters that cannot be displayed are
  reported and replaced by `?`.

### Sound
282 PCM samples, 2.45 MB and about 4.5 minutes in total – voice recordings, engines,
weapons, radio snippets. Almost all at 9,556 Hz, 8 bits, mono.

* View the waveform, play directly in the browser.
* Save as WAV (single or all as ZIP), import your own WAV files. Any sample rate,
  8/16/24/32 bits, mono or stereo – the studio converts.
* Shorter recordings always fit; longer ones are moved to the end of the ROM and the
  pointers are updated.

> **About MIDI:** this ROM does **not** use a sequencer such as Nintendo's
> MusicPlayer2000 (Sappy). So there is no MIDI or note data that could be exported –
> music and sound effects are all stored as pre-recorded PCM samples. To add your own
> music, render it as WAV and import it as a sample.

### Missions & objects
The game describes missions, placed objects and events through named records
(`i_ambusher16_last1`, `e_notincar_race1`, `brief_failure_bar1`, …). The studio finds
18 such tables via their name pointers – among them 1,081 instances, 798 briefings,
565 events, 337 vehicle entries, 228 start points.

Every field is shown with its interpretation (number, pointer, linked text) and can be
changed directly; linked texts jump to the text editor. Whole tables can be exported
as CSV.

> **Scope, honestly:** the names, table boundaries and record size are confirmed. The
> meaning of the individual number fields is not. The studio therefore shows every
> field with its interpretation instead of inventing a meaning. Likewise, the raw data
> does not reveal exactly where the logical record ends – a full record starting at the
> name pointer is shown; the last fields may already belong to the next entry. Change
> values in small steps and test in the emulator.

### Hex / raw data
Direct access to every byte of the ROM, with bookmarks for all known structures, search
for hex bytes or text, byte editor and import/export of any range.

---

## Space in the ROM

The original ROM is 16 MB and free from `0xFD2F4C` – about 180 KB for relocated
graphics, texts and samples. If that is not enough, **ROM & project → Expand to 32 MB**
enlarges the address space. Emulators always handle this; on real hardware the flash
cartridge must support 32 MB.

## How the ROM stays playable

* Compression uses the same BIOS-RLE format as the original. All 2,485 original
  graphics fit back into their slots unchanged.
* Relocated data get their pointers updated; if no pointer is known, the import stops
  with a message instead of overwriting anything.
* The header checksum is recalculated on saving.
* An import without a real change results in a byte-identical ROM.

## What was tested

Against the original ROM in this folder:

* The graphics scan gives exactly the same results as the older Python tool (2,303 +
  172 sprites, 10 full screens, 143 palettes). The 116 sprites for which the old scan
  found no palette (buses, fire engine, taxi, ambulance, crane animation) now have
  their real palette – see "Sprites". Cross-check: for all 2,359 sprites with an
  already known palette, the new method gives the same one.
* RLE encoding, tile↔image conversion and PNG writing/reading: lossless round trip over
  all 2,485 graphics.
* WAV export and re-import: byte-exact round trip.
* Menu graphics: all 116 images checked via tile rebuild – identical pixels, no image
  grows (in total even 1,952 bytes smaller). Title screen written with a change,
  relocated and read back.
* Shortening a text (in place) and lengthening it (moved, pointers updated): tested and
  read back.
* Writing a map back unchanged: byte-identical.
* Object and zone lists verified against the descriptors in the ROM.
* Project file: changes exported and imported again – identical result.
* Complete package: export with all eight areas (3,547 files, 5.9 MB) and re-imported
  unchanged → **0 changed bytes**. Then one file per area changed on purpose (sprite,
  full-screen, menu and texture pixels, a map cell including collision and object
  position, a shorter and a longer text, a halved sample, a mission field) – all eight
  arrived exactly, all 2,485 graphics stayed decodable, header checksum valid.
* WAV round trip over **all** 282 samples byte-exact (previously only spot checks).
* Fonts: tile sheet exported and imported unchanged – 0 changed bytes for all three
  fonts; a targeted pixel change arrived exactly.
* World palette confirmed three ways: identical to the palette RAM of the savestate,
  four byte-identical copies in the ROM, and textures rendered with it show recognisable
  roofs, pools and car parks instead of noise.
* IPS patch: single byte, long zero and fill runs (RLE), a change exactly at
  `0x454F46`, 200,000 scattered changes, a real mod (sprite + relocated text) and a ROM
  expanded to 32 MB (IPS32) – every patch, once applied, gave exactly the edited ROM.
* Languages: all areas opened in all five languages – no errors; the automatic search
  for remaining German texts found nothing in the interface, hints and messages. A few
  composed details (e.g. a tooltip in the tile picker) may still be German.
* **Camera hack** in the emulator (mGBA, remote-controlled via the debugger): tilt 0
  gives a byte-identical image to the original; distance 96…250, tilt in both
  directions, SELECT control and reset work from power-on; watchpoints confirmed that
  only the hack's own code writes to the RAM block. The ROM created by the studio is
  byte-identical to the one tested in the emulator.
* **Ground graphics**: decoded from the level tables and compared with the game
  picture. Tile set and areas re-imported unchanged → 0 changed bytes. Several
  overlapping imports on all three islands → every cell of the island matches the
  expected result. An imported pattern and a road strip painted in the editor appear
  correctly in the game in the emulator. The complete package transfers changed ground
  graphics exactly (a second import changes nothing).
* **3D view**: painting, filling, eyedropper and undo in 3D.
* **HUD graphics**: all seven elements re-imported unchanged → 0 changed bytes; a
  repainted weapon icon and money digits appear exactly like that in the game.
* **Image → city** in the emulator: a JPEG city plan (road grid with a park) over
  48×44 cells around the starting point – roads with centre line, pavements and kerbs
  appear in the game, the radar shows the new grid, the district name stays
  (CHINATOWN). A JPEG photo as ground graphics (9×7 cells, 13 new palette colours, one of
  them via eyedropper): the game loads the new colours into palette RAM and shows the
  image. Undo restores the previous state.
* **Sprite sets**: all 239 sheets re-imported unchanged → 0 changed bytes; one changed
  pixel in a sheet lands in exactly that sprite; the same sheet as an RGB PNG with
  colour matching → 0 changes. HUD palette: a changed colour is stored as the correct
  15-bit value in the ROM.

**Not tested:** behaviour on real hardware. Always test a modded ROM in an emulator
first.

---

## Known limitations

* The mapping character code → glyph is in the program code, not in a table. The
  accented letters of the fonts are therefore named by position.
* The ranges `0x800000–0x8D0000` and `0xEE0000–0xF83880` are geometry and pointer data
  of the building renderer, not images. Read as 4bpp or 8bpp graphics they only give
  noise.
* Object and zone lists have a fixed length; values can be changed, new entries cannot
  be appended because the descriptor follows directly behind them.
* The meaning of the number fields in the mission records is not documented.
* The 3D-like building/block model system (from `0xD50000`) is only reachable via the
  hex editor.
* Translations: game content (texts from the ROM, mission and file names) of course
  stays as it is. The interface translations are written without accents (like the
  German umlauts as ae/oe/ue) and are not by native speakers. If an entry is missing,
  the German text appears.
* Camera hack: a first-person view is not feasible with this engine (see above). Cars,
  characters and the ground stay flat; only 3D buildings lean when tilting.
* World tiles: more than about 240 different tiles per screen can lead to wrong tiles in
  the game. An image import is written directly to the ROM and clears the undo list of
  the map editor.
* Image → city does not create building models: the 3D houses of the original and the
  objects (vehicles, people, pickups) stay where they are.
* The meaning of collision (0/11) is "road network" versus "building block" (including
  pavements and squares); who may walk or drive where is additionally controlled by
  other data of the game.
* When importing menu graphics the order of the tiles changes; this does not matter to
  the game but makes a byte comparison with the original useless.

## Folder structure

```
index.html                     start
css/studio.css
js/core.js                     bytes, SHA-1, PNG, ZIP, inflate, BIOS-RLE, GBA tiles, IPS, ROM handling
js/app.js                      frame, navigation, dialogs
js/i18n.js                     language switching
data/lang*.js                  translations (EN/ES/FR/IT), key = German text
js/gfx_scan.js                 sprite and full-screen scan
js/tab_bulk.js                 complete package (ZIP export/import)
js/tab_menu.js                 menu graphics (tiles + tilemap)
js/tab_font.js                 fonts
js/tab_hud.js                  HUD graphics
js/tab_camera.js               camera hack (interface, install, removal)
data/camhack.js                machine code of the camera hack
js/map_ground.js               ground graphics of the islands (reading, tile import/export)
js/map_image.js                image → city (city plan and ground graphics from images)
js/map3d.js                    3D view of the map editor (WebGL)
js/tab_*.js                    the remaining areas
data/tiles1..3.js              tile preview and map addresses of the three islands
```

Everything is plain JavaScript without dependencies and without network access.

### Adding translations

The key is always the German text as it appears in the program. Numbers, hex values,
file names and names in quotes are replaced by `{0}`, `{1}` … beforehand, so that e.g.
"3 Texturen exportiert." and "640 Texturen exportiert." use the same entry
`'{0} Texturen exportiert.'`. You can find missing entries in the browser console with
`GTAS.i18nCollect = true`, then use the studio for a while and call `GTAS.i18nReport()`.
