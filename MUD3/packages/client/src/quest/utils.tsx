import { Entity } from "@latticexyz/recs"

export const agentToCoord = async (storeCache: { tables: { Agent: { get: (arg0: { key: Entity }) => any } } }, agentEntity: Entity) => {
  const agent = await storeCache.tables.Agent.get({ key: agentEntity })
  return agent ? BigInt(agent.coord) : null
}


//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

type Func = () => Promise<any>
type Task = {
  func: Func,
  funcName: string,
}

export class Queue {
  name: string
  interval: number
  queue: Task[]

  constructor(interval: number, name: string) {
    this.name = name
    this.interval = interval
    this.queue = []
  }

  async start() {
    // console.log(`Queue [${this.name}] start... (${this.queue.length})`)
    const task = this.queue.shift()
    if (task) {
      const pos = this.queue.length
      console.log(`Queue [${this.name}][${task.funcName}] running... (${pos})`)
      // await fn() // failed transactions can lock the queue
      task.func().then((value) => {
        // console.log(`Queue [${this.name}][${task.funcName}] ok (${pos})`)
      }).catch((err) => {
        // console.log(`Queue [${this.name}][${task.funcName}] ERROR (${pos})`, err)
      });
    }
    const that = this
    // console.log(`Queue [${this.name}] timeout... (${this.queue.length})`)
    setTimeout(function () {
      that.start()
    }, this.interval)
  }

  push(func: Func, funcName: string = '') {
    this.queue.push({ func, funcName })
    console.log(`Queue [${this.name}][${funcName}] push... (${this.queue.length})`)
  }
}
