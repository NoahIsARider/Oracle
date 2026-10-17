# Oracle

**A turn-based tarot board game about fate, will, and the cost of choosing.**

Oracle is a small complete game. You draw a Fate card, pick two companions, and walk them through three acts of Greek tragedy. Every act ends with a question the gods will not answer for you.

<img src="docs/screens/title.png" alt="Oracle title screen" width="100%">

## Download

Windows portable build, no installer.

[**Oracle-Windows.zip (v1.0.0)**](https://github.com/NoahIsARider/Oracle/releases/latest) — unpack, run `Oracle.exe`.

The same game runs in a browser through the Vite dev server. See [Running it](#running-it).

## How a reading works

<img src="docs/screens/card-draft.png" alt="Card draft" width="100%">

You turn three cards from a six card spread. The first is your **Fate**, it cannot be changed. The other two become your companions on the board. Every card belongs to one mythic character, and that character has one power.

<img src="docs/screens/battle-act1.png" alt="Act I board at the gates of Thebes" width="100%">

Each round gives you two actions. You can play a card, move an ally to an adjacent cell, or both. Every card requires its own named ally to be within range, so the board is as much about positioning as it is about damage.

| Resource | Meaning |
| --- | --- |
| **Will** | The shared life of the whole party. It starts at 14. You do not have per-hero health bars, you protect one number. |
| **Thread** | The expensive currency. Some cards spend it for their strong effect. |
| **Favor** | Earned by reading your enemies well. |
| **Burden** | What the story costs you. Rescues and reckless plays add it. |

<img src="docs/screens/battle-targeting.png" alt="Selecting a foe and playing a card" width="100%">

The foe draws one **Oracle card** for the entire act. Its portrait and power stay pinned above the board, so wrath, aegis, healing or foresight is visible from the first round. Foes mark one ally and advance toward that ally. When a foe is adjacent, it strikes and drains Will by the number printed beside its portrait. Move the marked ally away and the foe has to spend its turn walking.

<img src="docs/screens/battle-midfight.png" alt="Mid fight, Will running low" width="100%">

When Will reaches zero, Thread saves you first, then Favor. Every rescue adds Burden, so survival is never free.

## Three acts, three boards

| Act | Place | Question |
| --- | --- | --- |
| I | [Thebes, Eastern Gate](docs/screens/battle-act1.png) | What shall the city remember? |
| II | [Corinth, the Bridal Hall](docs/screens/battle-act2.png) | What will you offer Medea? |
| III | [Delphi, the Inner Sanctuary](docs/screens/battle-act3.png) | How will you answer the Fates? |

<img src="docs/screens/battle-act2.png" alt="Act II, the bridal hall at Corinth" width="100%">

Each act ends with a story choice that changes your standing in the next one, and between acts a new character card surfaces and joins the circle. The choices compound. A first reading and a third reading do not end in the same place.

<img src="docs/screens/story-choice.png" alt="Story choice after Act I" width="100%">

<img src="docs/screens/final-choice.png" alt="Final choice at Delphi" width="100%">

<img src="docs/screens/ending.png" alt="Epilogue screen" width="100%">

The epilogue keeps a ledger of what you rewrote, what you accepted, how much Favor you won and how much Burden you carried out of the sanctuary.

## The deck

Twenty five character cards, drawn from epic and tragedy rather than from a generic fantasy cast. Gods who govern things, and mortals who were governed by them.

<img src="docs/screens/deck.png" alt="The complete card archive" width="100%">

<img src="docs/screens/card-detail.png" alt="Card detail view" width="100%">

Open the archive from the title screen, the pause menu or the epilogue and read every card in the deck.

## Running it

Requires Node 20 or newer and pnpm.

```bash
pnpm install
pnpm dev            # browser build at http://127.0.0.1:5173
pnpm electron:dev   # same game inside an Electron window
pnpm build          # type check and bundle to dist/
pnpm package:win    # portable Windows build into release/
```

The game keeps its own save in `localStorage`, so a run survives a reload and the title screen offers **Continue the Thread**.

## How it is built

- **React 19 + TypeScript**, no game engine and no canvas. The board is CSS grid, the cards are images, the state machine is plain functions in `src/game.ts`.
- **Vite 6** for the dev server and the bundle.
- **Electron 36** with context isolation and sandboxing for the portable desktop build.
- Self hosted fonts through Fontsource, so the app makes no network requests at runtime.

```
src/
  data.ts       25 character cards and the three act scripts
  game.ts       the whole rules engine as pure state transitions
  App.tsx       every screen: title, draft, board, archive, epilogue
  styles.css    the manuscript look, all of it
public/
  cards/        the illustrated deck and the card back
  enemies/      act enemies
  backgrounds/  three painted boards and the title poster
  icons/        Will, Thread, Favor, Burden
electron/       main and preload for the portable build
scripts/        art pipeline that crops the generated sheets into single cards
assets/         source sheets, frames, character plates and design studies
docs/screens/   screenshots used in this README
```

## Art pipeline

The illustrations were generated as Mucha style cast sheets, then cut into single cards by `scripts/build_oracle_cards.py`. The script crops the grid, keeps the parchment edge, sets the card size to 512 by 1152 and writes `assets/cards/card-manifest.json`, which the app and the archive both read. Regenerated crops land in `assets/cards/variants/` and are not tracked.

## License

Code is MIT. The card illustrations, background paintings and other artwork are not covered by that license and are not licensed for reuse. See [LICENSE](LICENSE).
