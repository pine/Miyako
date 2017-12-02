'use strict'

const uniq = require('lodash.uniq')
const memoize = require('lodash.memoize')

class ProjectMapping {
  constructor({ projects }) {
    this.projects = projects
    this.projectKeys = uniq(projects.map(project => project.key))
    this.isBound = memoize(this._isBound.bind(this))
  }

  getProjectKeys() {
    return this.projectKeys
  }

  _isBound(projectKey, team, channel) {
    for (let project of this.projects) {
      if (project.key === projectKey &&
          project.team === team &&
          project.channel === channel)
      {
        return true
      }
    }

    return false
  }
}

module.exports = ProjectMapping
