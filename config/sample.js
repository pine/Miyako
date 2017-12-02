'use strict'

module.exports = {
  // JIRA
  jira: {
    baseUrl: 'https://example.atlassian.net/',
    session: {
      name: 'cloud.session.token',
      value: 'XXX',
    },
  },

  // Slack
  slack: {
    username: 'JIRA',
    iconUrl: 'http://www.example.com/jira.png',
    refresh: 10 * 60 * 1000, // 60 min
    teams: [
      {
        name: 'team',
        token: 'XXX',
      },
    ],
  },

  // JIRA projects <-> Slack teams
  projects: [
    {
      key: 'KEY',
      team: 'team',
      channel: 'general',
    },
  ],
}
