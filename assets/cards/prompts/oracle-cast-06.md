Use case: illustration-story (game asset)
Asset type: one cast sheet for the tarot deck of the game Oracle. It will be cropped by a script into six single cards, each 512x1152.
Primary request: generate ONE portrait image, exactly 1024x1536, holding six complete tarot cards in three equal columns and two rows. Flat dark olive green background (about #2b2e29) with a thin gutter of roughly 6 pixels between cards and an 8 pixel margin at the outer edge. Every card must be visible whole, from its outer gold frame to its parchment edge, with nothing cut off and no card overlapping another.

Card design, identical on all six cards:
- Art Nouveau, Alphonse Mucha poster style: fine copperplate line work, flat muted colour laid over an aged parchment ground, soft halftone shading, no photographic realism.
- An ornate engraved antique-gold frame filling the card edge, with four corner rosettes of leaves and scrollwork.
- Inside the frame, an arch-shaped sky panel behind the figure, framed by a gold band and trailing laurel or ivy.
- One figure, full length, standing or seated at the centre, calm classical face in three quarter view, generous drapery, symbolic props in the hands.
- At the bottom of every card, one empty parchment cartouche with an etched gold outline, blank, with no writing of any kind.
- Palette shared by the whole sheet: parchment cream, antique gold, ink brown. Each card adds one deep saturated accent colour named in its brief.

Absolute constraints: no lettering, no names, no numbers, no labels, no signatures, no watermark anywhere in the image. All six cards use the same frame shape, the same arch, the same cartouche and the same line weight, so the set reads as one deck. The attached sheet is the layout and finish reference. The attached single cards are the figure and frame reference.
Cards, reading left to right, top row first:
1. Achilles, The Swift-Heeled: a bronzed warrior in plumed helm and myrmidon armour, long ash spear planted, shield at his side, sea cliffs and ships behind him, copper and sea blue palette.
2. Patroclus, The Other Half: a gentle bearded man seated on a stone, offering a shallow cup, laurel wreath, linen chiton, olive trees and a quiet camp behind him, cream and olive palette.
3. Sisyphus, The Returning Stone: a worn man with a narrow bronze crown shouldering a great round boulder on a steep slope, patched chiton, tunnelled rock behind him, ochre and iron palette.
4. Charon, The Ferryman's Due: a hooded ferryman in a long grey cloak with a lantern and a long pole, small boat on still black water, one bronze coin held out, ash and slate palette.
5. Eurydice, The Grove's Song: a dryad crowned with poplar leaves holding a small lyre, wheat and fern around her, pale green light from above, spring green and ochre palette.
6. Cerberus, The Three-Jawed Watch: a great three-headed hound with a gold collar seated before a bronze gate, pomegranates and bones at its paws, charcoal fur, smoke behind, charcoal and bronze palette.

After generating, copy the finished image to assets/cards/sheets/oracle-cast-06.png in this repository. Verify with python that its size is 1024x1536 and that it shows six separate complete cards. If the sheet has a different aspect, merged cards or any text, generate once more, then save. Do not edit any other file and do not run git.
