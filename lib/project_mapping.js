'use strict'

const uniq = require('lodash.uniq')

class ProjectMapping {
  constructor({ projects }) {
    this.projectKeys = uniq(projects.map(project => project.key))

    const projectKeyToChannels = {}
    for (const project of projects) {
      const channels = projectKeyToChannels[project.key] || []
      channels.push(project.channel)
      projectKeyToChannels[project.key] = channels
    }
    this.projectKeyToChannels = projectKeyToChannels
  }

  getProjectKeys() {
    return this.projectKeys
  }

  isBound(projectKey, channel) {
    const channels = this.projectKeyToChannels[projectKey] || []
    return channels.includes(channel)
  }
}

module.exports = ProjectMapping
