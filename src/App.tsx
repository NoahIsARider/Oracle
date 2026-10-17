import { useEffect, useMemo, useState } from 'react';
import { cards, chapters, cardById, type RoleCard } from './data';
import {
  beginReadingCircle, cardImage, cardNeedsTarget, cardRange, cellDistance, chooseReadingCard, createNewGame, endPlayerTurn, enterBoard, oracleEffect,
  playSelectedCard, recruitCard, resolveStoryChoice, returnToTitle, selectBoardCell,
  selectHandCard, type GameState,
} from './game';

const SAVE_KEY = 'oracle.the-thread-of-thebes.save.v1';
const publicAsset = (path: string) => `./${path}`;
const loadSaved = (): GameState | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) as GameState : null;
  } catch {
    return null;
  }
};

function App() {
  const [game, setGame] = useState<GameState>(() => returnToTitle());
  const [hasSave, setHasSave] = useState(() => Boolean(loadSaved()));
  const [paused, setPaused] = useState(false);
  const [archiveReturn, setArchiveReturn] = useState<'title' | 'pause' | 'battle'>('title');
  const [archiveCard, setArchiveCard] = useState<RoleCard | null>(null);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (game.screen === 'title' && game.collection.length === 0) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    setHasSave(true);
  }, [game]);

  const chapter = chapters[Math.min(game.chapter, chapters.length - 1)];
  const backdropPath = game.screen === 'title'
    ? 'backgrounds/oracle-title-poster-mucha.png'
    : `backgrounds/${['thebes-gate-board.png', 'corinth-board.png', 'delphi-inner-board.png'][Math.min(game.chapter, 2)]}`;
  const enemyOracle = game.enemyOracle ? cardById(game.enemyOracle) : null;
  const oracle = oracleEffect(game.enemyOracle);
  const willWasHit = game.log.slice(0, 3).some((entry) => entry.includes('Will is lost'));
  const selectedCard = game.selectedCard ? cardById(game.selectedCard) : null;
  const selectedTarget = game.enemies.find((enemy) => enemy.id === game.selectedTarget && enemy.hp > 0);
  const selectedActor = selectedCard ? game.allies.find((ally) => ally.id === selectedCard.id) : undefined;
  const reachableEnemies = selectedCard && selectedActor
    ? game.enemies.filter((enemy) => enemy.hp > 0 && cellDistance(selectedActor.cell, enemy.cell) <= cardRange(selectedCard))
    : [];
  const selectedCardOutOfRange = Boolean(selectedCard && (cardNeedsTarget(selectedCard) || selectedTarget)
    && (selectedTarget ? !reachableEnemies.some((enemy) => enemy.id === selectedTarget.id) : reachableEnemies.length === 0));
  const canMoveTo = (cell: number) => {
    const mover = game.allies.find((ally) => ally.id === game.selectedAlly);
    if (!mover || game.actions < 1) return false;
    const occupied = [...game.allies.map((ally) => ally.cell), ...game.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => enemy.cell)];
    return !occupied.includes(cell) && cellDistance(mover.cell, cell) === 1;
  };
  const enemyTargetId = (enemy: GameState['enemies'][number]) => enemy.targetAlly
    ?? [...game.allies].sort((a, b) => {
        const da = Math.abs(Math.floor(enemy.cell / 5) - Math.floor(a.cell / 5)) + Math.abs((enemy.cell % 5) - (a.cell % 5));
        const db = Math.abs(Math.floor(enemy.cell / 5) - Math.floor(b.cell / 5)) + Math.abs((enemy.cell % 5) - (b.cell % 5));
        return da - db;
      })[0]?.id;
  const enemyWillStrike = (enemy: GameState['enemies'][number]) => {
    if (enemy.stunned) return false;
    const target = game.allies.find((ally) => ally.id === enemyTargetId(enemy));
    if (!target || enemy.stunned) return false;
    const distance = Math.abs(Math.floor(enemy.cell / 5) - Math.floor(target.cell / 5)) + Math.abs((enemy.cell % 5) - (target.cell % 5));
    return distance <= 1;
  };
  const enemyIntent = (enemy: GameState['enemies'][number]) => enemy.stunned
    ? 'DELAYED'
    : enemyWillStrike(enemy) ? `STRIKE −${enemy.damage + (oracle.kind === 'wrath' ? 1 : 0) + (oracle.kind === 'doom' && game.turn >= 3 ? 2 : 0)} WILL` : oracle.kind === 'foresight' ? 'ADVANCE ×2' : 'ADVANCE';

  const update = (fn: (state: GameState) => GameState) => setGame((state) => fn(state));
  const begin = () => { setPaused(false); setGame(createNewGame()); };
  const continueJourney = () => { const save = loadSaved(); if (save) setGame(save); };
  const openArchive = (from: 'title' | 'pause' | 'battle') => {
    setArchiveReturn(from);
    if (from === 'pause') setPaused(false);
    setArchiveCard(null);
    setGame((state) => ({ ...state, screen: 'archive' }));
  };
  const closeArchive = () => {
    setGame((state) => ({ ...state, screen: archiveReturn === 'battle' || archiveReturn === 'pause' ? 'battle' : 'title' }));
    if (archiveReturn === 'pause') setPaused(true);
  };
  const storyChoices = chapter.choices;
  const chosenCardNames = useMemo(() => game.chosen.map((id) => cardById(id).name), [game.chosen]);

  return (
    <div className={`game-root screen-${game.screen} chapter-${game.chapter}`}>
      <div className="world-backdrop" style={{ backgroundImage: `url("${publicAsset(backdropPath)}")` }} />
      <div className="world-vignette" />

      {game.screen === 'title' && (
        <section className="title-screen">
          <div className="title-copy">
            <div className="title-mark" aria-hidden="true">✦</div>
            <h1>ORACLE</h1>
            <p className="title-subtitle">The Thread of Thebes</p>
            <div className="title-actions">
              <button className="primary-action" onClick={begin}><span>Enter the Sanctuary</span><b>↗</b></button>
              {hasSave && <button className="quiet-action" onClick={continueJourney}>Continue the Thread <span>→</span></button>}
              <button className="quiet-action" onClick={() => openArchive('title')}>The Card Archive <span>⌘</span></button>
            </div>
          </div>
        </section>
      )}

      {game.screen === 'reading' && (
        <section className="reading-screen">
          <div className="screen-kicker">The Delphic Sanctuary</div>
          <h1>{game.draftStep === 'destiny' ? 'Choose Your Fate' : 'Choose Two Companions'}</h1>
          <p className="screen-intro">
            {game.draftStep === 'destiny'
              ? 'Turn one card to reveal the Fate you will carry. It cannot be changed.'
              : <>Your Fate is <strong>{game.destiny ? cardById(game.destiny).name : ''}</strong>. Turn two more cards; each choice is final.</>}
          </p>
          <div className="spread-grid">
            {game.spread.map((id) => {
              const card = cardById(id);
              const isChosen = game.chosen.includes(id);
              const isFate = game.destiny === id;
              const isRevealed = (game.revealed ?? []).includes(id) || game.chosen.includes(id);
              return (
                <button key={id} className={`spread-card ${isChosen ? 'is-chosen' : ''} ${isFate ? 'is-fate' : ''} ${!isRevealed ? 'is-veiled' : ''} ${isRevealed ? 'locked-card' : ''}`} disabled={isRevealed || game.chosen.length === 3} onClick={() => update((state) => chooseReadingCard(state, id))} aria-label={isRevealed ? `${card.name}, ${card.epithet}, chosen` : 'Turn over a tarot card'}>
                  <img src={isRevealed ? cardImage(id) : publicAsset('cards/oracle-thread-card-back.png')} alt={isRevealed ? `${card.name}, ${card.epithet}` : 'Face-down tarot card'} />
                  {isFate && <span className="card-ribbon">FATE</span>}
                  {isChosen && !isFate && <span className="card-ribbon">ALLY</span>}
                  {isRevealed && <span className="card-hover-note">{card.fate}</span>}
                </button>
              );
            })}
          </div>
          <div className="reading-footer">
            <div className="reading-selection">{chosenCardNames.length ? chosenCardNames.join(' · ') : 'Choose your fate'}</div>
            <button className="primary-action" disabled={game.chosen.length !== 3} onClick={() => update(beginReadingCircle)}><span>Begin the Reading</span><b>→</b></button>
          </div>
        </section>
      )}

      {game.screen === 'scene' && (
        <section className="scene-interlude" role="button" tabIndex={0} aria-label="Continue to the board" onClick={() => update(enterBoard)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') update(enterBoard); }}>
          <div className="interlude-copy">
            <div className="interlude-place">{chapter.place}</div>
            <h1>{chapter.title}</h1>
            <p className="interlude-subtitle">{chapter.subtitle}</p>
            <p className="interlude-story">{chapter.opening}</p>
            <div className="interlude-objective">{chapter.objective}</div>
          </div>
        </section>
      )}

      {game.screen === 'battle' && (
        <section className="battle-screen">
          <header className="game-hud">
            <button className="pause-button" aria-label="Pause game" onClick={() => setPaused(true)}><span /><span /></button>
          </header>

          <div className="battle-main">
            <div className="board-column">
              {enemyOracle && <div className="oracle-omen"><img src={cardImage(enemyOracle.id)} alt="" /><div><small>THE FOE'S ORACLE · {oracle.title.toUpperCase()}</small><b>{enemyOracle.name}</b><span>{oracle.description}</span></div></div>}
              <div className="board-caption"><b>ROUND {game.turn}</b><i>{game.actions} ACTIONS ✦</i></div>
              <div className="board-frame">
                <div className="board-grid" role="grid" aria-label="Tactical board">
                  {Array.from({ length: 20 }, (_, cell) => {
                    const ally = game.allies.find((unit) => unit.cell === cell);
                    const enemy = game.enemies.find((unit) => unit.cell === cell && unit.hp > 0);
                    const terrain = [6, 8, 11, 13].includes(cell) ? 'terrain-stone' : '';
                    return (
                      <button key={cell} role="gridcell" className={`board-cell ${terrain} ${ally ? 'has-ally' : ''} ${enemy ? 'has-enemy' : ''} ${ally && game.selectedAlly === ally.id ? 'selected-unit' : ''} ${enemy && game.selectedTarget === enemy.id ? 'targeted' : ''} ${game.moveMode && canMoveTo(cell) ? 'move-possible' : ''}`} onClick={() => update((state) => selectBoardCell(state, cell))}>
                        {ally && <span className={`unit-token ally-token ${game.enemies.some((foe) => foe.hp > 0 && !foe.stunned && enemyTargetId(foe) === ally.id && enemyWillStrike(foe)) ? 'ally-threatened' : ''}`} title={cardById(ally.id).name}><img src={cardImage(ally.id)} alt={cardById(ally.id).name} /><b>{cardById(ally.id).name}</b>{game.enemies.some((foe) => foe.hp > 0 && !foe.stunned && enemyTargetId(foe) === ally.id) && <small>MARKED</small>}</span>}
                        {enemy && <span className={`unit-token enemy-token ${enemyWillStrike(enemy) ? 'enemy-striking' : ''}`} title={`${enemy.name}: ${enemyIntent(enemy)}. ${enemy.hp} HP${enemy.ward > 0 ? `, ${enemy.ward} Ward` : ''}. Move the marked ally to dodge.`}><img src={publicAsset(`enemies/${enemy.id}.png`)} alt={enemy.name} /><b>{enemy.name}</b><small className="enemy-intent">{enemyIntent(enemy)}</small><em className="enemy-vitals">{enemy.hp} HP{enemy.ward > 0 ? ` · ${enemy.ward} WARD` : ''}</em></span>}
                        {!ally && !enemy && <span className="cell-mark">{terrain ? '✦' : ''}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="board-hint">
                {game.actions === 0 ? 'End your turn · foes advance or strike now' : game.moveMode ? 'Choose a glowing adjacent space · costs 1 action' : selectedCardOutOfRange ? `Move ${selectedCard?.name} within ${selectedCard ? cardRange(selectedCard) : 0} spaces of a foe` : selectedTarget ? `${selectedTarget.name} · ${selectedTarget.hp} HP · play a card` : 'Choose a foe, then play a card · move its ally into range'}
              </div>
              {game.log[0] && <div className={`battle-event ${willWasHit ? 'event-damage' : ''}`} aria-live="polite">{game.log.slice(0, 3).join('  ·  ')}</div>}
            </div>

          </div>

          <footer className="card-dock">
            <div className="bottom-hud">
              <div className="resource-strip" aria-label="Fate resources">
                <div className="bottom-chapter"><small>ACT {['I', 'II', 'III'][game.chapter]}</small><b>{chapter.place}</b></div>
                <div className={`resource-chip will-chip ${willWasHit ? 'will-lost' : ''}`} title="Will"><img src={publicAsset('icons/will.png')} alt="Will" /><b>{game.will}<small>/{game.maxWill}</small></b></div>
                <div className="resource-chip" title="Thread"><img src={publicAsset('icons/thread.png')} alt="Thread" /><b>{game.thread}</b></div>
                <div className="resource-chip" title="Favor"><img src={publicAsset('icons/favor.png')} alt="Favor" /><b>{game.favor}</b></div>
                <div className="resource-chip" title="Burden"><img src={publicAsset('icons/burden.png')} alt="Burden" /><b>{game.burden}</b></div>
                <button className="rules-icon-button" aria-label="How to play" title="How to play" onClick={() => setShowRules(true)}>?</button>
              </div>
            <div className="hand-row">
              <div className="hand-zone">
                <div className="hand-zone-title">YOUR HAND <span>{game.hand.length} CARDS</span></div>
                <div className="hand-cards">
                  {game.hand.map((id) => {
                    const card = cardById(id);
                    return <button key={id} className={`hand-card ${game.selectedCard === id ? 'hand-card-selected' : ''}`} onClick={() => update((state) => selectHandCard(state, id))} title={`${card.ability}: ${card.description}`}>
                      <img src={cardImage(id)} alt={`${card.name} tarot card`} />
                      <span className="hand-card-type">{card.ability}</span>
                    </button>;
                  })}
                </div>
              </div>
              <div className="card-action-panel">
                <div className="selected-action-copy">
                  <span className="action-category">{selectedCard ? selectedCard.epithet : 'Your move'}</span>
                  <strong>{selectedCard ? selectedCard.ability : 'Choose a card'}</strong>
                  {selectedCard && <p>{selectedCardOutOfRange ? `Move ${selectedCard.name} within ${cardRange(selectedCard)} spaces of a foe.` : `${selectedCard.description}${cardNeedsTarget(selectedCard) ? ` · Range ${cardRange(selectedCard)}` : ` · Target a foe to add 2 damage (range ${cardRange(selectedCard)})`}`}</p>}
                </div>
                <button className="play-card-button" disabled={!selectedCard || game.actions < 1 || selectedCardOutOfRange} onClick={() => update(playSelectedCard)}><span>Play Card</span><b>↗</b></button>
                <button className="end-turn-button" disabled={game.actions >= 2} onClick={() => update(endPlayerTurn)}><span>End Turn</span><small>↵</small></button>
              </div>
              <aside className="enemy-ledger" aria-label="Enemy status">
                <div className="enemy-ledger-list">
                  {game.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => <div className="enemy-ledger-card" key={enemy.id}>
                    <img className="enemy-ledger-portrait" src={publicAsset(`enemies/${enemy.id}.png`)} alt="" />
                    <div className="enemy-ledger-copy"><b>{enemy.name}</b><span>{enemy.hp}/{enemy.maxHp} HP{enemy.ward > 0 ? ` · ${enemy.ward} WARD` : ''}</span><div className="foe-health-bar"><i style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }} /></div><small>{enemy.stunned ? 'STUNNED' : enemy.exposed ? `EXPOSED · ${enemyIntent(enemy)}` : enemyIntent(enemy)}</small></div>
                  </div>)}
                  {game.enemies.every((enemy) => enemy.hp <= 0) && <div className="enemy-field-clear">THE FIELD IS QUIET</div>}
                </div>
              </aside>
            </div>
            </div>
          </footer>
        </section>
      )}

      {game.screen === 'choice' && (
        <section className="story-choice-screen">
          <div className="choice-art"><img src={cardImage(game.chapter === 0 ? 'oedipus' : game.chapter === 1 ? 'medea' : 'persephone')} alt="" /></div>
          <div className="choice-copy">
            <div className="screen-kicker">THE FIELD IS QUIET <i>✦</i> ACT {['I', 'II', 'III'][game.chapter]} COMPLETE</div>
            <h1>{chapter.choiceTitle}</h1>
            <p>{chapter.opening}</p>
            <div className="choice-options">{storyChoices.map((choice) => <button key={choice.kind} className="choice-option" onClick={() => update((state) => resolveStoryChoice(state, choice.kind as 'mercy' | 'defiance' | 'reckoning' | 'rewrite' | 'accept'))}><span className="choice-sigil">✦</span><span><b>{choice.title}</b><small>{choice.text}</small></span><i>→</i></button>)}</div>
          </div>
        </section>
      )}

      {game.screen === 'recruit' && (
        <section className="recruit-screen">
          <div className="screen-kicker">BETWEEN THE ACTS <i>✦</i> A NEW NAME SURFACES</div>
          <h1>Who joins your reading?</h1>
          <p className="screen-intro">The next story asks for a different voice. Choose one character card to add to your circle.</p>
          <div className="recruit-grid">{game.recruitOptions.map((id) => {
            const card = cardById(id);
            return <button key={id} className="recruit-card" onClick={() => update((state) => recruitCard(state, id))}><img src={cardImage(id)} alt={`${card.name}, ${card.epithet}`} /><span className="recruit-copy"><b>Take {card.name}</b><small>{card.fate}</small><i>ADD TO THE CIRCLE →</i></span></button>;
          })}</div>
        </section>
      )}

      {game.screen === 'ending' && (
        <section className="ending-screen">
          <div className="ending-card"><img src={cardImage(game.destiny ?? 'apollo')} alt="Your first fate card" /><div className="ending-card-caption">THE CARD THAT BEGAN IT</div></div>
          <div className="ending-copy">
            <div className="screen-kicker">THE THREAD IS YOURS <i>✦</i> EPILOGUE</div>
            <h1>{game.endingTitle}</h1>
            <p>{game.endingText}</p>
            <div className="ending-ledger"><div><small>THREADS REWRITTEN</small><b>{game.rewrites}</b></div><div><small>FATES ACCEPTED</small><b>{game.acceptances}</b></div><div><small>FAVOR WON</small><b>{game.favor}</b></div><div><small>BURDEN CARRIED</small><b>{game.burden}</b></div></div>
            <div className="ending-actions"><button className="primary-action" onClick={begin}><span>Begin Another Reading</span><b>↗</b></button><button className="quiet-action" onClick={() => openArchive('title')}>Visit the Card Archive <span>→</span></button></div>
          </div>
        </section>
      )}

      {game.screen === 'archive' && (
        <section className="archive-screen">
          <div className="archive-heading"><div><div className="screen-kicker">THE ILLUSTRATED DECK <i>✦</i> 25 CHARACTERS</div><h1>The Card Archive</h1><p>Gods and tragic lives, each bound to a different answer.</p></div><button className="back-button" onClick={closeArchive}>← <span>RETURN</span></button></div>
          <div className="archive-grid">{cards.map((card) => <button key={card.id} className="archive-card" onClick={() => setArchiveCard(card)}><img src={cardImage(card.id)} alt={card.name} /><span>{card.name}</span></button>)}</div>
        </section>
      )}

      {archiveCard && game.screen === 'archive' && <div className="modal-backdrop" onClick={() => setArchiveCard(null)}><div className="card-detail-modal" onClick={(event) => event.stopPropagation()}><img src={cardImage(archiveCard.id)} alt={archiveCard.name} /><div className="card-detail-copy"><div className="screen-kicker">CHARACTER ARCANA</div><h2>{archiveCard.name}</h2><span>{archiveCard.epithet}</span><blockquote>“{archiveCard.fate}”</blockquote><div className="detail-ability"><small>{archiveCard.ability.toUpperCase()}</small><p>{archiveCard.description}</p></div><button className="quiet-action" onClick={() => setArchiveCard(null)}>Return to the deck <span>→</span></button></div><button className="close-modal" onClick={() => setArchiveCard(null)}>×</button></div></div>}

      {paused && game.screen !== 'archive' && (
        <div className="modal-backdrop pause-backdrop"><div className="pause-modal"><p>The moment holds. Your progress is saved between turns.</p><button className="primary-action" onClick={() => setPaused(false)}><span>Return to the Board</span><b>→</b></button><button className="quiet-action" onClick={() => setShowRules(true)}>Read the rules <span>?</span></button><button className="quiet-action" onClick={() => openArchive('pause')}>Open the card archive <span>⌘</span></button><button className="quiet-action return-title" onClick={() => { setGame(returnToTitle()); setPaused(false); }}>Return to title <span>↗</span></button></div></div>
      )}

      {showRules && <div className="modal-backdrop" onClick={() => setShowRules(false)}><div className="rules-modal" onClick={(event) => event.stopPropagation()}><button className="close-modal" onClick={() => setShowRules(false)}>×</button><div className="rules-prose"><p>Each round gives you two actions. Every card belongs to its named ally. Strike reaches 2 spaces; Bind and Rewrite reach 3; Oedipus reaches 4; Electra strikes at 2. Ward, Mend and other Insight cards can also strike for 2 damage at range 4 when you select a foe, while still using their support power. Play them without a target to focus on support.</p><p>Move an ally to a glowing adjacent space for one action. Move a card’s ally closer when its foe is out of range. Move a marked ally away when a foe is about to strike; the foe must spend its turn advancing instead.</p><p>At the end of your turn, each foe advances toward its marked ally or strikes when adjacent. A strike drains your Will by the damage shown beside the foe’s portrait. Your allies have no separate health bars; you are protecting your Will.</p><p>The foe draws one Oracle card for the whole reading. Its portrait and power stay visible above the board. Foes have more health now, and their Oracle may grant extra damage, Ward, healing, faster movement or added Burden.</p><p>Wards absorb damage. At zero Will, Thread saves you first, then Favor; each rescue adds Burden. If both are gone, the reading ends. Clear the board to choose how the story continues.</p></div><button className="primary-action" onClick={() => setShowRules(false)}><span>Understood</span><b>→</b></button></div></div>}
    </div>
  );
}

export default App;
