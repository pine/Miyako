'use strict'

const { resolve } = require('url')

const cookie = require('cookie')
const got = require('got')

class JIRA {
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

    return {
      id: body.id,
      key: body.key,
      summary: body.fields.summary,
      assignee: body.fields.assignee.displayName,
      status: body.fields.status.name,
    }
  }
}

module.exports = JIRA
