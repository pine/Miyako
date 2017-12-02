'use strict'

const promiseRetry = require('promise-retry')
const thenify = require('thenify')
const log = require('fancy-log')

class SlackRoomList {
  constructor({ web, refresh }) {
    this.web = web
    this.rooms = []
    this.progress = false
    this.initialized = false
    this.timerId = setInterval(() => this.sync(), refresh)
  }

  findById(id) {
    if (!this.initialized) throw new Error('Slack room list is not initialized')
    return this.rooms.find(room => room.id === id)
  }

  async sync() {
    log('Syncing rooms ...')

    if (this.progress) {
      log('Already syncing rooms started')
      return Promise.resolve()
    }
    this.progress = true

    this.rooms = await promiseRetry(() => this._fetch())

    log('Synced rooms')
    this.progress = false
    this.initialized = true
  }

  async _fetch() {
    const { channels } = await this.web.channels.list()
    const { groups } = await this.web.groups.list()
    return channels.concat(groups)
  }
}

module.exports = SlackRoomList
