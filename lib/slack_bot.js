'use strict'

const log = require('fancy-log')

class SlackBot {
  constructor({ web, rtm, resolver, rooms }) {
    this.startedAt = (new Date()).getTime()
    this.web = web
    this.rtm = rtm
    this.resolver = resolver
    this.rooms = rooms
  }

  listen() {
    log('Listening ...')
    this.rtm.start()
    this.rtm.on('authenticated', this.onAuthenticated.bind(this))
    this.rtm.on('message', this.onMessage.bind(this))
  }

  async onAuthenticated(message) {
    log('Connected')

    try {
      const teamInfo = await this.web.team.info()
      delete teamInfo['team']['icon']
      log('Team:', JSON.stringify(teamInfo))
    } catch (e) {
      log.error(e)
    }
  }

  async onMessage(message) {
    try {
      const channel = message.channel
      const ts = parseFloat(message.ts) * 1000

      if (this.startedAt > ts) return
      if (typeof message.subtype === 'string' && message.subtype.indexOf('bot') > -1) return
      log('Recevied', JSON.stringify(message))

      const issues = await this.resolver.resolve(message.text)
      const room = this.rooms.findById(channel)

      issues.forEach(async issuePromised => {
        try {
          const issue = await issuePromised
          if (!issue) return

          const postMessage = issue.assignee ?
            `[${issue.status}] ${issue.key} ${issue.summary} (${issue.assignee})` :
            `[${issue.status}] ${issue.key} ${issue.summary}`
          log('Resolved', postMessage)
          await this.web.chat.postMessage(channel, postMessage)
        } catch (e) {
          log.error(e)
        }
      })

      // if (_this.channels.length > 0) {
      //   if (!_this.channels.includes(room.name)) {
      //     log('Not targetted:', room.name)
      //     return
      //   }
      // }


      // log('Posted:', imageUrl)
    } catch (e) {
      log.error(e)
    }
	}
}

module.exports = SlackBot
