'use strict'

const execall = require('execall')
const log = require('fancy-log')
const got = require('got')
const _ = require('lodash')
const promiseRetry = require('promise-retry')

class ConfluenceResolver {
  constructor({ confluence, confluenceSpaces }) {
    this.confluence = confluence
    this.confluenceSpaces = confluenceSpaces

    this.contentPattern = confluenceSpaces.spaceKeys.length == 0 ?  null :
      new RegExp(confluence.escapedBaseUrl + 'spaces/(' + confluenceSpaces.spaceKeys.join('|') + ')/pages/([0-9]+)(?=$|[^0-9]|\\s)', 'g')

    const spacePattern = confluence.escapedBaseUrl +
      'spaces/(' + confluenceSpaces.spaceKeys.join('|') + ')/(?:overview|pages)(?=$|\\s|\\)|\\>|\\]|\\`|\\?)'
    this.spaceRegex = confluenceSpaces.spaceKeys.length == 0 ? null : new RegExp(spacePattern, 'g')
  }

  async resolve({ text, slackDomain, slackChannel }) {
    if (!this.contentPattern) return []

    const contentMatches = execall(this.contentPattern, text)
    const spaceKeyAndContentIds = _.uniq(contentMatches.map(matched =>
      ({ spaceKey: matched.sub[0], contentId: matched.sub[1] })))

    const spaceMatches = execall(this.spaceRegex, text)
    const spaceKeys = _.uniq(spaceMatches.map(matched => ({ spaceKey: matched.sub[0] })))

    const mergedContents = spaceKeyAndContentIds.concat(spaceKeys)
      .filter(({ spaceKey }) => this.confluenceSpaces.isBound({ spaceKey, slackDomain, slackChannel }))
      .map(async ({ spaceKey, contentId }) => {
        try {
          return contentId ?
            await promiseRetry(() => this.confluence.fetchContent(contentId)) :
            await promiseRetry(() => this.confluence.fetchSpace(spaceKey))
        } catch (e) {
          log.error(`${contentId || spaceKey} -> ${e}`)
        }
      })
    return (await Promise.all(mergedContents)).filter(v => !!v)
  }
}

module.exports = ConfluenceResolver
