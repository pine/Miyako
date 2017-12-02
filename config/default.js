'use strict'

module.exports = {
  jira: {
    baseUrl: 'https://example.atlassian.net/',
    session: {
      name: 'cloud.session.token',
      value: 'XXX',
    },
  },

  slack: {
    token: 'XXX',
    username: 'JIRA',
    iconUrl: 'http://www.example.com/jira.png',
  },

  projects: [
    { key: 'KEY', channel: 'general' },
  ],
}
