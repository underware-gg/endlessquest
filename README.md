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

* Mataleone @rsodre
* Recipromancer @rob_morris
* Mentis @Mentis123


# Repo Structure

external dependencies:

* @lattice packages
* Endless Crawler [mainnet contracts](https://etherscan.io/address/0x8e70b94c57b0cbc9807c0f58bc251f4cd96acdb0#code)
* Endless Crawler [mainnet contracts](https://etherscan.io/address/0x8e70b94c57b0cbc9807c0f58bc251f4cd96acdb0#code)


## `MUD`

A React MUD engine

### Run local server

You need Foundry! (see below)

```
$ pnpm run dev
```

### OpenAI API Keys

OpenAI API keys enabled for `GPT-4` need to be on cookies. The first time the app is loaded on a browser, empty cookies will be created for editing, if they are not present.

```
OPENAI_API_KEY:<api_key>
OPENAI_ORG_ID:<org_id>
```



### How MUD was installed (FYI)

Install [Node.js 18](https://nodejs.org/en/download)

```
$ node --version
v18.16.0
```

Install [Foundry](https://github.com/foundry-rs) ([docs](https://book.getfoundry.sh/getting-started/installation))

```
$ brew install libusb
$ curl -L https://foundry.paradigm.xyz | bash
# restart the terminal or open a new one
$ foundryup
```

Created with...

```
$ node --version
v18.16.0
$ npm install -g pnpm
$ pnpm create mud@canary MUD
? Template
> react
```

## `MUD2`

A Phaser MUD engine

Created with...

```
$ pnpm create mud@canary MUD
? Template
> phaser
```


