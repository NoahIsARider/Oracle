export type CardEffect = 'strike' | 'ward' | 'mend' | 'rewrite' | 'insight' | 'bind';

export interface RoleCard {
  id: string;
  name: string;
  epithet: string;
  fate: string;
  ability: string;
  description: string;
  effect: CardEffect;
  power: number;
}

export const cards: RoleCard[] = [
  { id: 'apollo', name: 'Apollo', epithet: 'The Clear Sight', fate: 'A truth revealed can still wound the one who sees it.', ability: 'Unclouded Sight', description: 'Read the enemy’s next intent. Draw a card and gain 1 Favor.', effect: 'insight', power: 1 },
  { id: 'athena', name: 'Athena', epithet: 'The Measured Hand', fate: 'Wisdom is the shape of a choice made before the blade falls.', ability: 'Aegis of Counsel', description: 'Raise a ward that absorbs 4 damage from the next enemy turn.', effect: 'ward', power: 4 },
  { id: 'aphrodite', name: 'Aphrodite', epithet: 'The Tender Bond', fate: 'Love binds as surely as law, and sometimes more gently.', ability: 'Golden Thread', description: 'Restore 4 Will and soften the burden carried by the party.', effect: 'mend', power: 4 },
  { id: 'hades', name: 'Hades', epithet: 'The Quiet Gate', fate: 'What is lost is not always gone; what returns is never unchanged.', ability: 'Open the Gate', description: 'Deal 3 damage to a chosen foe. Gain 1 Favor if it falls.', effect: 'strike', power: 3 },
  { id: 'oedipus', name: 'Oedipus', epithet: 'The Unveiled King', fate: 'The answer waits behind the question you fear to ask.', ability: 'Name the Riddle', description: 'Deal 2 damage and expose a weakness: the next hit against that foe deals +2.', effect: 'insight', power: 2 },
  { id: 'medea', name: 'Medea', epithet: 'The Unbound Flame', fate: 'A life remade carries the heat of every bridge it burns.', ability: 'Rewrite the Vow', description: 'Spend 1 Thread to deal 6 damage. Without Thread, deal 3 and gain 1 Burden.', effect: 'rewrite', power: 6 },
  { id: 'persephone', name: 'Persephone', epithet: 'The Returning Spring', fate: 'Every descent keeps the shape of a way home.', ability: 'Pomegranate Bloom', description: 'Restore 3 Will and return one discarded card to your hand.', effect: 'mend', power: 3 },
  { id: 'zeus', name: 'Zeus', epithet: 'The Storm Crown', fate: 'Authority can command the sky, but not the weather within.', ability: 'Thunder Decree', description: 'Deal 4 damage to a chosen foe. The Chorus also loses 1 Resolve.', effect: 'strike', power: 4 },
  { id: 'poseidon', name: 'Poseidon', epithet: 'The Unquiet Sea', fate: 'A tide pushed aside will return with another name.', ability: 'Undertow', description: 'Deal 3 damage and delay the target’s next attack.', effect: 'bind', power: 3 },
  { id: 'artemis', name: 'Artemis', epithet: 'The Wild Moon', fate: 'The forest remembers every path taken in haste.', ability: 'Moonlit Arrow', description: 'Deal 4 damage to a foe that has not acted this round.', effect: 'strike', power: 4 },
  { id: 'dionysus', name: 'Dionysus', epithet: 'The Open Mask', fate: 'A role performed long enough can become a second self.', ability: 'Unmask the Chorus', description: 'Reveal the enemy plan, draw a card, and gain 1 Favor.', effect: 'insight', power: 1 },
  { id: 'ajax', name: 'Ajax', epithet: 'The Last Shield', fate: 'Even the strongest arm must choose what it stands between.', ability: 'Shield of Salamis', description: 'Deal 3 damage and gain a ward for 2 incoming damage.', effect: 'strike', power: 3 },
  { id: 'cassandra', name: 'Cassandra', epithet: 'The Unbelieved', fate: 'A warning is still a gift, even when no one takes it.', ability: 'Foretell the Blow', description: 'Cancel one enemy attack and draw a card.', effect: 'bind', power: 2 },
  { id: 'demeter', name: 'Demeter', epithet: 'The Patient Harvest', fate: 'Grief can leave the earth barren; care can bring it back.', ability: 'Harvest of Ash', description: 'Restore 3 Will and gain 1 Favor.', effect: 'mend', power: 3 },
  { id: 'hermes', name: 'Hermes', epithet: 'The Crossroads', fate: 'Every road is a promise to meet another version of yourself.', ability: 'Mercury’s Passage', description: 'Draw 2 cards. The next card played this round costs no Thread.', effect: 'insight', power: 2 },
  { id: 'ares', name: 'Ares', epithet: 'The Red Answer', fate: 'Violence resolves a question and leaves the answer behind.', ability: 'Spear of Enyo', description: 'Deal 5 damage and gain 1 Burden.', effect: 'strike', power: 5 },
  { id: 'hestia', name: 'Hestia', epithet: 'The Kept Hearth', fate: 'A refuge is not an escape; it is a place to begin again.', ability: 'Hearthfire', description: 'Restore 2 Will and raise a ward for 2 damage.', effect: 'mend', power: 2 },
  { id: 'odysseus', name: 'Odysseus', epithet: 'The Long Return', fate: 'A clever detour may still lead to the shore you left.', ability: 'Borrowed Wind', description: 'Deal 2 damage, draw a card, and reduce Burden by 1.', effect: 'insight', power: 2 },
  { id: 'penelope', name: 'Penelope', epithet: 'The Unfinished Loom', fate: 'To wait can be a craft; to unravel can be an answer.', ability: 'Day’s Weaving', description: 'Gain a ward for 5 damage. Keep one card in hand through the next reshuffle.', effect: 'ward', power: 5 },
  { id: 'hera', name: 'Hera', epithet: 'The Oath-Keeper', fate: 'A vow can shelter a household or close around it like a cage.', ability: 'Sanctuary of Hera', description: 'Gain a ward for 4 damage and 1 Favor.', effect: 'ward', power: 4 },
  { id: 'hephaestus', name: 'Hephaestus', epithet: 'The Patient Forge', fate: 'What is broken can be shaped again, though the seam remains.', ability: 'Bronze Recasting', description: 'Deal 3 damage and restore 2 Will.', effect: 'strike', power: 3 },
  { id: 'heracles', name: 'Heracles', epithet: 'The Burden-Bearer', fate: 'Strength is measured by what you refuse to pass onward.', ability: 'Labour of Atlas', description: 'Deal 5 damage. If the target survives, gain a ward for 2.', effect: 'strike', power: 5 },
  { id: 'iphigenia', name: 'Iphigenia', epithet: 'The Offered Name', fate: 'The price demanded by the powerful is not the same as consent.', ability: 'Unspent Offering', description: 'Restore 4 Will; gain 1 Thread if Will was below half.', effect: 'mend', power: 4 },
  { id: 'electra', name: 'Electra', epithet: 'The House of Memory', fate: 'The past may ask to be witnessed without being obeyed.', ability: 'Remember the House', description: 'Deal 2 damage and expose the target for +2 damage from the next hit.', effect: 'strike', power: 2 },
  { id: 'orpheus', name: 'Orpheus', epithet: 'The Second Song', fate: 'A song can lead you through the dark; looking back is still a choice.', ability: 'Song Below', description: 'Deal 2 damage, recover a discarded card, and gain 1 Favor.', effect: 'insight', power: 2 },
];

export const chapters = [
  {
    title: 'The Unburied',
    place: 'THEBES · EASTERN GATE',
    subtitle: 'A city has mistaken silence for peace.',
    opening: 'At dusk, Antigone kneels beside a body the city has forbidden the earth to receive. Creon’s order is carved into the gate. The Chorus watches from the steps, waiting to learn what obedience costs.',
    objective: 'Break the decree’s hold before the last light leaves the gate.',
    omen: 'Enemies pursue a marked life. They strike for the Will damage shown beside their portrait only when adjacent; otherwise they advance.',
    enemies: [
      { id: 'guard', name: 'Palace Guard', hp: 11, damage: 3, cell: 3, intent: 'ADVANCE · 3' },
      { id: 'decree', name: 'King’s Decree', hp: 13, damage: 3, cell: 5, intent: 'ADVANCE · 3' },
    ],
    choiceTitle: 'What shall the city remember?',
    choices: [
      { title: 'Bury the dead', text: 'Let grief become a law the living can keep.', kind: 'mercy' },
      { title: 'Read the decree aloud', text: 'Make every citizen hear the price of obedience.', kind: 'defiance' },
    ],
  },
  {
    title: 'The Red Vow',
    place: 'CORINTH · THE BRIDAL HALL',
    subtitle: 'An oath has outlived the love that made it.',
    opening: 'Medea stands beyond the wedding torches. Jason’s new promise is being celebrated inside, while an older vow burns in the courtyard. No god speaks first. The cards wait for a witness.',
    objective: 'Unmake the oath’s violence without surrendering your own voice.',
    omen: 'Enemies pursue a marked life. They strike for the Will damage shown beside their portrait only when adjacent; otherwise they advance.',
    enemies: [
      { id: 'vow', name: 'Broken Vow', hp: 15, damage: 4, cell: 2, intent: 'ADVANCE · 4' },
      { id: 'bride', name: 'Golden Bride', hp: 13, damage: 3, cell: 4, intent: 'ADVANCE · 3' },
    ],
    choiceTitle: 'What will you offer Medea?',
    choices: [
      { title: 'Give her a road out', text: 'No promise is worth a life taken in its name.', kind: 'mercy' },
      { title: 'Let the oath answer itself', text: 'A broken vow must be seen in the light it made.', kind: 'reckoning' },
    ],
  },
  {
    title: 'The Fates’ Loom',
    place: 'DELPHI · THE INNER SANCTUARY',
    subtitle: 'The final thread is already in your hand.',
    opening: 'The sanctuary opens beneath the mountain. Clotho spins, Lachesis measures, and Atropos holds the shears. The cards you carried here are no longer predictions. They are testimony.',
    objective: 'Face the last measure, then choose what the loom may keep.',
    omen: 'Enemies pursue a marked life. They strike for the Will damage shown beside their portrait only when adjacent; otherwise they advance.',
    enemies: [
      { id: 'atropos', name: 'Atropos', hp: 18, damage: 4, cell: 2, intent: 'ADVANCE · 4' },
      { id: 'chorus', name: 'Chorus of Threads', hp: 15, damage: 4, cell: 4, intent: 'ADVANCE · 4' },
    ],
    choiceTitle: 'How will you answer the Fates?',
    choices: [
      { title: 'Cut the thread', text: 'A future that cannot change is only another prison.', kind: 'rewrite' },
      { title: 'Carry the thread forward', text: 'Accept the cost. Refuse to pass it on unchanged.', kind: 'accept' },
    ],
  },
];

export const cardById = (id: string) => cards.find((card) => card.id === id)!;
