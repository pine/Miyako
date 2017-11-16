'use strict'

const { resolve } = require('url')

const cookie = require('cookie')
const execall = require('execall')
const got = require('got')

class JiraResolver {
  constructor({ jira, projectKeys }) {
    this.jira = jira
    this.pattern = projectKeys.length == 0 ?
      null : new RegExp('(?:^|\\s|\\/|\\,|\\()((?:' + projectKeys.join('|') + ')\\-[0-9]+)(?=$|\\s|\\/|\\,|\\))', 'g')
  }

  resolve(text) {
    if (!this.pattern) return []

    const matches = execall(this.pattern, text)
    console.log(matches)
  }
}

module.exports = JiraResolver
