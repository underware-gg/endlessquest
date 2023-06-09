// @ts-ignore
export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj))

// @ts-ignore
export const getPrimitive = (value) => {
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  switch (typeof value) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'object':
      return 'object'
    default:
      throw new Error(`Unsupported type: ${typeof value}`)
  }
}

// @ts-ignore
export const getPaths = (type, paths = [], path = []) => {
  let currentPrimitive = getPrimitive(type)

  if (currentPrimitive === 'string') {
    paths.push(deepCopy(path))
    return paths
  }

  if (currentPrimitive === 'object') {
    paths.push(deepCopy(path))

    for (const key in type) {
      const newPath = deepCopy(path)
      newPath.push(key)
      getPaths(type[key], paths, newPath)
    }

    return paths
  }

  if (currentPrimitive === 'array') {
    paths.push(deepCopy(path))

    for (let i = 0; i < type.length; i++) {
      const newPath = deepCopy(path)
      newPath.push(i)
      getPaths(type[i], paths, newPath)
    }

    return paths
  }

  throw new Error(`Unsupported type def: ${currentPrimitive}`)
}

// @ts-ignore
export const getIndices = (paths) => {
  const indices = {}

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    const pathString = `/${path.join('.')}`
    // @ts-ignore
    indices[pathString] = i
  }

  return indices
}

// @ts-ignore
export const getParentIndices = (indices, paths) => {
  const parentIndices = []

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    const parentPathIndices = []
    for (let j = path.length - 1; j > -1; j--) {
      const parentPath = path.slice(0, j)
      const parentPathString = `/${parentPath.join('.')}`
      const parentPathIndex = indices[parentPathString]
      parentPathIndices.push(parentPathIndex)
    }
    parentIndices.push(parentPathIndices)
  }

  return parentIndices
}

// @ts-ignore
export const getNestedChildIndices = (paths, parentIndices) => {
  const childIndices = []

  for (let i = 0; i < paths.length; i++) {
    childIndices.push([])
  }

  for (let i = 0; i < parentIndices.length; i++) {
    const parentIndex = parentIndices[i]
    for (let j = 0; j < parentIndex.length; j++) {
      const parent = parentIndex[j]
      // @ts-ignore
      childIndices[parent].push(i)
    }
  }

  return childIndices
}

// @ts-ignore
export const createTypeMetadata = (type) => {
  const paths = getPaths(type)
  const indices = getIndices(paths)
  const parentIndices = getParentIndices(indices, paths)
  const childIndices = getNestedChildIndices(paths, parentIndices)

  return {
    paths,
    indices,
    parentIndices,
    childIndices,
  }
}

//---------------------------------
// transient data types
// no need to persist between sessions
//

export const player = {
  position: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
  rotation: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
}

export const editor = {
  position: {
    x: 'number',
    y: 'number',
  },
  interacting: 'boolean',
}


//---------------------------------
// persistent data types
// 

// key: agentId or profileId (nanoid)
export const profile = {
  name: 'string',
  spritesheet: 'string',
  blob: 'string', // custom spritesheet (unused)
  view3d: 'boolean',
  signed: 'boolean', // if signed, the key is a profileId linked to a wallet address with a wallet type
}

// key: wallet address (0x0a1b2c3d...)
export const wallet = {
  walletType: 'string', // 'Verida', 'Ethereum', ...
  profileId: 'string',
}

// key: 'world'
export const settings = {
  timestamp: 'number',
  entry: { // default entry tile
    x: 'number',
    y: 'number',
  },
}

// key: 'world'
// deprecated! we're using map2 now
export const map = [
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
]

// key: 'world'
export const map2 = [
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
]

// key: 'world'
export const tileset = {
  name: 'string',
  blob: 'string',
  size: {
    width: 'number',
    height: 'number',
  },
}

// key: portal id (nanoid)
export const portal = {
  position: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
  slug: 'string',
  tile: {
    x: 'number',
    y: 'number',
  },
}

// key: screen id (nanoid)
export const screen = {
  name: 'string',
  type: 'string',
  content: 'string',
  page: 'number',   // page, slide, item, scroll position, etc, but value range is always 0 to 1
  position: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
  rotation: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
}

// key: 'world' or document id (nanoid)
export const permission = {
  id: 'string',       // document id
  owner: 'string',    // owner address
  visible: 'boolean', // anyone can view
  public: 'boolean',  // anyone can edit
}

// key: trigger id (nanoid)
export const trigger = {
  name: 'string',
  state: 'number',
  data: 'string', // serialized json
  position: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
}

// generic document
// key: 'chat', or any document id
export const document = {
  content: 'string',
}

//---------------------------------
// Endless Quest
//

// key: 'number', the Realm nunmber
export const questRealm = {
  metadata: 'string',
  artUrl: 'string',
  name: 'string',
  description: 'description',
}
// key: 'chamberSlug', like N1E1, S1W1, etc
export const questChamber = {
  metadata: 'string',
  artUrl: 'string',
  name: 'string',
  description: 'description',
}
// key: 'chamberSlug', like N1E1, S1W1, etc
export const questAgent = {
  metadata: 'string',
  artUrl: 'string',
  name: 'string',
  description: 'description',
}
// key: 'timestamp', from Date.now()
export const questMessages = {
  realm: 'number',    // realm number > questRealm
  chamber: 'string',  // chamber slug > questChamber, questAgent
  player: 'string',   // player wallet address on MUD
  messages: 'string', // serialized OpenAI messages array
}


//---------------------------------
// deprecated
//
// key: book id (nanoid)
export const book = {
  position: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
  text: 'string',
}


//---------------------------------
// deprecated
//
export const typeDefs = {
  // transient
  player: createTypeMetadata(player),
  editor: createTypeMetadata(editor),
  // persistent
  profile: createTypeMetadata(profile),
  wallet: createTypeMetadata(wallet),
  settings: createTypeMetadata(settings),
  map2: createTypeMetadata(map2),
  portal: createTypeMetadata(portal),
  tileset: createTypeMetadata(tileset),
  screen: createTypeMetadata(screen),
  permission: createTypeMetadata(permission),
  trigger: createTypeMetadata(trigger),
  document: createTypeMetadata(document),
  // endless quest
  questRealm: createTypeMetadata(questRealm),
  questChamber: createTypeMetadata(questChamber),
  questAgent: createTypeMetadata(questAgent),
  questMessages: createTypeMetadata(questMessages),
  // deprecated
  map: createTypeMetadata(map),
  book: createTypeMetadata(book),
}
