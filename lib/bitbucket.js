'use strict'

const got = require('got')
const { get } = require('lodash')
const { URL } = require('url')
const urlJoin = require('url-join')

class Bitbucket {
  constructor({ team, username, password }) {
    this.team = team
    this.username = username
    this.password = password
    this.endpoint = `https://${username}:${password}@api.bitbucket.org/2.0/`
    this.baseUrl = 'https://bitbucket.org/'
    this.teamUrl = urlJoin(this.baseUrl, team)
    this.escapedTeamUrl = this.baseUrl.replace(/\./g, '\\.').replace(/\:/g, '\\:').replace(/\-/g, '\\-')
  }

  async fetchRepo({ username, slug }) {
    const restUrl = urlJoin(this.endpoint, `/repositories/${username}/${slug}`)
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
