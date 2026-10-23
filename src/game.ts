import { cardById, cards, chapters, type RoleCard } from './data';

export type Screen = 'title' | 'reading' | 'scene' | 'battle' | 'choice' | 'recruit' | 'ending' | 'archive' | 'fortune';
export type DraftStep = 'destiny' | 'companions';

export interface BoardEnemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  cell: number;
  intent: string;
  stunned: boolean;
  exposed: boolean;
  ward: number;
  targetAlly?: string | null;
}

export interface BoardAlly {
  id: string;
  cell: number;
}

export interface GameState {
  version: number;
  screen: Screen;
  chapter: number;
  spread: string[];
  revealed: string[];
  enemyOracle: string | null;
  draftStep: DraftStep;
  destiny: string | null;
  chosen: string[];
  collection: string[];
  recruitOptions: string[];
  enemies: BoardEnemy[];
  allies: BoardAlly[];
  hand: string[];
  drawPile: string[];
  discard: string[];
  selectedCard: string | null;
  selectedTarget: string | null;
  selectedAlly: string | null;
  moveMode: boolean;
  turn: number;
  actions: number;
  will: number;
  maxWill: number;
  ward: number;
  thread: number;
  favor: number;
  burden: number;
  rewrites: number;
  acceptances: number;
  compassion: number;
  trust: number;
  log: string[];
  endingTitle: string;
  endingText: string;
  rareBackground: string | null;
  rareSkins: Record<string, string>;
}

const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export function cellDistance(a: number, b: number): number {
  return Math.abs(Math.floor(a / 5) - Math.floor(b / 5)) + Math.abs((a % 5) - (b % 5));
}

function nearestAlly(cell: number, allies: BoardAlly[]): BoardAlly | undefined {
  return [...allies].sort((a, b) => cellDistance(cell, a.cell) - cellDistance(cell, b.cell))[0];
}

export function createNewGame(): GameState {
  const rareRoll = Math.random();
  return {
    version: 2,
    screen: 'reading', chapter: 0, spread: shuffled(cards.map((card) => card.id)).slice(0, 6), revealed: [],
    enemyOracle: shuffled(cards.map((card) => card.id))[0],
    draftStep: 'destiny', destiny: null, chosen: [], collection: [], recruitOptions: [],
    enemies: [], allies: [], hand: [], drawPile: [], discard: [], selectedCard: null,
    selectedTarget: null, selectedAlly: null, moveMode: false, turn: 1, actions: 2,
    will: 14, maxWill: 14, ward: 0, thread: 2, favor: 0, burden: 0,
    rewrites: 0, acceptances: 0, compassion: 0, trust: 0,
    log: ['The cards wait beneath the Delphic moon.'], endingTitle: '', endingText: '',
    rareBackground: rareRoll < 0.035 ? 'rare-cyber-arcade.png' : rareRoll < 0.07 ? 'rare-ash-sanctuary.png' : null,
    rareSkins: {},
  };
}

function drawIntoHand(state: GameState, count = 4): GameState {
  const next = { ...state, hand: [...state.hand], drawPile: [...state.drawPile], discard: [...state.discard] };
  let guard = 0;
  while (next.hand.length < count && guard < 40) {
    guard += 1;
    if (next.drawPile.length === 0) {
      if (next.discard.length === 0) break;
      next.drawPile = shuffled(next.discard);
      next.discard = [];
    }
    const id = next.drawPile.pop();
    if (id && !next.hand.includes(id)) next.hand.push(id);
  }
  return next;
}

export function beginReadingCircle(state: GameState): GameState {
  if (state.chosen.length !== 3 || !state.destiny) return state;
  const collection = [...state.chosen];
  const rareSkins = { ...state.rareSkins };
  for (const id of collection) {
    const skin = rareSkinFor(id);
    if (skin) rareSkins[id] = skin;
  }
  return beginChapter({ ...state, collection, rareSkins }, 0, 'The reading binds three lives to yours. Their names will change the shape of the board.');
}

function rareSkinFor(id: string): string | null {
  if (Math.random() > 0.06) return null;
  const skin: Record<string, string> = {
    apollo: 'apollo-cyberpunk.png', athena: 'athena-wasteland.png', hades: 'hades-cyberpunk.png',
    medea: 'medea-wasteland.png', hermes: 'hermes-cyberpunk.png', cassandra: 'cassandra-wasteland.png',
  };
  return skin[id] ?? null;
}

function beginChapter(state: GameState, chapterIndex: number, message: string): GameState {
  const script = chapters[chapterIndex];
  const omen = oracleEffect(state.enemyOracle);
  const allies: BoardAlly[] = state.collection.slice(0, 5).map((id, index) => ({
    id, cell: [15, 16, 17, 18, 19][index],
  }));
  const enemies: BoardEnemy[] = script.enemies.map((enemy) => ({
    ...enemy, maxHp: enemy.hp, stunned: false, exposed: false, ward: omen.kind === 'aegis' ? 2 : 0,
    targetAlly: nearestAlly(enemy.cell, allies)?.id ?? null,
  }));
  const next: GameState = {
    ...state, screen: 'scene', chapter: chapterIndex, enemies, allies,
    hand: [], drawPile: shuffled(state.collection), discard: [],
    selectedCard: null, selectedTarget: null, selectedAlly: null, moveMode: false,
    turn: 1, actions: 2, ward: 0,
    log: [message, script.opening],
  };
  return drawIntoHand(next);
}

export function enterBoard(state: GameState): GameState {
  return state.screen === 'scene' ? { ...state, screen: 'battle', log: [] } : state;
}

export function chooseReadingCard(state: GameState, id: string): GameState {
  if (!state.spread.includes(id)) return state;
  if ((state.revealed ?? []).includes(id) || (state.draftStep === 'companions' && state.chosen.includes(id))) return state;
  if (state.draftStep === 'destiny') {
    return { ...state, destiny: id, chosen: [id], draftStep: 'companions', revealed: [...(state.revealed ?? []), id] };
  }
  if (id === state.destiny || state.chosen.length >= 3) return state;
  return { ...state, chosen: [...state.chosen, id], revealed: [...(state.revealed ?? []), id] };
}

export function oracleEffect(cardId: string | null): { title: string; description: string; kind: 'wrath' | 'aegis' | 'renewal' | 'doom' | 'foresight' | 'binding' } {
  const card = cardId ? cardById(cardId) : cardById('ares');
  switch (card.effect) {
    case 'strike': return { title: 'Wrath', description: 'Foe strikes deal +1 Will damage.', kind: 'wrath' };
    case 'ward': return { title: 'Aegis', description: 'Foes begin with 2 Ward and restore 1 each round.', kind: 'aegis' };
    case 'mend': return { title: 'Renewal', description: 'Each surviving foe restores 2 HP after acting.', kind: 'renewal' };
    case 'rewrite': return { title: 'Doom', description: 'From round 3 on, foe strikes deal +2 Will damage.', kind: 'doom' };
    case 'insight': return { title: 'Foresight', description: 'Foes advance up to 2 spaces each turn.', kind: 'foresight' };
    case 'bind': return { title: 'Binding', description: 'Each foe strike adds 1 Burden.', kind: 'binding' };
  }
}

export function selectHandCard(state: GameState, id: string): GameState {
  if (!state.hand.includes(id)) return state;
  return { ...state, selectedCard: state.selectedCard === id ? null : id, moveMode: false };
}

export function cardRange(card: RoleCard): number {
  if (card.effect === 'strike') return 2;
  if (card.effect === 'bind' || card.effect === 'rewrite') return 3;
  return 4;
}

export function cardNeedsTarget(card: RoleCard): boolean {
  return card.effect === 'strike' || card.effect === 'bind' || card.effect === 'rewrite'
    || card.id === 'oedipus' || card.id === 'electra';
}

export function selectBoardCell(state: GameState, cell: number): GameState {
  const ally = state.allies.find((item) => item.cell === cell);
  if (ally) return { ...state, selectedAlly: ally.id, moveMode: true, selectedTarget: null };
  const enemy = state.enemies.find((item) => item.cell === cell && item.hp > 0);
  if (enemy) return { ...state, selectedTarget: enemy.id, selectedAlly: null, moveMode: false };
  if (!state.moveMode || !state.selectedAlly || state.actions < 1) return state;
  const mover = state.allies.find((item) => item.id === state.selectedAlly);
  if (!mover) return state;
  const fromRow = Math.floor(mover.cell / 5);
  const fromCol = mover.cell % 5;
  const toRow = Math.floor(cell / 5);
  const toCol = cell % 5;
  const occupied = [...state.allies.map((item) => item.cell), ...state.enemies.filter((item) => item.hp > 0).map((item) => item.cell)];
  if (Math.abs(fromRow - toRow) + Math.abs(fromCol - toCol) !== 1 || occupied.includes(cell)) return state;
  return {
    ...state,
    allies: state.allies.map((item) => item.id === mover.id ? { ...item, cell } : item),
    actions: state.actions - 1, selectedAlly: null, moveMode: false,
    log: [`${cardById(mover.id).name} takes a careful step.`, ...state.log].slice(0, 5),
  };
}

function closeEncounterIfWon(state: GameState): GameState {
  if (state.enemies.some((enemy) => enemy.hp > 0)) return state;
  const chapter = chapters[state.chapter];
  return {
    ...state, screen: 'choice', selectedCard: null, selectedTarget: null,
    log: [`The field falls silent. ${chapter.title} is yours to answer.`, ...state.log].slice(0, 5),
  };
}

export function playSelectedCard(state: GameState): GameState {
  if (!state.selectedCard || state.actions < 1 || !state.hand.includes(state.selectedCard)) return state;
  const card: RoleCard = cardById(state.selectedCard);
  const enemies = state.enemies.map((enemy) => ({ ...enemy }));
  const live = enemies.filter((enemy) => enemy.hp > 0);
  const actor = state.allies.find((ally) => ally.id === card.id);
  const range = cardRange(card);
  const inRange = actor ? live.filter((enemy) => cellDistance(actor.cell, enemy.cell) <= range) : [];
  const selectedEnemy = live.find((enemy) => enemy.id === state.selectedTarget);
  const supportAttack = Boolean(selectedEnemy && !cardNeedsTarget(card));
  const target = selectedEnemy ?? (cardNeedsTarget(card) ? [...inRange].sort((a, b) => a.hp - b.hp)[0] : undefined);
  if ((cardNeedsTarget(card) || supportAttack) && (!target || (selectedEnemy && !inRange.some((enemy) => enemy.id === selectedEnemy.id)))) {
    return { ...state, log: [`Move ${card.name} within ${range} spaces of a foe before using ${card.ability}.`, ...state.log].slice(0, 5) };
  }
  let will = state.will;
  let ward = state.ward;
  let thread = state.thread;
  let favor = state.favor;
  let burden = state.burden;
  let drawPile = [...state.drawPile];
  let message = `${card.name} answers the draw: ${card.ability}.`;
  let discard = [...state.discard, card.id];
  let hand = state.hand.filter((id) => id !== card.id);

  const deal = (amount: number) => {
    if (!target) return;
    const foe = enemies.find((enemy) => enemy.id === target.id)!;
    const rawDamage = amount + (foe.exposed ? 2 : 0);
    const absorbed = Math.min(foe.ward ?? 0, rawDamage);
    foe.ward = Math.max(0, (foe.ward ?? 0) - absorbed);
    foe.hp = Math.max(0, foe.hp - rawDamage + absorbed);
    if (absorbed > 0) message += ` ${foe.name}'s Oracle Ward absorbs ${absorbed}.`;
    foe.exposed = false;
    if (foe.hp === 0) {
      favor += 1;
      message += ` ${foe.name} leaves the board; Favor rises.`;
    }
  };

  switch (card.effect) {
    case 'strike':
      {
      const wasExposed = Boolean(target?.exposed);
      deal(card.power);
      if (card.id === 'electra' && !wasExposed && target && target.hp > 0) enemies.find((enemy) => enemy.id === target.id)!.exposed = true;
      }
      break;
    case 'ward':
      if (supportAttack) deal(2);
      ward += card.power;
      if (card.id === 'hera') favor += 1;
      break;
    case 'mend':
      if (supportAttack) deal(2);
      will = Math.min(state.maxWill, will + card.power);
      if (card.id === 'persephone' && discard.length > 0) {
        const recoverIndex = discard.findIndex((id) => id !== card.id);
        if (recoverIndex >= 0) {
          const [recovered] = discard.splice(recoverIndex, 1);
          hand.push(recovered);
          message += ` ${cardById(recovered).name} returns from the discard.`;
        }
      }
      if (card.id === 'demeter' || card.id === 'hestia') favor += 1;
      if (card.id === 'iphigenia' && state.will <= state.maxWill / 2) thread += 1;
      break;
    case 'rewrite':
      if (thread > 0) {
        thread -= 1;
        deal(card.power);
      } else {
        deal(3);
        burden += 1;
      }
      break;
    case 'insight':
      favor += card.power === 1 ? 1 : 0;
      if (supportAttack) deal(2);
      if (card.id === 'oedipus' || card.id === 'electra') {
        const wasExposed = Boolean(target?.exposed);
        deal(card.power);
        if (card.id === 'oedipus' && !wasExposed && target && target.hp > 0) enemies.find((enemy) => enemy.id === target.id)!.exposed = true;
        if (card.id === 'electra' && !wasExposed && target && target.hp > 0) enemies.find((enemy) => enemy.id === target.id)!.exposed = true;
      }
      if (card.id === 'odysseus') burden = Math.max(0, burden - 1);
      if (card.id === 'orpheus' && discard.length > 1) {
        const recoverIndex = discard.findIndex((id) => id !== card.id);
        if (recoverIndex >= 0) hand.push(discard.splice(recoverIndex, 1)[0]);
      }
      if (card.id === 'hermes' || card.id === 'apollo' || card.id === 'dionysus' || card.id === 'orpheus' || card.id === 'hecate' || card.id === 'ariadne') {
        const drawCount = card.id === 'hermes' ? 2 : 1;
        for (let i = 0; i < drawCount; i += 1) {
          if (drawPile.length === 0 && discard.length > 0) {
            drawPile = shuffled(discard);
            discard = [];
          }
          const drawn = drawPile.pop();
          if (drawn && !hand.includes(drawn)) hand.push(drawn);
        }
      }
      break;
    case 'bind':
      if (target) {
        deal(card.power);
        const foe = enemies.find((enemy) => enemy.id === target.id)!;
        foe.stunned = true;
      }
      break;
  }

  if (card.id === 'ares') burden += 1;
  if (card.id === 'ajax') ward += 2;
  if (card.id === 'hephaestus') will = Math.min(state.maxWill, will + 2);
  if (card.id === 'zeus' && target) {
    const chorus = enemies.find((enemy) => enemy.id === 'chorus');
    if (chorus) chorus.hp = Math.max(0, chorus.hp - 1);
  }
  if (card.id === 'penelope') ward += 1;
  if (card.id === 'cassandra' && target) enemies.find((enemy) => enemy.id === target.id)!.stunned = true;

  const next = drawIntoHand({
    ...state, enemies, will, ward, thread, favor, burden, discard, hand, drawPile,
    actions: state.actions - 1, selectedCard: null, selectedTarget: null, selectedAlly: null,
    log: [message, ...state.log].slice(0, 5),
  });
  return closeEncounterIfWon(next);
}

export function endPlayerTurn(state: GameState): GameState {
  if (state.screen !== 'battle') return state;
  let will = state.will;
  let ward = state.ward;
  let burden = state.burden;
  let thread = state.thread;
  let favor = state.favor;
  const omen = oracleEffect(state.enemyOracle);
  const enemies = state.enemies.map((enemy) => ({ ...enemy }));
  const events: string[] = [];
  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;
    if (enemy.stunned) {
      enemy.stunned = false;
      events.push(`${enemy.name} falters under the omen.`);
      continue;
    }
    const target = state.allies.find((ally) => ally.id === enemy.targetAlly) ?? nearestAlly(enemy.cell, state.allies);
    if (target && cellDistance(enemy.cell, target.cell) > 1) {
      const stride = omen.kind === 'foresight' ? 2 : 1;
      let moved = 0;
      for (let step = 0; step < stride && cellDistance(enemy.cell, target.cell) > 1; step += 1) {
        const row = Math.floor(enemy.cell / 5);
        const col = enemy.cell % 5;
        const occupied = new Set([
          ...state.allies.map((ally) => ally.cell),
          ...enemies.filter((other) => other.hp > 0 && other.id !== enemy.id).map((other) => other.cell),
        ]);
        const approach = [enemy.cell - 5, enemy.cell + 5, enemy.cell - 1, enemy.cell + 1]
          .filter((cell) => cell >= 0 && cell < 20)
          .filter((cell) => {
            const nextRow = Math.floor(cell / 5);
            const nextCol = cell % 5;
            return Math.abs(nextRow - row) + Math.abs(nextCol - col) === 1 && !occupied.has(cell);
          })
          .sort((a, b) => cellDistance(a, target.cell) - cellDistance(b, target.cell))[0];
        if (approach === undefined || cellDistance(approach, target.cell) >= cellDistance(enemy.cell, target.cell)) break;
        enemy.cell = approach;
        moved += 1;
      }
      events.push(moved > 0 ? `${enemy.name} advances ${moved > 1 ? 'swiftly ' : ''}toward ${cardById(target.id).name}.` : `${enemy.name} cannot reach its mark.`);
      continue;
    }
    const damage = enemy.damage + (omen.kind === 'wrath' ? 1 : 0) + (omen.kind === 'doom' && state.turn >= 3 ? 2 : 0);
    const absorbed = Math.min(ward, damage);
    ward -= absorbed;
    const loss = damage - absorbed;
    will -= loss;
    if (loss > 0 && omen.kind === 'binding') {
      burden += 1;
      events.push('The Binding omen adds 1 Burden.');
    }
    events.push(loss > 0 ? `${enemy.name} presses the omen. ${loss} Will is lost.` : `${enemy.name}'s blow breaks against your ward.`);
  }
  if (omen.kind === 'renewal') {
    for (const enemy of enemies) {
      if (enemy.hp <= 0 || enemy.hp >= enemy.maxHp) continue;
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + 2);
      events.push(`${enemy.name} regains 2 HP beneath Renewal.`);
    }
  }
  if (omen.kind === 'aegis') {
    for (const enemy of enemies) if (enemy.hp > 0) enemy.ward = Math.min(2, (enemy.ward ?? 0) + 1);
  }
  if (will <= 0 && thread <= 0 && favor <= 0) {
    return {
      ...state, enemies, will: 0, ward, burden: burden + 1,
      screen: 'ending', endingTitle: 'The Thread Breaks',
      endingText: 'The final blow falls before the cards can answer. Your companions carry the story back to the sanctuary, where another reading may begin.',
      log: ['Your Will is spent. The reading ends here.', ...events, ...state.log].slice(0, 5),
    };
  }
  if (will <= 0) {
    if (thread > 0) {
      thread -= 1;
      will = 5;
      burden += 1;
      events.unshift('A thread catches your falling name. One Thread is spent; Burden rises.');
    } else if (favor > 0) {
      favor -= 1;
      will = 4;
      burden += 1;
      events.unshift('A god answers once. One Favor is spent; Burden rises.');
    }
  }
  const round = state.turn + 1;
  if (round > 5) {
    burden += 1;
    events.unshift('The omen grows heavier as the scene lengthens.');
  }
  const nextEnemies = enemies.map((enemy) => enemy.hp > 0
    ? { ...enemy, targetAlly: state.allies.some((ally) => ally.id === enemy.targetAlly) ? enemy.targetAlly : nearestAlly(enemy.cell, state.allies)?.id ?? null }
    : enemy);
  const next = drawIntoHand({
    ...state, enemies: nextEnemies, will, ward, burden, thread, favor,
    turn: round, actions: 2, selectedTarget: null, selectedAlly: null, moveMode: false,
    log: [...events, ...state.log].slice(0, 5),
  });
  return closeEncounterIfWon(next);
}

export function resolveStoryChoice(state: GameState, choice: 'mercy' | 'defiance' | 'reckoning' | 'rewrite' | 'accept'): GameState {
  let next = { ...state };
  if (choice === 'mercy') {
    next = { ...next, compassion: next.compassion + 1, favor: next.favor + 1, burden: Math.max(0, next.burden - 1) };
  } else if (choice === 'defiance') {
    next = { ...next, rewrites: next.rewrites + 1, trust: next.trust + 1, thread: next.thread + 1 };
  } else if (choice === 'reckoning') {
    next = { ...next, rewrites: next.rewrites + 1, burden: next.burden + 1, trust: next.trust + 1 };
  } else if (choice === 'rewrite') {
    next = { ...next, rewrites: next.rewrites + 2, thread: Math.max(0, next.thread - 1), burden: next.burden + 1 };
  } else {
    next = { ...next, acceptances: next.acceptances + 2, favor: next.favor + 2 };
  }

  if (state.chapter === chapters.length - 1) {
    const ending = chooseEnding(next);
    return { ...next, screen: 'ending', endingTitle: ending.title, endingText: ending.text, log: [ending.title, ...next.log].slice(0, 5) };
  }
  const available = cards.map((card) => card.id).filter((id) => !next.collection.includes(id));
  return {
    ...next, screen: 'recruit', recruitOptions: shuffled(available).slice(0, 3),
    will: Math.min(next.maxWill, next.will + 3), ward: 0,
    log: ['A new card turns toward you in the quiet between acts.', ...next.log].slice(0, 5),
  };
}

export function recruitCard(state: GameState, id: string): GameState {
  if (state.screen !== 'recruit' || !state.recruitOptions.includes(id)) return state;
  const collection = [...state.collection, id];
  const skin = rareSkinFor(id);
  const rareSkins = skin ? { ...state.rareSkins, [id]: skin } : state.rareSkins;
  const nextChapter = state.chapter + 1;
  return beginChapter({ ...state, collection, rareSkins, recruitOptions: [] }, nextChapter, `${cardById(id).name} joins your reading. The next scene takes shape.`);
}

function chooseEnding(state: GameState): { title: string; text: string } {
  if (state.rewrites >= 3 && state.burden < 6) {
    return {
      title: 'The Dawn Without a Script',
      text: 'You cut a path through the woven ending. The Fates do not vanish; they loosen their hands. At daybreak, Antigone walks home beside Medea, and the city begins a story no oracle has named.',
    };
  }
  if (state.compassion >= 2) {
    return {
      title: 'The Chorus Unbound',
      text: 'The voices that once watched in silence step down from the stone. No single hero carries the whole future. The city grieves together, and its grief becomes a promise made in many voices.',
    };
  }
  if (state.acceptances >= 2 || state.favor >= 4) {
    return {
      title: 'The Quiet Return',
      text: 'You do not break the thread. You choose what to carry along it. Persephone rises with spring in her hands, and the names of the dead are spoken without being used as a sentence for the living.',
    };
  }
  return {
    title: 'The Red Loom',
    text: 'Atropos closes the shears, but your reading has changed the pattern. The old tragedy ends; its echo remains in the cards, waiting for another witness to decide what comes after.',
  };
}

export function returnToTitle(): GameState {
  return {
    ...createNewGame(), screen: 'title', spread: [], chosen: [], collection: [],
    destiny: null, hand: [], drawPile: [], discard: [], enemies: [], allies: [], log: [],
  };
}

export function cardImage(id: string): string {
  return `./cards/${id}.png`;
}

export function characterImage(id: string, rareSkins: Record<string, string> = {}): string {
  return rareSkins[id] ? `./skins/${rareSkins[id]}` : cardImage(id);
}

export function cardName(id: string): string {
  return cardById(id)?.name ?? id;
}

