'use strict'

const log = require('fancy-log')

class SlackPostman {
  constructor({ web, botUser }) {
    this.web = web
    this.botUser = botUser
  }

  async post(channel, threadTs, text) {
    await this.web.chat.postMessage({
      channel,
      text,
      username: this.botUser.username,
      icon_url: this.botUser.iconUrl,
      thread_ts: threadTs,
      reply_broadcast: false,
    })
  }
}

module.exports = SlackPostman
