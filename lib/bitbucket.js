'use strict'

const got = require('got')
const { get } = require('lodash')
const { URL } = require('url')
const urlJoin = require('url-join')

class Bitbucket {
  constructor({ username, password }) {
    this.username = username
    this.password = password
    this.baseUrl = `https://${username}:${password}@api.bitbucket.org/2.0/`
  }

  async fetchRepo({ username, slug }) {
    const restUrl = urlJoin(this.baseUrl, `/repositories/${username}/${slug}`)
    const { body } = await got(new URL(restUrl), { json: true })

    const name = body.name
    const language = body.language
    const projectKey = get(body, 'project.key')
    const projectName = get(body, 'project.name')
    if (!name || !projectKey || !projectName) return null
    return { slug, name, language, projectKey, projectName }
  }
}

module.exports = Bitbucket
