# GTA Advance Studio

A browser-based modding tool for **Grand Theft Auto Advance (Game Boy Advance, European version)**.

Runs entirely in the browser with **no installation, server, Python, dependencies, or internet connection required**.

## Features

* **ROM & Project management**

  * Open and save ROMs
  * Save changes as `.gtastudio` projects
  * Expand ROMs from 16 MB to 32 MB
  * Automatic header checksum recalculation
  * IPS / IPS32 patch creation

* **Complete Package**

  * Export and import all editable data as a ZIP
  * Approximately 3,550 files / 6 MB
  * Supports sprites, graphics, textures, maps, fonts, sounds, texts, and missions
  * Individual files can also be imported directly

* **Sprites**

  * 2,475 sprites
  * PNG export/import
  * Palette editing
  * Automatic relocation when imported graphics no longer fit
  * Duplicate sprite groups are updated automatically

* **Menu Graphics**

  * 116 editable images
  * Title screen, logos, cutscenes, portraits, briefing boards, and icons
  * Indexed PNG import/export
  * Automatic tilemap reconstruction

* **World Textures**

  * 640 city textures
  * Supports rooftops, facades, roads, parking lots, pools, and more

* **Map Editor**

  * All three islands
  * Tiles, collision, and height layers
  * Pencil, line, rectangle, fill, eyedropper, selection, and move tools
  * Undo/redo, copy/paste, grid, zoom, and overview map
  * Editable objects and zones

* **Text Editor**

  * 13,775 pointer-reachable strings
  * Five-language mission dialog support
  * Search and replace
  * CSV export/import
  * Automatic relocation of longer texts and pointer updates

* **Sound**

  * 282 PCM samples
  * WAV export/import
  * Browser playback and waveform display
  * Automatic conversion of imported WAV files

* **Missions & Objects**

  * 18 discovered tables
  * 1,081 mission instances
  * 798 briefings
  * 565 events
  * 337 vehicle entries
  * 228 start points
  * CSV export

* **Hex / Raw Data Editor**

  * Direct ROM access
  * Hex and text search
  * Bookmarks for known structures
  * Arbitrary range import/export

## Getting Started

You can start using GTA Advance Studio in about 30 seconds:

1. Download the project as a ZIP.
2. Open `index.html`, or run `Start GTA Advance Studio.bat`.
3. Load your own legally created copy of the **European GTA Advance ROM**.
4. Choose a section from the left-hand navigation.
5. Edit the desired data.
6. Save your work as a `.gtastudio` project or create a new `.gba` ROM.
7. Test modified ROMs in an emulator such as **mGBA**.
8. To distribute a modification, create an IPS patch under **ROM & Project**.

### Browser Support

Tested with:

* Chrome
* Edge
* Firefox

No server or internet connection is required.

## ROM Compatibility

The expected original ROM is:

```text
SHA-1: 06230842626da504f92396074f7c655e100f5d44
Size:  16 MB
```

Other versions can be loaded, but hardcoded addresses may differ. The Studio warns when a different ROM is detected.

## IPS Patching

GTA Advance Studio can create patches containing only the differences between the original and modified ROM.

The standard IPS format is used for normal ROMs. If the ROM has been expanded to 32 MB, Studio automatically creates an **IPS32** patch. A self-check applies the generated patch to the original ROM and verifies that the result matches the edited ROM exactly.

This allows mods to be distributed **without distributing the original ROM**.

## Languages

The interface supports:

* Deutsch
* English
* Español
* Français
* Italiano

The selected language is remembered by the browser. On first launch, the system language is used when supported.

## Project Structure

```text
index.html
css/
└── studio.css

js/
├── core.js
├── app.js
├── i18n.js
├── gfxscan.js
├── tabbulk.js
├── tabmenu.js
├── tabfont.js
└── tab.js

data/
├── lang.js
├── lang2.js
└── tiles1..3.js
```

The project is written entirely in JavaScript with **no dependencies and no network access**.

## Testing

The project has been tested extensively against the original ROM, including:

* Graphics round-trips
* PNG import/export
* WAV import/export
* Menu graphics reconstruction
* Text relocation and pointer updates
* Map writing
* Project export/import
* Complete package export/import
* Font round-trips
* World palette verification
* IPS and IPS32 patch generation
* All five interface languages

The modded ROM should always be tested in an emulator before use on real hardware. Real-hardware behavior has not been tested.

## Known Bugs

* 116 sprites do not have a clearly identifiable palette.
* Character-code-to-glyph mapping is implemented in program code rather than stored in a ROM table.
* Some ROM regions contain geometry/pointer data rather than graphics.
* Object and zone lists cannot be extended with additional entries.
* Numeric mission-record fields are not fully documented.
* The 3D-like building/block model system is currently accessible only through the Hex Editor.
* Some interface translations may still contain German text or non-native phrasing.
* Menu graphics may change tile order during import, making byte-for-byte comparison with the original unsuitable.

## Important

**GTA Advance Studio does not include or distribute the original GTA Advance ROM.**

Use your own legally obtained copy of the game. The original ROM is never modified in memory; changes are written only when saving a project or creating a new ROM.


or replace this section with the license terms applicable to the project.

---

**GTA Advance Studio** — browser-based modding tools for
