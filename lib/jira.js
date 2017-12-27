'use strict'

const { resolve } = require('url')

const { get } = require('lodash')
const got = require('got')

class Jira {
  constructor({ atlassian }) {
    this.atlassian = atlassian
  }

  async fetchIssue(issueIdOrKey) {
    const restUrl = resolve(this.atlassian.baseUrl, `/rest/api/2/issue/${issueIdOrKey}`)
    const { body } = await got(restUrl, {
      headers: this.atlassian.headers,
      json: true,
    })

    const id = body.id
    const key = body.key
    const projectKey = get(body, 'fields.project.key')
    const summary = get(body, 'fields.summary')
    const assignee = get(body, 'fields.assignee.displayName', null)
    const status = get(body, 'fields.status.name')
    const url = resolve(this.atlassian.baseUrl, `browse/${key}`)

    if (!id || !key || !projectKey || !summary || !status) return null
    return { id, key, projectKey, summary, assignee, status, url }
  }
}

module.exports = Jira
