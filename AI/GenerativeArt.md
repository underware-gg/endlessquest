# Generating Art assets

Endless Quest should generate the following art assets:
* Realm loading screen: Background image
* Chamber dialog: Chamber Background image
* Chamber dialog: NPC Portrait image

# Prompt Structure

We will use AI prompts to generate art.

Every asset should have a 
* `[STANDARD_PREFIX]` -- A universal prefix added to the start of every prompt, that tunes towards NPC portraits
* `[STANDARD_SUFFIX]` -- A standard suffix added to the end of every prompt, that tunes for art quality.

## Realm Loading Screen: Background image

This image is used as the background image on the loading screen for each Realm.

It should ideally be generated once when the realm is created and then cached, using an API call to [Blockade Labs AI Skybox](https://www.blockadelabs.com/).

The prompt should pass the `[STANDARD_PREFIX]` + `[REALM_DESCRIPTION]` + `[STANDARD_SUFFIX]`:
* `[REALM_DESCRIPTION]` -- The description field from the realm metadata, with any leading/trailing whitespace+punctuation stripped.

## Chamber Assets

Each Chamber prompt should include:
* `[TERRAIN_PREFIX]` -- A terrain type specific prompt that sets a consistent art style for each terrain
* `[REALM_SUFFIX]` -- A standard suffix added to the prompt for everything in this realm

### Chamber Dialog: Chamber Background image

This image should be displayed as the background image for the chamber dialog UI. It is different for each chamber.

The format should be:
`[STANDARD_PREFIX]` + `[TERRAIN_PREFIX]` + `[CHAMBER_DESCRIPTION]` + `[REALM_SUFFIX]` + `[STANDARD_SUFFIX]`
* `[CHAMBER_DESCRIPTION]` -- The name + description field from the chamber metadata, with any leading/trailing whitespace+punctuation stripped.

This should be a rectangular aspect ratio.

### Chamber Dialog: NPC Portrait

This image should be displayed as the portrait of the NPC. It is different for each chamber.

The format should be:
`[STANDARD_PREFIX]` + `[TERRAIN_PREFIX]` + `[NPC_DESCRIPTION]` + `[REALM_SUFFIX]` + `[STANDARD_SUFFIX]`
* `[NPC_DESCRIPTION]` -- The NPC_Description of the NPC in this chamber, with leading/trailing whitespace+punctuation stripped.

NPC Portrait Picture are displayed in the chamber dialog UI, to depict the NPC found in that chamber.
* Each NPC should have their own portrait picture generated, based upon their description
* Generated images do not need a specific background, and likely work better if portraits are requested in a consistent art style
* Each terrain type should specify a custom prefix and a suffix, which it can use to guide the generation towards a distinctive but consistent art style for that room type.

They should be a square aspect ratio.

# Prefixes and suffixes

Standard Prefix: `"A fantasy art portrait of an NPC in a video game"`
Standard Suffix: `", roleplaying game, video game, high definition, 4k"`

Terrain Prefixes:
* `Fire` - ``
* `Water` - `watercolour`
* `Earth` - `oil painting portrait by zdzislaw beksinski and mark rothko`
* `Air` - ``

## Realm examples

Format: `Description`

* The Celestial Harmony is an ethereal realm suspended in the night sky, filled with constellations and celestial bodies, ruled by the enigmatic Star Queen.
* The Undergloom is a vast, subterranean network of caves filled with goblins and dominated by the formidable lair of their sardonic king.

## Chamber Examples

Format: `(Terrain): Name - Description`

* (Fire): "The Dragon's Lair - A grand cavern filled with the glint of treasure, the heat of molten lava, and the imposing presence of Fafnir the Timeless Dragon."
* (Water): "The Luminous Grove - A mystical grove bathed in an ethereal glow, filled with luminescent flora and fauna. The air is filled with a soothing melody, as if the grove itself is singing."
* (Earth): "The Shadowed Vault - A mysterious vault, half-swallowed by the enveloping darkness of the Spire. Ancient carvings depict shadowy figures performing cryptic rituals. The air is heavy with a foreboding presence."
* (Air): "The Echoing Caverns - A vast network of echoing caverns, filled with stalactites and stalagmites. The echoes of dripping water and distant rumbles create an eerie atmosphere."

## NPC Description examples

Format: `Behaviour Mode (Gem): Name - Description`

* Quest (Silver): "Seraphina the Cursed Dancer - Once a famous dancer, Seraphina is now trapped in an endless dance by a jealous witch. She is friendly but forlorn, always moving to a silent rhythm."
* Quest (Silver): "Lana the Lost Traveler - A spirited adventurer with a heart for exploration. Unfortunately, Lana has a terrible sense of direction and often finds herself lost."
* Mystery (Gold): "The Whispering Chamber - An eerily quiet room filled with ancient inscriptions. When the wind blows, it seems to whisper secrets."
* Fight (Sapphire): "Gorthak the Relentless - A colossal troll known for his insatiable appetite and ferocity in battle. His armor is adorned with the bones of his victims."
* Trickster: (Emerald): "Eris the Illusionist - A mesmerizing enigma who speaks in riddles and illusions. Her true intentions are often hidden behind a veil of magic and misdirection."
* Trial (Ruby): "Fafnir the Timeless - An ancient dragon, renowned for his wisdom and might. He guards a powerful artifact and only bestows it upon those who prove their valor." 
* Artefact (diamond): "The Crystal of Eternity - A resplendent crystal with an inner glow that never dims. It is said to possess the power to manipulate time."
* Fight (Sapphire): "Obsidian, the Shadow Stalker - A phantom carved from the blackest obsidian, silent as the darkness itself. It prowls the vault, ensuring no light disturbs the sanctity of the shadows."


# Sample Prompts (DALL-E)

## NPC

Fire: `A fantasy art portrait of an NPC in a video game, XXX: An ancient dragon, renowned for his wisdom and might. He guards a powerful artifact and only bestows it upon those who prove their valor; portrait, fantasy, roleplaying game, video game, high definition, 4k`

Water: `A fantasy art portrait of an NPC in a video game, watercolour: Seraphina the Cursed Dancer - Once a famous dancer, Seraphina is now trapped in an endless dance by a jealous witch. She is friendly but forlorn, always moving to a silent rhythm; portrait, fantasy, roleplaying game, video game, high definition, 4k`

Earth: `A fantasy art portrait of an NPC in a video game, oil painting portrait by zdzislaw beksinski and mark rothko: Gorthak the Relentless - A colossal troll known for his insatiable appetite and ferocity in battle. His armor is adorned with the bones of his victims.; portrait, fantasy, roleplaying game, video game, high definition, 4k`

Air: `A fantasy art portrait of an NPC in a video game, XXX: The Whispering Chamber - An eerily quiet room filled with ancient inscriptions. When the wind blows, it seems to whisper secrets; portrait, fantasy, roleplaying game, video game, high definition, 4k`