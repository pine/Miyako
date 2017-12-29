'use strict'

const log = require('fancy-log')

class SlackPostman {
  constructor({ web, botUser }) {
    this.web = web
    this.botUser = botUser
  }

  async post(channelId, message) {
    await this.web.chat.postMessage(channelId, message, {
      username: this.botUser.username,
      icon_url: this.botUser.iconUrl,
    })
  }
}

module.exports = SlackPostman
