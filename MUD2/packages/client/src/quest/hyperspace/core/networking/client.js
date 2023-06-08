import EventEmitter from 'events'
import { encode, decode } from 'messagepack'
import { createMessage } from '../merge/messages'
import { throttle } from '../utils'
import KernalChanges from '../merge/kernal-changes'

const isBrowser = typeof window !== 'undefined'

const RECONNECT_TIMEOUT = 10000
const PING_PERIOD = 4000
const PONG_TIMEOUT = 7000
const SEND_RATE = 33.333

class Client extends EventEmitter {
  // @ts-ignore
	constructor(options, kernal) {
		super()
    this.options = options
		this.kernal = kernal
		this.changes = new KernalChanges()
    // @ts-ignore
    this.messages = []
		this.connection = isBrowser ? this.createConnection() : null

		this.sendMessagesThrottled = throttle(() => {
			this.sendMessages()
		}, SEND_RATE)

    this.setMaxListeners(20)

		this.heartbeat()
	}

  shutdown = () => {
    this.disconnect()
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout)
    if (this.handleCloseTimeout) clearTimeout(this.handleCloseTimeout)
    if (this.handleErrorTimeout) clearTimeout(this.handleErrorTimeout)
  }

  disconnect = () => {
    this.connection?.removeEventListener('message', this.handleMessage)
    this.connection?.removeEventListener('open', this.handleOpen)
    this.connection?.removeEventListener('close', this.handleClose)
    this.connection?.removeEventListener('error', this.handleError)
    this.connection?.close()
    this.connection = null
  }

  // @ts-ignore
	handleMessage = (event) => {
		const message = decode(event.data)

		// Does not need to be a pong.
		this.lastPong = Date.now()

		this.emit('message', message)
	}

  // @ts-ignore
	handleOpen = (event) => {
		this.emit('open', event)
	}

	// This should trigger the need to call sendMessages.
	// Part of send messages is to grab the changes data and turn them into a message.
  // @ts-ignore
	addOps(ops) {
		this.changes.addOps(ops)
		this.sendMessagesThrottled()
	}

	heartbeat = () => {
    // console.warn(`Client.ping()`, this.options.uri)
		this.addMessage(createMessage.ping())
		if (this.connection?.readyState === WebSocket.OPEN) {
      // @ts-ignore
			if (this.lastPong + PONG_TIMEOUT < Date.now()) {
				this.connection = this.createConnection()
			}
		}

    this.heartbeatTimeout = setTimeout(() => {
			this.heartbeat()
		}, PING_PERIOD)
	}

  // @ts-ignore
	handleClose = (event) => {
    console.warn(`Client.handleClose()...`, this.options.uri)
		this.emit('close', event)
    this.handleCloseTimeout = setTimeout(() => {
      console.warn(`Client.handleClose() RECONNECT`, this.options.uri)
			this.connection = this.createConnection()
		}, RECONNECT_TIMEOUT)
	}

  // @ts-ignore
	handleError = (event) => {
    console.warn(`Client.handleError()...`, this.options.uri)
		this.emit('error', event)
    this.handleErrorTimeout = setTimeout(() => {
      console.warn(`Client.handleError() RECONNECT`, this.options.uri)
			this.connection = this.createConnection()
		}, RECONNECT_TIMEOUT)
	}

	createConnection = () => {
    this.disconnect()
		const connection = new WebSocket(this.options.uri)
		connection.binaryType = 'arraybuffer'
		connection.addEventListener('message', this.handleMessage)
		connection.addEventListener('open', this.handleOpen)
		connection.addEventListener('close', this.handleClose)
		connection.addEventListener('error', this.handleError)
		this.messages = []
		return connection
	}

  // @ts-ignore
	addMessage(message) {
		this.messages.push(message)
		this.sendMessagesThrottled()
	}

	sendMessages() {
		const connection = this.connection
		if (connection?.readyState === WebSocket.OPEN) {
			this.messages.forEach((message) => {
				connection.send(encode(message))
			})

			const changes = this.changes.getChanges()
			const ops = this.kernal.getOpsFromChanges(changes)
			// Splitting out the ops from the messages causes things to be
			// out of order which isn't ideal... this should only be an issue
			// if those two things are dependent on each other.
			// I'll need to think about it more deeply.
			if (ops.length > 0) {
				const message = createMessage.patch(ops)
				connection.send(encode(message))
			}
		}
		this.messages = []
		this.changes.clearChanges()
	}
}

export {
  Client,
}
