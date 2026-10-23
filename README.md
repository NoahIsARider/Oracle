# Oracle

**A turn-based tarot board game about fate, will, and the cost of choosing.**

Oracle is a small complete game. You draw a Fate card, pick two companions, and walk them through four acts of Greek tragedy. Every act ends with a question the gods will not answer for you.

<img src="docs/screens/title.png" alt="Oracle title screen" width="100%">

## Download

[**Oracle 2.1.0 for Windows**](https://github.com/NoahIsARider/Oracle/releases/latest) is one portable executable. Download it, run it, keep it anywhere. No installer and no account.

The same game runs in a browser through the Vite dev server. See [Running it](#running-it).

## What 2.1 adds

- **A second cast of twenty four.** The deck grows from twenty five cards to forty nine, drawn from the house below and the roads above it: the night's household, the dead who owe a debt, the maze and the strait, and the strange circle that keeps its own counsel.
- **Four new sheets in the same hand.** Zagreus to Echo were painted as cast sheets beside the originals, so the frame, the arch and the name plate still match the first deck card for card.
- **Bind and rewrite spreads wider.** Four new delay cards and two new Thread cards let a reading lean on control instead of damage.

<img src="docs/screens/deck-new-cast.png" alt="The archive at the join between the first cast and the second" width="100%">

The archive at the join between the two casts. The new names sit on the same frame, the same arch and the same cartouche as the first twenty five.

## What 2.0 adds

- **A fourth act.** The Labyrinth's Echo takes the run to Knossos, under the bronze maze, where the Minotaur guards what the court buried. Four acts now, each with its own board, enemies and story choice.
- **Ask the Oracle.** A three card reading outside the run. Hold one question, draw the past, the present and the possible, and read the answer across all three.
- **The minor arcana.** Six illustrated signs of the everyday join the archive and the oracle deck.
- **Rare rooms and rare skins.** Some runs open in a room that does not belong to the act, and some characters arrive in a skin from another century.

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

The pause menu keeps the run between turns, and the full rules sit one key away from the board.

| Pause | Rules |
| --- | --- |
| <img src="docs/screens/pause.png" alt="Pause menu" width="100%"> | <img src="docs/screens/rules.png" alt="Rules modal" width="100%"> |

## Four acts, four boards

| Act | Place | Question |
| --- | --- | --- |
| I | [Thebes, Eastern Gate](docs/screens/battle-act1.png) | What shall the city remember? |
| II | [Corinth, the Bridal Hall](docs/screens/battle-act2.png) | What will you offer Medea? |
| III | [Knossos, the Bronze Maze](docs/screens/battle-act3.png) | What name will you give the monster? |
| IV | [Delphi, the Inner Sanctuary](docs/screens/battle-act4.png) | How will you answer the Fates? |

<img src="docs/screens/battle-act2.png" alt="Act II, the bridal hall at Corinth" width="100%">

<img src="docs/screens/battle-act3.png" alt="Act III, under the bronze maze at Knossos" width="100%">

<img src="docs/screens/battle-act4.png" alt="Act IV, the inner sanctuary at Delphi" width="100%">

Each act ends with a story choice that changes your standing in the next one, and between acts a new character card surfaces and joins the circle. The choices compound. A first reading and a fourth reading do not end in the same place.

<img src="docs/screens/choice-act3.png" alt="Naming the monster at Knossos" width="100%">

<img src="docs/screens/story-choice.png" alt="Story choice after Act I" width="100%">

<img src="docs/screens/recruit.png" alt="Recruiting a new card between acts" width="100%">

<img src="docs/screens/final-choice.png" alt="Final choice at Delphi" width="100%">

<img src="docs/screens/ending.png" alt="Epilogue screen" width="100%">

The epilogue keeps a ledger of what you rewrote, what you accepted, how much Favor you won and how much Burden you carried out of the sanctuary.

## Ask the Oracle

<img src="docs/screens/fortune-reading.png" alt="A three card reading at the oracle" width="100%">

A reading that never touches your run. Hold one question in mind, draw three cards from the whole deck, major and minor, and get the past, the present and the possible. A card can arrive reversed, and a reversed card answers with its other voice.

## The deck

Forty nine character cards, drawn from epic and tragedy rather than from a generic fantasy cast, plus six minor arcana signs. Gods who govern things, mortals who were governed by them, and the small cards that speak for the everyday.

<img src="docs/screens/deck.png" alt="The complete card archive" width="100%">

<img src="docs/screens/card-detail.png" alt="Card detail view" width="100%">

Open the archive from the title screen, the pause menu or the epilogue and read every card in the deck.

## Rare runs

<img src="docs/screens/rare-cyber-arcade.png" alt="A rare room, Athens lit by a later century" width="100%">

A run can open in a room that does not belong to its act, and a character can arrive in a skin from another century. Both are rolled once when the reading begins, so a rare run stays rare for all four acts.

## Running it

Requires Node 20 or newer and pnpm.

```bash
pnpm install
pnpm dev            # browser build at http://127.0.0.1:5173
pnpm electron:dev   # same game inside an Electron window
pnpm build          # type check and bundle to dist/
pnpm package:win    # portable Windows build into release/
```

The game keeps its own save in `localStorage`, so a run survives a reload and the title screen offers **Continue the Thread**. A reading at the oracle is not part of a run and never overwrites that save.

## How it is built

- **React 19 + TypeScript**, no game engine and no canvas. The board is CSS grid, the cards are images, the state machine is plain functions in `src/game.ts`.
- **Vite 6** for the dev server and the bundle.
- **Electron 36** with context isolation and sandboxing for the portable desktop build.
- Self hosted fonts through Fontsource, so the app makes no network requests at runtime.

```
src/
  data.ts       49 character cards, 6 minor arcana, four act scripts
  game.ts       the whole rules engine as pure state transitions
  App.tsx       every screen: title, oracle reading, draft, board, archive, epilogue
  styles.css    the manuscript look, all of it
public/
  cards/        the illustrated deck and the card back
  minor/        the six minor arcana cards
  skins/        rare character skins
  enemies/      act enemies, including the Knossos set
  backgrounds/  four painted boards, the title poster and the rare rooms
  icons/        Will, Thread, Favor, Burden
electron/       main and preload for the portable build
scripts/        art pipeline that crops generated sheets into single cards
assets/         source sheets, frames, character plates and design studies
docs/screens/   screenshots used in this README
```

## Art pipeline

The illustrations were generated as Mucha style cast sheets, then cut into single cards by `scripts/build_oracle_cards.py`. The script crops the grid, keeps the parchment edge, sets the card size to 512 by 1152 and writes `assets/cards/card-manifest.json`, which the app and the archive both read. `scripts/import_generated_assets.py` does the same work for the newer sets, the minor arcana, the rare skins and the Knossos enemies. The second cast is cut by `scripts/import_expansion_cards.py`, which reads the card list from `assets/cards/expansion-cast.json`, finds the card edges in each new sheet and prints the names in Georgia. Regenerated crops land in `assets/cards/variants/` and are not tracked.

## License

Code is MIT. The card illustrations, background paintings and other artwork are not covered by that license and are not licensed for reuse. See [LICENSE](LICENSE).
