'use strict'

const nock = require('nock')
const Jira = require('./jira')


// constructor
//~~~~~~~~~~~~~~~~~

test('constructor', () => {
  const jira = new Jira({ atlassian: 'ATLASSIAN' })
  expect(jira.atlassian).toBe('ATLASSIAN')
})


// fetchIssue
//~~~~~~~~~~~~~~~~~

test('fetchIssue (ok)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const jira = new Jira({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/rest/api/2/issue/FOO-123')
    .reply(200, JSON.stringify({
      id: 12345,
      key: 'FOO-123',
      fields: {
        project: { key: 'FOO' },
        summary: 'summary',
        assignee: { displayName: 'John Smith' },
        status: { name: 'TODO' },
      },
    }))

  await expect(jira.fetchIssue('FOO-123')).resolves.toEqual({
    id: 12345,
    key: 'FOO-123',
    projectKey: 'FOO',
    summary: 'summary',
    assignee: 'John Smith',
    status: 'TODO',
    url: 'https://www.foo-bar.com/browse/FOO-123',
  })
})

test('fetchIssue (broken response: id)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const jira = new Jira({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/rest/api/2/issue/FOO-123')
    .reply(200, JSON.stringify({
      id: null,
      key: 'FOO-123',
      fields: {
        project: { key: 'FOO' },
        summary: 'summary',
        assignee: { displayName: 'John Smith' },
        status: { name: 'TODO' },
      },
    }))

  await expect(jira.fetchIssue('FOO-123')).resolves.toEqual(null)
})

test('fetchissue (broken response: key)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const jira = new Jira({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/rest/api/2/issue/FOO-123')
    .reply(200, JSON.stringify({
      id: 12345,
      key: null,
      fields: {
        project: { key: 'FOO' },
        summary: 'summary',
        assignee: { displayName: 'John Smith' },
        status: { name: 'TODO' },
      },
    }))

  await expect(jira.fetchIssue('FOO-123')).resolves.toEqual(null)
})

test('fetchissue (broken response: projectKey)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const jira = new Jira({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/rest/api/2/issue/FOO-123')
    .reply(200, JSON.stringify({
      id: 12345,
      key: 'FOO-123',
      fields: {
        summary: 'summary',
        assignee: { displayname: 'john smith' },
        status: { name: 'todo' },
      },
    }))

  await expect(jira.fetchIssue('FOO-123')).resolves.toEqual(null)
})
