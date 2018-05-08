'use strict'

const cookie = require('cookie')
const execall = require('execall')
const log = require('fancy-log')
const got = require('got')
const { uniq } = require('lodash')
const promiseRetry = require('promise-retry')

class JiraResolver {
  constructor({ jira, jiraProjects }) {
    this.jira = jira
    this.jiraProjects = jiraProjects

    const pattern = '(?:^|[^A-Za-z0-9-]|\\s)((?:' +
      jiraProjects.projectKeys.join('|') + ')\\-[0-9]+)(?=$|[^0-9]|\\s)'
    this.regex = jiraProjects.projectKeys.length == 0 ? null : new RegExp(pattern, 'g')
  }

  async resolve({ text, slackDomain, slackChannel }) {
    if (!this.regex) return []

    const matches = execall(this.regex, text)
    const issueIdOrKeys = uniq(matches.map(matched => matched.sub[0]))
    const issuePromises = issueIdOrKeys
      .filter(issueIdOrKey => {
        const jiraKey = issueIdOrKey.slice(0, issueIdOrKey.indexOf('-'))
        return this.jiraProjects.isBound({ jiraKey, slackDomain, slackChannel })
      })
      .map(async issueIdOrKey => {
        try {
          return await promiseRetry(() => this.jira.fetchIssue(issueIdOrKey))
        } catch (e) {
          log.error(`${issueIdOrKey} -> ${e}`)
        }
      })
    return (await Promise.all(issuePromises)).filter(v => !!v)
  }
}

module.exports = JiraResolver
