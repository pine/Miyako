'use strict'

const log = require('fancy-log')

class SlackBot {
  constructor({ web, rtm, team, map, resolver, rooms, username, iconUrl }) {
    this.startedAt = (new Date()).getTime()
    this.web = web
    this.rtm = rtm
    this.team = team
    this.map = map
    this.resolver = resolver
    this.rooms = rooms
    this.username = username
    this.iconUrl = iconUrl
  }

  listen() {
    log(`${this.team} -> listening`)
    this.rtm.start()
    this.rtm.on('authenticated', this.onAuthenticated.bind(this))
    this.rtm.on('message', this.onMessage.bind(this))
  }

  async onAuthenticated(message) {
    log(`${this.team} -> authenticated`)

    try {
      const teamInfo = await this.web.team.info()
      delete teamInfo['team']['icon']
      log(`${this.team} -> ${JSON.stringify(teamInfo.team)}`)
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

      const issues = await this.resolver.resolve(message.text)
      const room = this.rooms.findById(channel)
      const postMessages = issues
        .map(issue => {
          try {
            if (!this.map.isBound(issue.projectKey, this.team, room.name)) return

            let postMessage = `[${issue.status}] <${issue.url}|${issue.key}> ${issue.summary}`
            if (issue.assignee) postMessage += ` (${issue.assignee})`

            return postMessage
          } catch (e) {
            log.error(e)
          }
        })
        .filter(postMessage => !!postMessage)

      if (postMessages.length === 0) return

      await this.web.chat.postMessage(channel, postMessages.join('\n'), {
        username: this.username,
        icon_url: this.iconUrl,
      })
    } catch (e) {
      log.error(e)
    }
  }
}

module.exports = SlackBot
