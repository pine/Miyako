'use strict'

const log = require('fancy-log')

class SlackBot {
  constructor({ web, rtm, team, confluenceResolver, jiraResolver, rooms, username, iconUrl }) {
    this.startedAt = (new Date()).getTime()
    this.web = web
    this.rtm = rtm
    this.domain = team
    this.confluenceResolver = confluenceResolver
    this.jiraResolver = jiraResolver
    this.rooms = rooms
    this.username = username
    this.iconUrl = iconUrl
  }

  listen() {
    log(`${this.domain} -> listening`)
    this.rtm.start()
    this.rtm.on('authenticated', this.onAuthenticated.bind(this))
    this.rtm.on('message', this.onMessage.bind(this))
  }

  async onAuthenticated(message) {
    log(`${this.domain} -> authenticated`)

    try {
      const teamInfo = await this.web.team.info()
      delete teamInfo['team']['icon']
      log(`${this.domain} -> ${JSON.stringify(teamInfo.team)}`)
    } catch (e) {
      log.error(e)
    }
  }

  async onMessage(message) {
    try {
      const ts = parseFloat(message.ts) * 1000

      if (this.startedAt > ts) return
      if (typeof message.subtype === 'string' && message.subtype.indexOf('bot') > -1) return

      const channel = this.rooms.resolve(message.channel)
      const jiraIssues = await this.jiraResolver.resolve({
        text: message.text,
        slackDomain: this.domain,
        slackChannel: channel,
      })
      const postMessages = jiraIssues
        .map(issue => {
          try {
            let postMessage = `[${issue.status}] <${issue.url}|${issue.key}> ${issue.summary}`
            if (issue.assignee) postMessage += ` (${issue.assignee})`
            return postMessage
          } catch (e) {
            log.error(e)
          }
        })
        .filter(postMessage => !!postMessage)

      if (postMessages.length === 0) return

      await this.web.chat.postMessage(message.channel, postMessages.join('\n'), {
        username: this.username,
        icon_url: this.iconUrl,
      })
    } catch (e) {
      log.error(e)
    }
  }
}

module.exports = SlackBot
