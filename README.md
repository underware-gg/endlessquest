# Endless Quest

```
  ______     __   __     _____     __         ______     ______     ______    
 /\  ___\   /\ "-.\ \   /\  __-.  /\ \       /\  ___\   /\  ___\   /\  ___\   
 \ \  __\   \ \ \-.  \  \ \ \/\ \ \ \ \____  \ \  __\   \ \___  \  \ \___  \  
  \ \_____\  \ \_\\"\_\  \ \____-  \ \_____\  \ \_____\  \/\_____\  \/\_____\ 
   \/_____/   \/_/ \/_/   \/____/   \/_____/   \/_____/   \/_____/   \/_____/ 
      ______     __  __     ______     ______     ______  
     /\  __ \   /\ \/\ \   /\  ___\   /\  ___\   /\__  _\         |v0.1.0 
     \ \ \/\_\  \ \ \_\ \  \ \  __\   \ \___  \  \/_/\ \/         |
      \ \___\_\  \ \_____\  \ \_____\  \/\_____\    \ \_\     _  _|_  _
       \/___/_/   \/_____/   \/_____/   \/_____/     \/_/    |;|_|;|_|;|
                                                             \\.    .  /
                          An infinite multiverse of           \\:  .  /
        \,/               persistent and generative            ||:   |
                          fantastical dream worlds,       \,/  ||:.  |
                /`\       each populated by endless            ||:  .|
                          & thematically consistent            ||:   |
                          fantasy destinations, and   /`\      ||: , |
                          an intruiguing population            ||:   |
                          of strange and marvellous            ||: . |
             _____        beings, all AI generated!           _||_   |
      ____--`     '-~~_                                  __---`   ~`--,__
 ~-~-~                  `~~----__-~,.-`~~--~^~~--.__,--~'      fDm       `~~
```

> What has happened to me? The last thing that I remember, I went to sleep just like any other night.  
> Now I'm here in this strange place, wherever this is. This feels like a dream, but I can't wake up.  
> There are others here too. Dangerous beasts, perplexing living rooms, tricksters, lost souls and...  
> The lord of this realm. They all seem bound to this place, but I'm not. I've got to get out of here  

A love letter to the [Autonomous Worlds Hackaton](https://ethglobal.com/events/autonomous), May 18th to 26th 2023.

## About

*Endless Quest* is an endless, generative roleplaying game, in which you play a traveller lost in the infinite
realms of the dreaming. As you travel through each realm, you will discover infinite unique locations and the
lost souls bound to them; no two alike. Each location and character that you meet in Endless Quest is unique,
and indeed, each of its many realms is generated - in its entirety - dynamically by an AI storyteller.

Each realm generates endless unique locations and characters that are thematically consistent, from one of four
sub themes and eight different kinds of encounters, that are unique to that realm. Locations and characters are
generated once only, the first time that they are discovered, after which they are persisted permanently on-chain.

Once a location has been generated it will remain, however each traveller visits will be a unique, story driven
experience, powered by the AI storyteller.

## Team:

* Mataleone [@rsodre](https://github.com/rsodre)
* Recipromancer [@Rob-Morris](https://github.com/Rob-Morris)
* Mentis [@Mentis123](https://github.com/Mentis123)
* The amazing art of [PixiVan](https://pixivan.itch.io/)

![Endless Quest](Assets/screenshots/screenshot2.png)
more [screenshots](Assets/screenshots/)


## Made with...

* Lattice [MUD](https://github.com/latticexyz/mud)
* [Endless Crawler](https://endlesscrawler.io/) chambers from mainnet [contracts](https://etherscan.io/address/0x8e70b94c57b0cbc9807c0f58bc251f4cd96acdb0#code)
* [OpenAI API](https://platform.openai.com/docs)
* [wagmi](https://wagmi.sh/)


# Repo Structure

## `MUD2`

A Phaser MUD engine

### Setting up a local server

Install [Node.js 16+](https://nodejs.org/en/download) (we use version 18)

* Install pnpm

```shell
$ npm install --global pnpm
```

* Install [Foundry](https://github.com/foundry-rs) ([docs](https://book.getfoundry.sh/getting-started/installation))

```shell
$ brew install libusb
$ curl -L https://foundry.paradigm.xyz | bash
# restart the terminal or open a new one
$ foundryup
```

* Do this setup...

Edit `MUD2/env.contracts` if you want to use your own Anvil private key.

```shell
$ cd MUD2
$ pnpm install
$ pnpm initialize
$ cp env.contracts packages/contracts/.env
```

### Start local server

```shell
$ pnpm run dev
```


#### OpenAI API Keys

OpenAI API keys enabled for `GPT-4` need to be on cookies. The first time the app is loaded on a browser, empty cookies will be created for editing, if they are not present.

|cookie |value|
|-----|--------|
| `OPENAI_API_KEY` | `<api_key>` |
| `OPENAI_ORG_ID`  | `<org_id>` |


## MUD development notes

### Install a fresh MUD game

According to [getting-started](https://mud.dev/quick-start)

Need Node 18 and Foundry (see above)

```shell
$ npm install -g pnpm
$ pnpm create mud@canary MUD
? Template
> phaser
```

### Upgrade MUD

Check latest version [here](https://www.npmjs.com/package/@latticexyz/cli?activeTab=versions)

```shell
$ cd MUD2
$ pnpm mud set-version -v 2.0.0-alpha.1.197
$ pnpm mud:up
```

Or manually...

```shell
$ cd MUD2
$ pnpm mud set-version -v 2.0.0-alpha.1.197
$ cd packages/client
$ pnpm mud set-version -v 2.0.0-alpha.1.197
$ cd -
$ cd packages/contracts
$ pnpm mud set-version -v 2.0.0-alpha.1.197
$ cd -
$ pnpm install
```

### Deploy MUD

(not tested)

```
$ pnpm deploy:testnet in contracts
> chainId 4242

```



