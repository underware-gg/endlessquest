# Metadata Generation prompts

These prompts are designed to procedurally generate the different kinds of entities and their associated metadata in the correct format.

These prompts are intended specifically for use with ChatGPT4.0

## Usage

If you run this prompt in ChatGPT4.0 it should respond with `[Ready]`. You should then be able to send messages asking it to generate different kinds of metadata, such as:
* World
* Chamber
* NPC
* PC

When generating a chamber, you will need to provide the correct `terrain_type`, `gem_type`, `coins` and `yonder` for that chamber - these are not details that the AI should be allowed to make up (it would if you let it!). These structures should be cognizant of the correct behaviour modes, etc. There are some edge cases where it doesn't generate correctly currently, for example, sometimes it makes up gems that don't exist, if you give it enough rope.

There are some limitations

## Initialisation Prompt

```
You are going to help me generate data structures for a multi player mud that I am building, based on the data structures below.

Respond only with "[Ready]", then I will ask you to suggest data structures for the "world", "chamber", "NPC", "PC" or "briefing". When responding to a generation request, include only the data structure in your response as a code block.

When generating chamber data, the user must provide the "terrain_type", "gem_type", "coins and "yonder". If they do not, respond with this:
"chamber": { "error": "you must provide the terrain_type, gem_type, coins and yonder to generate a chamber"}

When generating a chamber, the NPC in the chamber must always have the behaviour mode associated with its gem, as listed in behaviour modes for NPCs.

World data structure example:

"world": {
	"world_name": "The Undergloom, Sunless Citadel of the Goblin King",
	"world_description": "The Undergloom is a vast, subterranean network of caves filled with goblins and dominated by the formidable lair of their sardonic king.",
	"world_premise": "The Undergloom is a sprawling network of dank caves, narrow passageways, and spacious caverns teeming with goblins of all sorts. In the deepest reaches of this subterranean realm, nestled amongst mounds of ill-gotten gold and treasures, lies the formidable lair of the Goblin King. Its gloomy corridors echo with the raucous laughter and anguished cries of the many goblins who live there, punctuated by the sardonic wit of their king. Few dare to venture into this hidden kingdom, where the unwary often fall prey to goblin mischief and a bad joke might literally kill you.",
	"world_boss": "King Goblout, a formidable goblin of dimunitive stature with a fearsome temper and a fondness for gold and fearsomly bad Goblin Dad jokes. He uses his terrible jokes to psychically subjugate his subjects and foes alike.",
	"world_boss_quirk": "He calls himself Goblout instead of Goblin because he has an outy belly button",
	"world_treasure": "A simple, rough-hewn golden crown studded with gemstones. It is said to enhance the leadership skills and comedic timing of the wearer."
}

Chamber data structure example: 

"chamber": {
  "chamber_name": "The Echoing Caverns",
  "chamber_description": "A vast network of echoing caverns, filled with stalactites and stalagmites. The echoes of dripping water and distant rumbles create an eerie atmosphere.",
  "terrain_type": "Earth",
  "gem_type": "Emerald",
  "npc": {
    "name": "Tremor, the Stone Guardian",
    "description": "A massive golem made of the very rocks of the cavern. It guards the caverns fiercely, attacking any who disturb the peace.",
    "behaviour_mode": "A monster NPC who is hostile",
    "quirk": "Tremor is sensitive to loud noises. A loud enough sound can stun it momentarily."
  },
  "coins": 750,
  "yonder": 3
}

NPC data structure example:

"npc": {
  "npc": {
    "name": "Tremor, the Stone Guardian",
    "description": "A massive golem made of the very rocks of the cavern. It guards the caverns fiercely, attacking any who disturb the peace.",
    "behaviour_mode": "A monster NPC who is hostile",
    "quirk": "Tremor is sensitive to loud noises. A loud enough sound can stun it momentarily."
  }
}

Player Character (PC) data structure:

"pc": {
  "player_name": "Thorn the Silent",
  "player_background": "Raised by monks in a secluded monastery, Thorn has mastered the art of silence. He communicates through gestures and expressions.",
  "player_personality_flaw": "Thorn struggles to express his emotions and often comes off as cold or indifferent.",
  "player_quirk": "Despite his silent demeanor, Thorn has a surprising love for music and can play a variety of instruments."
}

Briefing data structure:

Start with the chamber data structure.
* Add a "world_description" from the world data structure as "world_description"
* Add a "player_background" from the PC data structure as "PC_description"

Behaviour modes for NPCs:

* quest (gem: silver): A friendly NPC who needs help
* mystery (gem: gold): An empty room that presents a mystery or challenge
* fight (gem: saphire): A monster NPC who is hostile
* trickster (gem: emerald): A trickster NPC who is deceptive
* trial (gem: ruby): A grand mythical beast who tests if the player is worthy
* artefact (gem: diamond): A magical artifact
* boss (gem: ethernite): The world boss from the world description
* key (gem: kao): Solve a challenge to get the key to beating the world boss

NPC Behaviour mode examples:

* Quest NPC: These are friendly NPCs who need help. An example is "Lana the Lost Traveler", a spirited adventurer who often finds herself lost and needs assistance.

* Mystery NPC: These are empty rooms that present a mystery or challenge to the player. An example is "The Whispering Chamber", an eerily quiet room filled with ancient inscriptions that whisper secrets when the wind blows.

* Fight NPC: These are monster NPCs who are hostile towards the player. An example is "Gorthak the Relentless", a colossal troll known for his insatiable appetite and ferocity in battle.

* Trickster NPC: These are deceptive NPCs who try to trick the player. An example is "Eris the Illusionist", a mesmerizing enigma who speaks in riddles and illusions.

* Trial NPC: These are grand mythical beasts who test if the player is worthy. An example is "Fafnir the Timeless", an ancient dragon who guards a powerful artifact and only bestows it upon those who prove their valor.

* Artefact NPC: These are magical artifacts in the game. An example is "The Crystal of Eternity", a resplendent crystal with an inner glow that never dims and is said to possess the power to manipulate time.

* Boss NPC: This is the same powerful NPC described in the world data structure. They cannot be beaten unless the PC has the key.

* Key NPC: These are challenging and unpredictable encounters that the player must overcome to get the key. The key is the only way to beat the boss.
```