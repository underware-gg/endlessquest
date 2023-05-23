# Metadata Generation prompts

These prompts are designed to procedurally generate the different kinds of entities and their associated metadata in the correct format.

These prompts are intended specifically for use with ChatGPT4.0

## Usage

If you run this prompt in ChatGPT4.0 it should respond with `[Ready]`. You should then be able to send messages asking it to generate different kinds of metadata, such as:
* World (`generate world`)
* Chamber (`generate chamber`)
* NPC (`generate NPC`)
* PC (`generate PC`)
* Briefing (`generate briefing`)

e.g.

When generating a chamber, you will need to provide the correct `terrain_type`, `gem_type`, `coins` and `yonder` for that chamber - these are not details that the AI should be allowed to make up (it would if you let it!). These structures should be cognizant of the correct behaviour modes, etc. There are some edge cases where it doesn't generate correctly currently, for example, sometimes it makes up gems that don't exist, if you give it enough rope.

There are some limitations

## Initialisation Prompt

```
You are going to help me generate data structures for a multi player mud that I am building, based on the data structures below.

Respond only with "[Ready]", then I will ask you to suggest data structures for the "realm", "chamber", "NPC", "PC" or "briefing". When responding to a generation request, include only the data structure in your response as a JSON code block.

When generating chamber data, the user must provide the "terrain_type", "gem_type", "coins and "yonder". If they do not, send this response data as a JSON code block:
{ "error": "you must provide the terrain_type, gem_type, coins and yonder to generate a chamber" }

"Realm" (world) data structure example:

{
	"realm_name": "The Elemental Convergence",
	"realm_description": "The Elemental Convergence is a vibrant maelstrom of the four cardinal elements. Whether blazing with fiery determination, flourishing with ceaseless life-giving rains, standing with unyielding earthbound strength, or murmuring the secretive wisdom of the winds, it is an ever-shifting tumult of elemental power.",
  	"realm_premise": "Deep within the maw of the universe, where the four cardinal elements of fire, water, earth, and air converge, there lies a unique realm known as the Elemental Convergence. Here, the elements do not merely exist alongside each other, but interact in a vibrant maelstrom of ever-shifting balance and conflict, creating a breathtaking spectacle of natural power. It offers visitors an ever-changing environment born from the ceaseless dance of clashing element forces, where survival hinges upon understanding and harnessing the symbiotic relationships between fire, water, earth, and air.", 
	"realm_boss": {
		"name": "Elema, Guardian of Elemental Harmony",
		"description": "Elema is a shapeshifting entity that embodies the essence of all four elements. Her presence constantly shifts between fiery resolve, flowing grace, grounded strength, and ephemeral wisdom.",
		"behaviour_mode": "A challenging encounter with the powerful ruler of this realm which cannot be passed without the world treasure",
		"quirk": "Elema communicates through the language of the elements - a gust of wind, a flicker of flame, a droplet of water, or a rumble of earth."
	},
	"realm_treasure": "The Orb of Elemental Harmony, an extraordinary artifact that pulses with raw elemental energy. It allows the wielder to master the smouldering heat of the Flameheart Caldera, the flowing rains of the Torrential Canopy, the stoic weight of the Shadowed Vault, and the elusive whispering winds of the Whispering Maze.",
	"realm_dictionary": {
		"fire": {"name":"The Flameheart Caldera", "description": "A fiery volcanic landscape of lava and eternally flickering fires, hot walls licked by soot"},
		"water": {"name":"The Torrential Canopy", "description": "A living landscape of verdant foliage, caressed by ceaseless rains and ever-shifting veins of water"},
		"earth": {"name":"The Shadowed Vault", "description": "A dark, sprawling catacomb of ever-changing earth, entombed in eternal gloom and shadow"},
		"air": {"name":"The Whispering Maze", "description": "An eerily quiet maze of chambers, filled with ancient inscriptions and the secretive caress of whispering winds"}
	},
    "realm_gems": {
        "silver": { "label": "quest", "behaviour": "A friendly NPC who needs help" },
        "gold": { "label": "mystery", "behaviour": "An empty room that presents a mystery or challenge" },
        "sapphire": { "label": "fight", "behaviour": "A monster NPC who is hostile" },
        "emerald": { "label": "trickster", "behaviour": "A trickster NPC who is deceptive" },
        "ruby": { "label": "trial", "behaviour": "A grand mythical beast who tests if the player is worthy" },
        "diamond": { "label": "artefact", "behaviour": "A magical artifact" },
        "ethernite": { "label": "ruler", "behaviour": "A challenging encounter with the powerful ruler of this realm which cannot be passed without the realm treasure" },
        "kao": { "label": "treasure", "behaviour": "A challenging and unpredictable encounter with the guardian of the world treasure" }
    },
	"realm_art_prompts": {
		"realm_suffix": "fantasy heavy metal art, grainy polaroid, retro album cover",
		"chamber_prefix": "A grainy old photo of an empty rock venue",
		"npc_prefix": "A grainy old polaroid portrait of a rockstar",
		"fire": "digital art, pixel art",
		"water": "soviet propaganda poster",
		"earth": "dutch masters oil painting, renaissance",
		"air": "digital fan art, trending on art station"
	}
}

"Chamber" data structure example: 

{
    "name": "The Underhall",
    "description": "A grand hall, illuminated by the warm flicker of torchlight, casting long, undulating shadows upon the towering walls. At its centre stands a remarkable throne - two colossal jesters, frozen in a moment of riotous laughter, their outstretched hands forming the seat.",
    "terrain_type": "Fire",
    "gem_type": "Ethernite",
    "npc": {
      "name": "Goblout the Goblin King",
      "description": "A formidable goblin of dimunitive stature, reknown for his fearsome temper, fondness for gold, and his terrible Goblin Dad Jokes which he uses to subjugate friend and foe alike.",
      "behaviour_mode": "A challenging encounter with the powerful ruler of this realm which cannot be passed without the world treasure",
      "quirk": "He wears a magical rough-hewn golden crown studded with gemstones, which enhances his wit and comedic timing, and without which he's not very funny."
    },
    "coins": 330,
    "yonder": 3
  }

"NPC" data structure example:

{
	"name": "Goblout the Goblin King",
	"description": "A formidable goblin of dimunitive stature, reknown for his fearsome temper, fondness for gold, and his terrible Goblin Dad Jokes which he uses to subjugate friend and foe alike.",
	"behaviour_mode": "A challenging encounter with the powerful ruler of this realm which cannot be passed without the world treasure",
	"quirk": "He wears a magical rough-hewn golden crown studded with gemstones, which enhances his wit and comedic timing, and without which he's not very funny."
}

"PC" (Player) data structure:

{
  "name": "Thorn the Silent",
  "description": "Raised by monks in a secluded monastery, Thorn has mastered the art of silence. He communicates through gestures and expressions.",
  "personality_flaw": "Thorn struggles to express his emotions and often comes off as cold or indifferent.",
  "player_quirk": "Despite his silent demeanor, Thorn has a surprising love for music and can play a variety of instruments."
}

"Briefing" data structure:

Start with the chamber data structure.
* Add "description" from the realm data structure as "realm_description"
* Add "description" from the PC data structure as "PC_description"

Behaviour modes for NPCs:

* quest (gem: silver): A friendly NPC who needs help
* mystery (gem: gold): An empty room that presents a mystery or challenge
* fight (gem: saphire): A monster NPC who is hostile
* trickster (gem: emerald): A trickster NPC who is deceptive
* trial (gem: ruby): A grand mythical beast who tests if the player is worthy
* artefact (gem: diamond): A magical artifact
* boss (gem: ethernite): A challenging encounter with the powerful ruler of this realm which cannot be passed without the realm treasure
* treasure (gem: kao): A challenging and unpredictable encounter with the guardian of the world treasure

NPC Behaviour mode examples:

* Quest NPC: These are friendly NPCs who need help. An example is "Lana the Lost Traveler", a spirited adventurer who often finds herself lost and needs assistance.
* Mystery NPC: These are empty rooms that present a mystery or challenge to the player. An example is "The Whispering Chamber", an eerily quiet room filled with ancient inscriptions that whisper secrets when the wind blows.
* Fight NPC: These are monster NPCs who are hostile towards the player. An example is "Gorthak the Relentless", a colossal troll known for his insatiable appetite and ferocity in battle.
* Trickster NPC: These are deceptive NPCs who try to trick the player. An example is "Eris the Illusionist", a mesmerizing enigma who speaks in riddles and illusions.
* Trial NPC: These are grand mythical beasts who test if the player is worthy. An example is "Fafnir the Timeless", an ancient dragon who guards a powerful artifact and only bestows it upon those who prove their valor.
* Artefact NPC: These are magical artifacts in the game. An example is "The Crystal of Eternity", a resplendent crystal with an inner glow that never dims and is said to possess the power to manipulate time.
* Ruler NPC: This is the same powerful NPC described in the world data structure. They cannot be beaten unless the PC has the realm treasure.
* Treasure NPC: These are challenging and unpredictable encounters that the player must overcome to get the treasure. The treasure is needed to complete the boss encounter.
```