'use strict'

const uniq = require('lodash.uniq')

class ProjectMapping {
  constructor({ projects }) {
    this.projects = projects
    this.projectKeys = uniq(projects.map(project => project.key))
  }

  getProjectKeys() {
    return this.projectKeys
  }

  isBound({ projectKey, team, channel }) {
    console.log(projectKey, team, channel)
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
