'use strict'

const cookie = require('cookie')
const execall = require('execall')
const log = require('fancy-log')
const got = require('got')
const { uniq } = require('lodash')
const promiseRetry = require('promise-retry')

class ConfluenceResolver {
  constructor({ confluence, confluenceSpaces }) {
    this.confluence = confluence
    this.confluenceSpaces = confluenceSpaces

    this.contentPattern = confluenceSpaces.spaceKeys.length == 0 ?  null :
      new RegExp(confluence.escapedBaseUrl + 'spaces/(' + confluenceSpaces.spaceKeys.join('|') + ')/pages/([0-9]+)(?=$|[^0-9]|\\s)', 'g')
  }

  async resolve({ text, slackDomain, slackChannel }) {
    if (!this.contentPattern) return []

    const contentMatches = execall(this.contentPattern, text)
    const spaceKeyAndContentIds = uniq(contentMatches.map(matched =>
      ({ spaceKey: matched.sub[0], contentId: matched.sub[1] })))
    const contents = spaceKeyAndContentIds
      .filter(({ spaceKey }) => this.confluenceSpaces.isBound({ spaceKey, slackDomain, slackChannel }))
      .map(async ({ contentId }) => {
        try {
          return await promiseRetry(() => this.confluence.fetchContent(contentId))
        } catch (e) {
          log.error(`${contentId} -> ${e}`)
        }
      })
    return (await Promise.all(contents)).filter(v => !!v)
  }
}

module.exports = ConfluenceResolver
