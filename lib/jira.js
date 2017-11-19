'use strict'

const { resolve } = require('url')

const cookie = require('cookie')
const get = require('lodash.get')
const got = require('got')

class Jira {
  constructor({ session, baseUrl }) {
    this.session = session
    this.baseUrl = baseUrl
  }

  async fetchIssue(issueIdOrKey) {
    const url = resolve(this.baseUrl, `/rest/api/2/issue/${issueIdOrKey}`)
    const { body } = await got(url, {
      headers: {
        cookie: cookie.serialize(this.session.name, this.session.value),
      },
      json: true,
    })

    const id = body.id
    const key = body.key
    const summary = get(body, 'fields.summary')
    const assignee = get(body, 'fields.assignee.displayName', null)
    const status = get(body, 'fields.status.name')

    if (!id || !key || !summary || !status) return null
    return { id, key, summary, assignee, status }
  }
}

module.exports = Jira
