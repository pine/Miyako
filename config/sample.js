'use strict'

module.exports = {
  // Atlassian
  atlassian: {
    baseUrl: 'https://xxx.atlassian.net/',
    session: {
      name: 'cloud.session.token',
      value: 'XXX',
    },
  },

  // Slack
  slack: {
    botUsers: {
      confluence: {
        username: 'Confluence',
        iconUrl: '',
      },
      jira: {
        username: 'JIRA',
        iconUrl: '',
      },
    },
    refresh: 60 * 60 * 1000, // 60 min
    teams: [
      {
        domain: 'domain',
        token: 'XXX',
      },
    ],
  },

  // JIRA projects <-> Slack teams/channels
  jiraProjects: [
    {
      jira: {
        keys: ['XXX'],
      },
      slackTeams: [
        {
          domain: 'domain',
          channels: ['general'],
        },
      ],
    },
  ],

  // Confluence spaces <-> Slack teams/channels
  confluenceSpaces: [
    {
      confluence: {
        keys: ['XXX'],
      },
      slackTeams: [
        {
          domain: 'domain',
          channels: ['general'],
        },
      ],
    },
  ],
}
