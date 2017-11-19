'use strict'

const { resolve } = require('url')

const cookie = require('cookie')
const execall = require('execall')
const log = require('fancy-log')
const got = require('got')
const promiseRetry = require('promise-retry')

class JiraResolver {
  constructor({ jira, projectKeys }) {
    this.jira = jira
    this.pattern = projectKeys.length == 0 ?
      null : new RegExp('(?:^|\\s|\\/|\\,|\\()((?:' + projectKeys.join('|') + ')\\-[0-9]+)(?=$|\\s|\\/|\\,|\\))', 'g')
  }

  resolve(text) {
    if (!this.pattern) return []

    const matches = execall(this.pattern, text)
    const issueIdOrKeys = matches.map(matched => matched.sub[0])
    const issues = issueIdOrKeys
      .map(async issueIdOrKey => {
        try {
          return await promiseRetry(() => this.jira.fetchIssue(issueIdOrKey))
        } catch (e) { log.error(e) }
        return null
      })

    return issues
  }
}

module.exports = JiraResolver
