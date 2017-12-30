'use strict'

const log = require('fancy-log')

class SlackBot {
  constructor({ web, rtm, team, rooms, confluenceResolver, jiraResolver, confluencePostman, jiraPostman }) {
    this.startedAt = (new Date()).getTime()
    this.web = web
    this.rtm = rtm
    this.domain = team
    this.confluenceResolver = confluenceResolver
    this.jiraResolver = jiraResolver
    this.confluencePostman = confluencePostman
    this.jiraPostman = jiraPostman
    this.rooms = rooms
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
      await Promise.all([
        this.processConfluence({ message, channel }),
        this.processJira({ message, channel }),
      ])
    } catch (e) {
      log.error(e)
    }
  }

  async processConfluence({ message, channel }) {
    const confluenceContents = await this.confluenceResolver.resolve({ text: message.text, slackDomain: this.domain, slackChannel: channel })
    const postMessages = confluenceContents
      .map(content => `<${content.url}|${content.title}>`)
      .filter(postMessage => !!postMessage)

    if (postMessages.length === 0) return
    await this.confluencePostman.post(message.channel, postMessages.join('\n'))
  }

  async processJira({ message, channel }) {
    const jiraIssues = await this.jiraResolver.resolve({ text: message.text, slackDomain: this.domain, slackChannel: channel })
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
    await this.jiraPostman.post(message.channel, postMessages.join('\n'))
  }
}

module.exports = SlackBot
