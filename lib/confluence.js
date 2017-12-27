'use strict'

const { resolve } = require('url')

const { get } = require('lodash')
const got = require('got')

class Confluence {
  constructor({ atlassian }) {
    this.atlassian = atlassian
  }

  async resolveContent(contentId) {
    const restUrl = resolve(this.atlassian.baseUrl, `/wiki/rest/api/content/${contentId}`)
    const { body } = await got(restUrl, {
      headers: this.atlassian.headers,
      json: true,
    })

    const id = body.id
    const title = body.title
    const spaceKey = get(body, 'space.key')
    const url = get(body, '_links.self')

    if (!id || !title || !spaceKey || !url) return null
    return { id, title, spaceKey, url }
  }
}

module.exports = Confluence
