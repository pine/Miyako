'use strict'

const JiraProjects = require('./jira_projects')


// constructor
//~~~~~~~~~~~~~~~~~

test('constructor (empty)', () => {
  const jiraProjects = new JiraProjects([])
  expect(jiraProjects.projects).toEqual([])
  expect(jiraProjects.projectKeys).toEqual([])
})

test('constructor (single)', () => {
  const jiraProjects = new JiraProjects([
    { jira: { keys: ['FOO'] } },
  ])

  expect(jiraProjects.projects).toEqual([
    { jira: { keys: ['FOO'] } },
  ])
  expect(jiraProjects.projectKeys).toEqual(['FOO'])
})

test('constructor (duplicated)', () => {
  const jiraProjects = new JiraProjects([
    { jira: { keys: ['FOO', 'BAR', 'FOO'] } },
  ])

  expect(jiraProjects.projects).toEqual([
    { jira: { keys: ['FOO', 'BAR', 'FOO'] } },
  ])
  expect(jiraProjects.projectKeys).toEqual(['FOO', 'BAR'])
})

test('constructor (multi)', () => {
  const jiraProjects = new JiraProjects([
    { jira: { keys: ['FOO'] } },
    { jira: { keys: ['BAR', 'BAZ'] } },
  ])

  expect(jiraProjects.projects).toEqual([
    { jira: { keys: ['FOO'] } },
    { jira: { keys: ['BAR', 'BAZ'] } },
  ])
  expect(jiraProjects.projectKeys).toEqual(['FOO', 'BAR', 'BAZ'])
})


// isBound
//~~~~~~~~~~~~~~~~~

test('isBound (empty)', () => {
  const jiraProjects = new JiraProjects([])
  expect(jiraProjects.isBound({ spaceKey: 'FOO' })).toBeFalsy()
})

test('isBound (bound)', () => {
  const jiraProjects = new JiraProjects([
    {
      jira: { keys: ['FOO'] },
      slackTeams: [
        {
          domain: 'foo',
          channels: ['general'],
        },
      ],
    },
  ])

  expect(jiraProjects.isBound({
    jiraKey: 'FOO',
    slackDomain: 'foo',
    slackChannel: 'general',
  })).toBeTruthy()
})

test('isBound (not bound)', () => {
  const jiraProjects = new JiraProjects([
    {
      jira: { keys: ['FOO'] },
      slackTeams: [
        {
          domain: 'foo',
          channels: ['general'],
        },
      ],
    },
  ])

  expect(jiraProjects.isBound({
    jiraKey: 'BAR',
    slackDomain: 'foo',
    slackChannel: 'general',
  })).toBeFalsy()

  expect(jiraProjects.isBound({
    jiraKey: 'FOO',
    slackDomain: 'bar',
    slackChannel: 'general',
  })).toBeFalsy()

  expect(jiraProjects.isBound({
    jiraKey: 'FOO',
    slackDomain: 'foo',
    slackChannel: 'all',
  })).toBeFalsy()
})

