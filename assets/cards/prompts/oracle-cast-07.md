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
1. Theseus, The Certain Crown: a proud young king in a short crowned helm and white chiton, sword point down and round shield forward, marble columns and olive branches behind him, cream and Aegean blue palette.
2. Asterius, The Horned Name: a great bull-headed man in heavy bronze shoulder plates holding a double axe, horns scarred, maze walls and dark arch behind him, oxblood and bronze palette.
3. Ariadne, The Given Thread: a young woman with a star crown holding a ball of red thread that runs out of frame, sea cliff and a distant ship behind her, wine red and midnight blue palette.
4. Icarus, The Near Sun: a youth with wide feathered wings, some feathers melting and falling away, a great sun disc behind him, sea far below, sky blue and molten gold palette.
5. Medusa, The Gaze Unasked: a sorrowful woman with serpent hair, holding a polished bronze shield that shows her own reflection, sea caves behind her, stone grey and verdigris palette.
6. Scylla, The Six-Necked Name: a monstrous woman rising from surf with hound heads and coiling tentacles at her waist, sea spray and a narrow strait behind her, teal and salt white palette.

After generating, copy the finished image to assets/cards/sheets/oracle-cast-07.png in this repository. Verify with python that its size is 1024x1536 and that it shows six separate complete cards. If the sheet has a different aspect, merged cards or any text, generate once more, then save. Do not edit any other file and do not run git.
