# autonomousworlds-hack

Repo for the [Autonomous Worlds Hackaton](https://ethglobal.com/events/autonomous)

May 18th to 26th 2023

### Team:

* Mataleone
* Recipromancer
* Chromuh
* Mentis


# Repo Structure

## `MUD`

The actual MUD engine

external dependencies:

* @lattice packages
* Endless Crawler [mainnet contracts](https://etherscan.io/address/0x8e70b94c57b0cbc9807c0f58bc251f4cd96acdb0#code)


### Run local server

You need Foundry! (see below)

```
$ pnpm run dev
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

MUD created with...

```
$ node --version
v18.16.0
$ npm install -g pnpm
$ pnpm create mud@canary MUD
```



