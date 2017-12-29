'use strict'


const { get } = require('lodash')
const got = require('got')
const urlJoin = require('url-join')

class Confluence {
  constructor({ atlassian }) {
    this.atlassian = atlassian
    this.baseUrl = urlJoin(atlassian.baseUrl, '/wiki/')
    this.escapedBaseUrl = this.baseUrl.replace(/\./g, '\\.').replace(/\:/g, '\\:').replace(/\-/g, '\\-')
  }

  async fetchContent(contentId) {
    const restUrl = urlJoin(this.baseUrl, `/rest/api/content/${contentId}`)
    const { body } = await got(restUrl, {
      headers: this.atlassian.headers,
      json: true,
    })

    const id = body.id
    const title = body.title
    const spaceKey = get(body, 'space.key')
    const url = urlJoin(this.baseUrl, `spaces/${spaceKey}/pages/${id}`)

    if (!id || !title || !spaceKey || !url) return null
    return { id, title, spaceKey, url }
  }

  async fetchSpace(spaceKey) {
    const restUrl = urlJoin(this.baseUrl, `/rest/api/space/${spaceKey}`)
    const { body } = await got(restUrl, {
      headers: this.atlassian.headers,
      json: true,
    })

    const id = body.id
    const title = body.name
    const url = urlJoin(this.baseUrl, `spaces/${spaceKey}/overview`)

    if (!id || !title || !url) return null
    return { id, title, spaceKey, url }
  }
}

module.exports = Confluence
