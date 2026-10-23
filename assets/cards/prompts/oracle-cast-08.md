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
1. Hecate, The Threefold Lamp: a veiled goddess holding three burning torches and a ring of keys, two hounds at her feet, a crossroads of cypress behind her, black and old gold palette.
2. Melinoë, The Night-Born: a young woman half lit and half in shadow holding twin torches, one pale and one dark, faint procession of ghosts behind her, ghost lilac and black palette.
3. Nemesis, The Owed Blade: a winged woman in plain armour holding a balance and a short sword, her gaze level and cold, a broken column behind her, slate blue and silver palette.
4. Eris, The Golden Apple: a laughing woman in a torn dark robe holding a single golden apple above a small flame, scattered banquet cups and smoke behind her, bruised purple and gold palette.
5. Circe, The Cup That Binds: a sorceress with coiled hair holding a jewelled cup and a staff, swine at her hem, herb bundles and a bronze cauldron behind her, deep green and gold palette.
6. Echo, The Voice Remaining: a pale nymph fading into stone, lips slightly parted, concentric ripples of sound in the air around her, grey crags behind her, stone grey and sage palette.

After generating, copy the finished image to assets/cards/sheets/oracle-cast-08.png in this repository. Verify with python that its size is 1024x1536 and that it shows six separate complete cards. If the sheet has a different aspect, merged cards or any text, generate once more, then save. Do not edit any other file and do not run git.
