
GTA Advance Studio

Modding tool for Grand Theft Auto Advance (Game Boy Advance, European version).
Runs in the browser without installation: double-click index.html or use
Start GTA Advance Studio.bat. No server, no Python, no internet connection required.

Tested with Chrome, Edge, and Firefox.

Get started in 30 seconds
Download the package as zip.
Open index.html.
Load ROM - your own legally created copy of Grand Theft Auto Advance (Europe).
   The file can also simply be dragged into the window.
Choose a section on the left and edit it.
Under ROM & Project, save the project (.gtastudio) - this saves only your changes.
Save ROM creates the finished .gba. Always test it in an emulator first, e.g. mGBA.
   To distribute a mod: Create IPS patch under ROM & Project.

Language: At the top right, the interface can be switched to Deutsch, English,
Español, Français, or Italiano - the five languages also contained in the ROM.
The choice is remembered by the browser; on first launch, the system language is used.

The original ROM is never modified. All changes live in memory until you save them
as a new ROM or as a project file.

Expected original ROM: SHA-1 06230842626da504f92396074f7c655e100f5d44, 16 MB.
Other versions are loaded, but hardcoded addresses may differ - Studio warns you
in that case.

Sections
ROM & Project

Header data, checksum, free space, change list. Save/open project, expand ROM to
32 MB for large rebuilds, reset everything. The header checksum is recalculated
automatically when saving.

Mod as IPS patch: Create IPS patch saves only the differences from the
original ROM as an .ips file. This lets you distribute a mod without distributing
the ROM itself - others apply the patch to their own copy with a common patcher,
e.g. Lunar IPS, Floating IPS, or RomPatcher.js. Details:

• Standard IPS (PATCH ... EOF); long fill regions are encoded as RLE records,
  which keeps the patch small.
• The special case offset 0x454F46, which looks like "EOF", is avoided.
• If the ROM was expanded to 32 MB, the 24-bit format is no longer enough - in that
  case IPS32 is written automatically (IPS32 ... EEOF). This is supported
  by Floating IPS and RomPatcher.js, for example; older patchers do not support it.
  Studio points this out when saving.
• Self-check: before saving, the patch is applied to the original ROM and compared
  with the current state. It is saved only if the result matches exactly. The header
  checksum is already corrected in the patch.

Complete Package

Export and import all editable data at once, without selecting every file individually.

Export creates a ZIP with around 3,550 files, about 6 MB, in roughly 4 seconds:

``text
manifest.json          ROM checksum and count per section
sprites/    2,475 PNG  fullscreens/ 10 PNG    menu/      116 PNG
textures/     640 PNG  fonts/        3 PNG    maps/        3 JSON
sounds/       282 WAV  texts/        1 CSV    missions/   18 CSV
`

Import reads the same ZIP back in. You can extract it, edit it with your own
tools, and pack it again - the filenames only need to stay the same, because that
is how files are matched (spra827e0, menuc7a5fc, tex3f0218,
snd071e1c, ...). Using "Import individual files" also works without a ZIP by
selecting multiple files.

• Each section can be enabled or disabled with a checkbox.
• Only data that actually differs is written. Importing an unchanged package leaves
  the ROM byte-identical.
• Unknown or additional files are silently skipped.
• All sections share one common memory manager so moved data does not overwrite
  other data.
• A report is shown at the end: what was changed and what did not fit.

Sprites

2,475 sprites: 2,303 BIOS-RLE-compressed, 172 uncompressed, 4bpp with 16 colors:
cars, characters, weapons, effects, objects. 304 of them contain two frames in one
block, usually 32x64 + 64x32 for vehicles; in the PNG, they are stacked vertically.

• Export as indexed PNG, individually or all as ZIP, including .pal files.
• Import via PNG. Do not change the image size. Indexed PNGs keep their indices;
  RGB/RGBA PNGs are mapped to the palette using the "Map colors instead of indices"
  switch.
• Change the palette directly in Studio by clicking a color field. Note that many
  sprites share a palette.
• If a graphic becomes larger than its available space after packing, it is moved
  to the end of the ROM and all pointers to it are updated. If there is not
  enough space, Studio reports this instead of corrupting data.
• Identical copies, or duplicate groups, are automatically updated together on import.

During mass import, the file is matched by name - spra827e064x64.png belongs to
sprite spra827e0. Do not rename files.

Menu Graphics

116 images made from 4bpp tiles + tilemap + 16-color palette - a different format
from sprites, so they have their own section:

• Title screen (#57): the city panorama, 480x320 pixels
• Logo (#11-#15): the "Grand Theft Auto Advance" lettering in five animation stages
• Rockstar Games logo (#21) and Digital Eclipse logo (#22): the startup screens
• 71 full-screen images at 240x160: character portraits, cutscenes, briefing boards
• one 240x320 cutscene, two 240x40 frames, two 240x16 bars
• 39 icons at 64x64: weapons, objects, map markers

Export as indexed PNG; index 0 is transparent. Import rebuilds both tiles and
tilemap and detects mirrored repetitions - often the result even takes less space
than the original. If it no longer fits, the block is moved to the end of the ROM,
with tiles and map kept contiguous, and the data record is updated. Keep the image
size unchanged, use at most 16 colors, and no more than 1,024 different tiles.
The palette can be edited directly in Studio.

Known images are marked with ★ and can be searched by name.

The table is at 0xC98D28, 116 entries of 28 bytes each:
{palPtr, flags, tilesPtr, tilesSize, mapPtr, u16 w, u16 h, u32} - with
mapPtr == tilesPtr + tilesSize always applying.

Fullscreens (Interiors)

The ten 240x160 screens, 8bpp, 128-color palette - the walkable interiors
(apartment, club, etc.). Same handling as sprites; nine of the ten are identical
and are updated together.

World Textures

640 uncompressed 8-bit city textures: 146x 32x32, 348x 64x64, 146x 128x128 -
rooftops, facades, road surfaces, parking lots, pools. Position and size are fixed;
import writes directly in place.

The world palette has been found: 256 colors, stored four times in the ROM -
0x853DDC, 0x91E32C, 0x9D07F0, 0xCAC048, all four byte-identical. The copies
at 0x91E32C and 0x9D07F0 are located immediately after the map data of islands
1 and 2. This was proven through the palette RAM of the included savestate: exactly
this block is present there, byte for byte. Studio recognizes it by its first four
entries (7C1F F3FF EBBD E37B) and uses it as the default; the dropdown additionally
lists all other palettes found in the ROM for testing.

Fonts

The game texts are rendered at runtime from 8x8 glyphs: 4bpp, 32 bytes per
character, stored consecutively in the ROM. Three fonts have been found:

| Offset | Characters | Description |
|---|---:|---|
| 0x342E08 | 16 | HUD font: hearts, stars, colon, digits 0-9 |
| 0x346808 | 88 | Text font, antialiased (color levels 0,1,3,6,8,11-14) |
| 0x347308 | 88 | Text font, simple (color levels 0,1,3,6) |

Structure of a text font block with 88 glyphs:

`text
0        Arrow/marker character
1-26     A-Z
27 -     28-30 empty    31 .
32-36    , ' ? ! $
37-46    0-9            47 +
48-66    accented letters (19)
67-72    / : ; ( ) %
73-87    symbols and fill characters
`

Export and import use a tile sheet with 16 characters per row, 128x48 pixels for
the text font. Keep the size unchanged, use at most 16 color levels; data is written
in place, nothing is moved.

How I found them: through the video memory of the included savestate. The visible
text there included CHINATOW..., MPH, and the HUD digits - I found these tiles
again in the ROM byte by byte. The order, A = glyph 1, B = 2, and so on, followed
directly from matching the individual letters.

> On encoding: A-Z, digits, and common punctuation are confirmed. Which character
> code points to which glyph is calculated by the program code - there is no table
> for this in the ROM. Characters above 0x7F in the texts follow the game's own
> encoding, not Latin-1. The 19 accented letters are therefore named by position
> (Acc1...Acc19), not by letter.

Map Editor

All three islands: island 1 is 256x256 cells, islands 2 and 3 are 128x256. One cell
corresponds to 64x64 world units.

Three editable layers:

• Tiles (16-bit) - what is placed on the cell
• Collision (8-bit) - only two values: 0 walkable, 11 blocked
• Height (Layer B, 8-bit) - 0 street level, 16 sidewalk/building level, 32 upper level

Five views, each with its own legend including cell counts:

| View | Shows |
|---|---|
| Textures | the tile graphic as in the game |
| Building types | colors each cell by street, sidewalk, building, upper level, ramp |
| Texture + type | both overlaid |
| Collision | walkable / blocked |
| Height | Layer B as grayscale |

The building types are not guessed; they are derived from collision and height.
Analysis of all three islands shows: collision only uses 0 and 11, and height is
essentially 0, 16, and 32. These produce seven surface types - in the type view,
the street network, built-up blocks, and the elevated highway with its ramps are
visible at a glance.

Additional aids:

• Tile selection grouped by building type, with color dot, frequency on this
  island, search field, type filter, and a "recently used" row.
• Write collision and height along with tiles, enabled by default: when you paint
  a house tile, the cell automatically receives the matching block flag and height.
  Without this, buildings would be created that the player can walk through.
• Overview map at the top right with viewport - click to jump there.
• Cell inspector: shows the current brush on the left, including tile image, type,
  collision, and height, and below it live data for the cell under the mouse pointer,
  including world coordinates.
• Status bar below the map with position, cell value, surface type, and step counter.
• Objects and zones are clickable and editable.

Tools: pencil, line, rectangle, fill, eyedropper, selection, move;
brush sizes 1-8; undo/redo across all three layers; copy/paste; grid.

Keyboard: P L R F I S H for the tools, G for grid,
Ctrl+Z / Ctrl+Y for undo/redo, Ctrl+C / Ctrl+V, Delete to fill selection,
hold Space to move, mouse wheel zooms.

Write to ROM transfers the current island. Size and position stay the same;
nothing is moved. JSON / Load exchanges entire maps.

Text Editor

13,775 pointer-reachable strings - 8,698 game texts and 5,077 internal identifiers.
The mission dialogs exist in five languages (EN/ES/FR/IT/DE); Studio recognizes
1,166 such language groups and shows them together for editing.

• Full-text search, filter by language, find & replace over the visible selection.
• CSV export/import for complete translations.
• Shorter texts are written in place. *Longer texts are moved to the end of the ROM,
  and all pointers to them are updated - new texts can therefore be any length as
  long as there is space.
• Character set: Latin-1, codes up to 255. Unsupported characters are reported and
  replaced with ?.

Sound

282 PCM samples, 2.45 MB total and around 4.5 minutes - voice recordings, engines,
weapons, radio snippets. Almost all are 9,556 Hz, 8-bit, mono.

• View waveform and play directly in the browser.
• Save as WAV, individually or all as ZIP; import your own WAV files.
  Any sample rate, 8/16/24/32-bit, mono or stereo - Studio converts them.
• Shorter recordings always fit; longer ones are moved to the end of the ROM and
  the pointers are updated.

> On MIDI: This ROM does not use a sequencer such as Nintendo's
> MusicPlayer2000 (Sappy). There are therefore no MIDI or note data that could be
> exported - music and sounds are stored entirely as pre-recorded PCM samples.
> You add your own music by rendering it as WAV and importing it as a sample.

Missions & Objects

The game describes missions, placed objects, and events through named records
(iambusher16last1, enotincarrace1, brieffailurebar1, ...). Studio finds
18 such tables through their name pointers - including 1,081 instances,
798 briefings, 565 events, 337 vehicle entries, and 228 start points.

Each field is shown with its interpretation (number, pointer, linked text) and can
be edited directly; linked texts jump to the Text Editor. Whole tables can be
exported as CSV.

> About the scope, honestly: The names, table boundaries, and record size are
> confirmed. The meaning of the individual numeric fields is not. Studio therefore
> shows each field with its interpretation instead of inventing a meaning. Likewise,
> the raw data does not reveal exactly where the logical record boundary lies - a
> complete record from the name pointer onward is shown; the last fields may already
> belong to the next entry. Change values in small steps and test in an emulator.

Hex / Raw Data

Direct access to every ROM location, with bookmarks for all known structures,
search for hex bytes or text, byte editor, and import/export of arbitrary ranges.

Space in the ROM

The original ROM is 16 MB and free from 0xFD2F4C onward - around 180 KB for moved
graphics, texts, and samples. If that is not enough, ROM & Project -> Expand to
32 MB extends the address space. Emulators always handle this fine; on real
hardware, the flash cartridge must support 32 MB.

How the ROM stays runnable
• Compression uses the same BIOS-RLE format as the original.
  All 2,485 original graphics fit back into their original space unchanged.
• Moved data has its pointers updated; if no known pointer exists, the import stops
  with a message instead of overwriting anything.
• The header checksum is recalculated when saving.
• An import without real changes produces a byte-identical ROM.

What was tested

Against the original ROM in this folder:

• Graphics search returns exactly the same results as the older Python tool:
  2,303 + 172 sprites, 10 fullscreens, 143 palettes, 116 without a clear palette.
• RLE encoding, tile-to-image/image-to-tile conversion, and PNG writing/reading:
  lossless round-trip over all 2,485 graphics.
• WAV export and reimport: byte-exact round-trip.
• Menu graphics: all 116 images checked through tile reconstruction - pixels
  identical, no image becomes larger in the process, and in total they are even
  1,952 bytes smaller. Title screen written with a change, moved, and read back.
• Shortening text in place and lengthening text by moving it with pointer updates:
  checked and read back.
• Writing an unchanged map back: byte-identical.
• Object and zone lists verified against the descriptors in the ROM.
• Project file: changes exported and imported again - identical result.
• Complete package: export with all eight sections (3,547 files, 5.9 MB) and
  unchanged reimport -> 0 changed bytes. After that, one file per section was
  deliberately changed: sprite, fullscreen, menu, and texture pixel, map cell
  including collision and object position, one shorter and one longer text, one
  halved sample, and one mission field. All eight arrived exactly, all 2,485
  graphics remained decodable, and the header checksum was valid.
• WAV round-trip over all 282 samples byte-exact; previously this was only spot-checked.
• Fonts: tile sheet exported and imported unchanged - 0 changed bytes for all three
  fonts; one deliberate pixel change arrived exactly.
• World palette triple-verified: identical to the palette RAM of the savestate,
  stored four times byte-identically in the ROM, and textures rendered with it show
  recognizable roofs, pools, and parking areas instead of noise.
• IPS patch: single byte, long zero and fill areas (RLE), a change exactly at
  0x454F46, 200,000 scattered changes, a real mod (sprite + moved text), and a
  ROM expanded to 32 MB (IPS32) - every applied patch recreated the edited ROM exactly.
• Languages: all sections opened in all five languages - no errors; the automatic
  search for remaining German texts found nothing in the interface, hints, or
  messages. A few composed small items, e.g. a tooltip in tile selection, may still
  be German.

Not tested: behavior on real hardware. Always test a modded ROM in an emulator first.

Known limitations
• 116 sprites have no clearly identifiable palette. Their image shows a substitute
  palette - the indices are still correct.
• The character-code-to-glyph mapping is in the program code, not in a table.
  The accented letters of the fonts are therefore named by position.
• The ranges 0x800000-0x8D0000 and 0xEE0000-0xF83880 are geometry and pointer
  data for the building renderer, not images. When read as 4bpp or 8bpp graphics,
  they only produce noise.
• Object and zone lists have a fixed length; values can be edited, but new entries
  cannot be appended because the descriptor starts directly afterward.
• The meaning of the numeric fields in the mission records is not documented.
• The 3D-like building/block model system starting at 0xD50000 is only accessible
  through the Hex Editor.
• Translations: game content such as texts from the ROM, mission names, and filenames
  naturally remain as they are. The interface translations are written without
  accents, like German umlauts as ae/oe/ue, and are not by native speakers. If an
  entry is missing, the German text appears.
• When importing menu graphics, the tile order changes; this is meaningless for the
  game, but makes a byte comparison with the original unusable.

Folder structure

`text
index.html                     Start
css/studio.css
js/core.js                     Bytes, SHA-1, PNG, ZIP, Inflate, BIOS-RLE, GBA tiles, IPS, ROM management
js/app.js                      Frame, navigation, dialogs
js/i18n.js                     Language switching
data/lang.js, data/lang2.js    Translations (EN/ES/FR/IT), key = German text
js/gfxscan.js                 Sprite and fullscreen search
js/tabbulk.js                 Complete package (ZIP export/import)
js/tabmenu.js                 Menu graphics (tiles + tilemap)
js/tabfont.js                 Fonts
js/tab.js                    the other sections
data/tiles1..3.js              Tile preview and map addresses of the three islands
`

Everything is pure JavaScript with no dependencies and no network access.

