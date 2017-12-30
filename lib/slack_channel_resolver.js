'use strict'

const log = require('fancy-log')
const _ = require('lodash')
const promiseRetry = require('promise-retry')
const thenify = require('thenify')

class SlackChannelResolver {
  constructor({ domain, web, refresh }) {
    this.domain = domain
    this.web = web
    this.rooms = []
    this.progress = false
    this.initialized = false
    this.timerId = setInterval(() => this.sync(), refresh)
  }

  resolve(id) {
    if (!this.initialized) throw new Error('Slack channels is not initialized')
    return _.get(this.rooms.find(room => room.id === id), 'name')
  }

  async sync() {
    if (this.progress) {
      log(`${this.domain}'s channels have already started synchronizing`)
      return Promise.resolve()
    }
    this.progress = true

    this.rooms = await promiseRetry(() => this._fetch())

    log(`${this.domain} -> synchronized`)
    this.progress = false
    this.initialized = true
  }

  async _fetch() {
    const { channels } = await this.web.channels.list()
    const { groups } = await this.web.groups.list()
    return channels.concat(groups)
  }
}

module.exports = SlackChannelResolver
