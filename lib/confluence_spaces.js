'use strict'

const _ = require('lodash')

class ConfluenceSpaces {
  constructor(spaces) {
    this.spaces = spaces
    this.spaceKeys = _(spaces).map(space => space.confluence.keys).flatten().uniq().value()
    this.isBound = _.memoize(this._isBound, ({ spaceKey, slackDomain, slackChannel }) => {
      return [ spaceKey, slackDomain, slackChannel ].join(':')
    })
  }

  _isBound({ spaceKey, slackDomain, slackChannel }) {
    for (let space of this.spaces) {
      const spaceKeyOk = space.confluence.keys.includes(spaceKey)
      if (!spaceKeyOk) continue

      for (let slackTeam of project.slackTeams) {
        const slackDomainOk = slackTeam.domain === slackDomain
        const slackChannelOk = slackTeam.channels.includes(slackChannel)
        if (slackDomainOk && slackChannelOk) return true
      }
    }

    return false
  }
}

module.exports = ConfluenceSpaces
