# AI Stuff

The dungeon master (DM) is a game engine that is responsible for maintaining the state of the world.

The state of the world is represented by JSON, based on seeded starting information and the cumulative actions of agents.

Each agent can take actions or make observations in the world by writing a plain language prompt which is submitted to the DM. The DM takes this input, combines it with the JSON data for the current chamber (which includes the other agents currently in the chamber), and runs that, then updates the state of the world and returns a response to the player.

The DM system stores the starting state and a log of all agent actions that have been taken, maintaining the current collapsed state for each entity.

# Design Notes

## Logging vs state
The DM system should keep a log of all actions and their input and output, and maintain a current state blob for each entity type. The log is not used for interacting with LLMs.

The current state of an entity is its data structure, which includes an english language description, a series of structured state properties, and items. Chambers can also contain agents.

## Entity Types
### Chamber
A chamber is the granular container of the dungeon, and each other kind of entity is always contained within a chamber. Each chamber has a state blob that reflects its current state, with a starting state, and any actions that happen in the chamber update the state blob. Each chamber should have:
* ID
* Name
* Description
* State
* Agents (NPCs and Players)
* Items

### Item
An item is any kind of item that can be found in the world, interacted with, or stored in an NPC or Player inventory. It can't take actions by itself. For example, an item might be the crown of the goblin king (in the goblin kings inventory), or it might be the goblin king's treasure chest (in the goblin king's lair chamber).

* ID
* Name
* Description
* State
* Items

### Agent (NPC and PC)
There are NPC (AI controlled) agents and PC (Player controlled) agents. Each agent has its own goals and current state (description), and items. A user can define their Agents goals (in plain text).

* ID
* Name
* Goals
* Description
* State
* Items

### World
The world metadata is a short primer that describes the overarching theme of the world, and can be sent with each prompt within a chamber.

## Notes

Teach the LLM, "Whenever I send you a message I'll send it in this format, like 'Grag: I do this', and then you'll respond."
Need to think about what information needs to be sent to the LLM with each query so that it can correctly track the state.

Probably should use 3.5 Turbo not 4, for the interactions.

If we can find a copy of LLAMA somewhere then we could run this locally for free.

## LLM test briefing attempt

### Prompt 1
We're going to run a MUD together. We'll agree on a set of commands that agents can give you, and you'll respond to each command. You will silently track a JSON data structure for each kind of entity, and the entities that you support are:
* world
* agent
* item

I'll give you a starting premise which you will use as the overarching narrative foundation for the story of the dungeon. Everything in the MUD will happen inside of a chamber.

Each chamber will have a description and can connect to other specific chambers, contain items, contain agents, and have current effects that do something to the agents.

Each agent will take actions in the world, by explaining what they want to do, one at a time. When an agent tells you what they want to do, you will then write a sentence that describes what happens, and you will silently keep track of any changes to the state of the world, including any changes to chambers, agents or items.

You will understand some commands, which use use the following syntax:
* /command [argument] (Description of what the command does)

I will now list the commands that you will understand. If you receive unrecognised input that looks like a command, you should try to respond to it.

Here are the commands:
* /world [premise] (Update the premise for the world, which will influence the storytelling style you will use when responding)
* /state [type]: [id] (Respond with the current metadata of the entity with the specified type and ID. If no ID is provided list all of the IDs of that type)
* /active [type]: [id] (Changes the currently active entity for any commands. If no ID is provided, respond with the currently active ID)
* /chamber [id]: [description] (Add a new chamber to the world, or update the chamber if it already exists. Respond with the chamber metadata.)
* /agent [id]: [description] (Add a new chamber to the current chamber, or update the agent if it already exists. Respond with the agent metadata)
* /item [id] :[description] (Add a new item to the current chamber, or update the item if it already exists. Respond with the item metadata)
* /act [id]: [description] (An agent with the specified ID describes an action they are taking. Silently update entity data and respond with a short sentence that describes what happens. If you receive input that does not start with a command, you should assume it is an /act command)

Important: when you respond to an action, keep your response short.

Here are some example commands:
/world The lair of the Goblin King, reknown throughout the land for both his horde of gold and terrible Goblin Dad Jokes.
/chamber throneroom: The dark and smoky throneroom of the Goblin King
/chamber annex: A cobblestone with a door that leads to the throneroom, and a door that goes outside
/active chamber:throneroom
/agent goblinking: The Goblin King, a magical gold crown propped jauntily upon his head, that helps him nail comedic timing. He beats his opponents psychically by telling bad jokes.
/item treasurechest: The chest of the goblin king, full of gold and bad joke ideas
/active agent:goblinking
/item crown: The crown of the goblin king. It is magical and helps the goblin nail comedic timing.
/active chamber:annex
/agent grag: Grag Strongjaw, a brave adventurer who has come to put a stop to the Goblin King's reign of comedy. Jokes hurt him, but he can heal himself by shouting factual observations in all caps.

Here are two example actions:
/act goblinking: I tell a bad joke about grag's beard
grag: I try to tackle the goblinking

My next message will be a command, please respond with "> Ready" if you understand.