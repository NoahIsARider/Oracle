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
1. Zagreus, The First Blood: a young man with short black hair and a crimson shoulder mantle, bronze sword lowered, embers under his sandals, pomegranate branches behind him, red and gold palette.
2. Nyx, The Night Made Mother: a tall veiled woman in indigo robes scattered with small stars, great dusk-coloured wings folded behind her, a crescent moon held like a lamp, night sky inside the arch, deep blue and silver palette.
3. Thanatos, The Gentle End: a pale young man with long silver-white hair and folded black wings, holding a slim scythe in one hand and a butterfly on the other, cypress trees and a grey field behind him, ivory and charcoal palette.
4. Megaera, The First Fury: a fierce winged woman in dark bronze armour with a red-plumed helm, coiled whip in her raised hand, torches and smoke behind her, crimson and bronze palette.
5. Hypnos, The Soft Sleep: a sleeping youth with a wreath of poppies, small wings at his temples, leaning on a stone by a slow river, reeds and drowsy mist, lavender and pale gold palette.
6. Chaos, The First Void: a faceless figure wrapped in drifting mist and layered violet veils, two open hands framing a ring of tiny stars, no face visible, void and dust behind, violet and pale gold palette.

After generating, copy the finished image to assets/cards/sheets/oracle-cast-05.png in this repository. Verify with python that its size is 1024x1536 and that it shows six separate complete cards. If the sheet has a different aspect, merged cards or any text, generate once more, then save. Do not edit any other file and do not run git.
