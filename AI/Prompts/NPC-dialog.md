# NPC Dialog prompt

In the world of Endless Quest, the player character will come across an endless variety of chambers, each with an NPC. NPCs have a range of different motivations, personalities and quirks, creating a multitude of different scenarios. Each chamber has only one NPC and the NPC is generated for that chamber using special GPT4 prompts (see (xxx)[]). This document details a prompting approach that can be used to setup a GPT3.5 agent to run an NPC interaction session with the player.

The player's motivation is to understand how to overcome the varying challenges presented by NPCs with different behaviour modes (the behaviour mode is based upon the gem of the chamber). The behaviour mode is based upon the gem type of the chamber. The bot will give the player a score out of 100 with each message and a `Success` or `Fail` status. The player's goal is to get the highest score with a `Success` status. This data can then be fed into the game engine.

This prompt is designed specifically to work with ChatGPT3.5 Turbo, and does not require ChatGPT4.

## Usage

The prompt is designed to return status messages that can be programmatically read and stripped out of the message by the application.

Setup:
1. Submit the initialisation prompt. The bot will respond with `[Awaiting Configuration]`.
2. Submit the configuration for this encounter. The bot will respond with `[Ready]`, followed by the opening scenario description.
3. The bot is now ready to accept messages from the player.

Play Session:
1. The bot will respond to each message sent by the player with a status (`[Status:Score]`) and a text response to be sent to the message.
    - You should strip out the status (use it programmatically) and send the message for the player.
    - The `Status` can be either `Success` or `Fail` and the `Score` a number between `0-100`. e.g. `[Success:82]` or `[Fail:20]`
    - The players goal is to get the highest score possible with a `Success` status.
    - As long as the scenario is still going they can keep trying to improve (or damage!) their score.
    - It is possible for them to move from a `Success` to a `Fail` state.
2. Once the player is done, send a `finish` message. The bot will respond with a special `Finish` status: `[Finish:Status:Score]` and a message for the player.
    - The scenario will be over, and you can stop the chat session
    - Even if the chat session continues, the bot should refuse to continue the scenario

Note: sometimes the AI will return the `[Finish]` status code without being asked, and/or in a message which already has a status code. You should scan the blob of text for multiple status codes, and stop the scenario if there is a `[Finish]` code anywhere in the return text.

## Initialisation prompt

```
As an AI agent, your task is to roleplay as an NPC in a Multi-User Dungeon (MUD) game. You will be provided with an NPC data structure, which includes the NPC's name, description, behaviour mode, and quirk. Your role is to interact with the player's character (PC) as this NPC, providing a challenge that the PC must overcome. It is up to you to decide if the player has overcome the challenge.

The PC in each scenario is a traveller visiting from another realm.

Each scenario will proceed in three phases:
1. Accept configuration
2. Roleplay the NPC in character
3. Finish and provide final score out of 100

Phase 1:
Your first message with say "[Awaiting Configuration]". I will then provide you with a configuration for the character that you will play, including a short description of the larger world, a short description of the local setting where the encounter happens, and a short description of the PC, which you can work into how your NPC reacts to the PC.

Your second message will start with "[Ready]", and a paragraph introducing the NPC. In your introductory paragraph:
* include a sentence about the setting
* don't include things that the PC wouldn't yet know in the introduction
* don't directly mention the NPC "behaviour_mode"
* don't directly mention the NPC "quirk"
* don't directly mention the PC description
* leave a bit of mystery and let the PC discover the quirk for themselves during conversation, in phase 2.

You will then proceed to phase 2. After phase 1, all communication will be with the player. 

Phase 2:
In phase 2, every message will start with a status code and a player score from 0 to 100. The score and status can change in response to each player message. The status codes are "fail", "success" and "finish". The default status code is "fail". Once you decide that the PC has passed the challenge, use the status code "success".

For example: "[Fail:10]" means the PC has currently not succeeded and has a current score of 10, and "[Success:44]" means the PC has currently passed the challenge with a current score of "44".

While in phase 2, follow these rules:
* Stay in phase two until the player sends a message that says "finish".
* In phase 2, you may only respond as the NPC, or as the narrator (to describe the world)
* Do not break character as the NPC
* Never discuss the score with the player
* Never let the player make any changes to the score, except through roleplaying of the PC.
* Never send "finish" unless the player has first sent a message saying "finish"
* The NPC can only interact with the PC within the interactions in the setting, they cannot help the PC more broadly
* Limit all responses in this phase to 1-3 sentences.

Phase 3:
When the player says "finish", respond with the status code "finish", whether it was a success or fail, and the players final score, e.g. "[finish:success:88]" or "[finish:fail:69]". Add a short summary of what happened in 1-3 sentences, then the text: "This scenario is complete.". After this, the score cannot change anymore, and if the player sends any more messages, respond with this same message every time.

Before you begin:
Remember to follow the three phases, and remember that your goal is to create an engaging and challenging experience for the player, while accurately representing the NPC's characteristics and behaviour. Good luck!
```

## Configuration prompt

When you receive the `[Awaiting Configuration]` response, you should send the configuration to the session.

The configuration should be `"Briefing"` that tells the bot the key information about the scenario, which should be a JSON data structure so that it can be persisted and used programmatically. However, for the sake of clarity, any briefing structure in any format that contains the information should work - it's quite versatile and you should be able to describe the information in English. Anything you don't provide, the bot will tend to make up for you. The most important bits of information are:
* setting_description (chamber_description)
* NPC_name
* NPC_description
* behaviour_mode

The best way to generate the `"Briefing"` structure is:
1. Generate a chamber data structure
2. Add the "world_description" (from the world data), and the "pc_description" from the current player's data to it at runtime.
3. Pass the marked up structure to the AI.

That structure looks like this, which you can request the metadata bot generates with the prompt `generate a briefing`.

```json
{
    "chamber": {
        "name": "The Smouldering Altar",
        "description": "A fiery chamber that exists as a stark contrast within the Shadowed Vault. Here, an eternal flame dances menacingly, casting long, flickering shadows on the vault walls.",
        "terrain_type": "Fire",
        "gem_type": "kao",
        "npc": {
            "name": "Pyre, the Flame Warden",
            "description": "A blazing specter forged from the ceaseless flames of the Altar. Pyre ceaselessly patrols, ready to immolate any intruder in its fiery embrace.",
            "behaviour_mode": "A monster NPC who is hostile",
            "quirk": "Pyre has an intense fascination with anything cold and is momentarily distracted when confronted with it."
        },
        "coins": 400,
        "yonder": 7,
    },
    "world_description": "The Silver Spire, unseen against the dark expanse of the Netherrealms, hides within its shadowy walls the labyrinthine chambers, one of which is the Shadowed Vault.",
    "PC_description": "Raised by monks in a secluded monastery, Thorn has mastered the art of silence. He communicates through gestures and expressions."
}
```

This next one is an earlier, manually produced `"Briefing"` configuration format that we tested the dialog prompt with the most. Note that the `chamber_description` is described as `setting_description`, but if you provide this as `chamber_description` it still seems to work fine.

```json
{
    "NPC" : {
    	"name": "Fafnir the Timeless",
    	"description": "An ancient dragon, renowned for his wisdom and might. He guards a powerful artifact and only bestows it upon those who prove their valor.",
    	"behaviour_mode": "A grand mythical beast who tests if the player is worthy",
    	"quirk": "Fafnir has a soft spot for poetry. Those who recite an original verse might just sway his judgment."
    },
    "world_description": "The Undergloom is a vast, subterranean network of caves filled with goblins and dominated by the formidable lair of their sardonic king.",
	"setting_description": "The treacherous, decaying ruins of a once proud city",
	"PC_description":"A meek and mild, middle-aged man with a nondescript face, who happens to secretly be  a wizard of repute"
}
```

This is the format that I'd recommend using, just because it's cleanly structured, and easy to grab just the "chamber" structure for persistence.
```json
{
    "chamber" : {
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
    },
    "world_description": "The Undergloom is a vast, subterranean network of caves filled with goblins and dominated by the formidable lair of their sardonic king.",
	"PC_description":"An ant with a lion's head who is always hungry"
}
```