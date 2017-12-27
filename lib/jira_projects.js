'use strict'

const _ = require('lodash')

class JiraProjects {
  constructor(projects) {
    this.projects = projects
    this.projectKeys = _(projects).map(project => project.jira.keys).flatten().uniq().value()
    this.isBound = _.memoize(this._isBound, ({ jiraKey, slackDomain, slackChannel }) => {
      return [ jiraKey, slackDomain, slackChannel ].join(':')
    })
  }

  _isBound({ jiraKey, slackDomain, slackChannel }) {
    for (let project of this.projects) {
      const jiraKeyOk = project.jira.keys.includes(jiraKey)
      if (!jiraKeyOk) continue

      for (let slackTeam of project.slackTeams) {
        const slackDomainOk = slackTeam.domain === slackDomain
        const slackChannelOk = slackTeam.channels.includes(slackChannel)
        if (slackDomainOk && slackChannelOk) return true
      }
    }

    return false
  }
}

module.exports = JiraProjects
