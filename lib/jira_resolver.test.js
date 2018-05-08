'use strict'

const JiraResolver = require('./jira_resolver')


// constructor
//~~~~~~~~~~~~~~~~~

test('constructor (properties)', () => {
  const jiraProjects = { projectKeys: [] }
  const jiraResolver = new JiraResolver({
    jira: 'JIRA',
    jiraProjects,
  })
  expect(jiraResolver.jira).toBe('JIRA')
  expect(jiraResolver.jiraProjects).toBe(jiraProjects)
})


test('constructor (regex)', () => {
  const jira = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/' }
  const jiraProjects = { projectKeys: ['FOO', 'BAR'] }
  const jiraResolver = new JiraResolver({
    jira,
    jiraProjects,
  })

  const { regex } = jiraResolver
  expect(regex).toBeInstanceOf(RegExp)
  expect('FOO-1'.match(regex)).toBeTruthy()
  expect('FOO-1234'.match(regex)).toBeTruthy()
  expect('BAR-1234'.match(regex)).toBeTruthy()
  expect('FOO-123456789012345'.match(regex)).toBeTruthy()
  expect('/FOO-1234'.match(regex)).toBeTruthy()
  expect('=FOO-1234'.match(regex)).toBeTruthy()
  expect('FOO-1234/'.match(regex)).toBeTruthy()
  expect('FOO-1234&'.match(regex)).toBeTruthy()
  expect(' FOO-1234'.match(regex)).toBeTruthy()
  expect('FOO-1234 '.match(regex)).toBeTruthy()
  expect(''.match(regex)).toBeFalsy()
  expect('FOO'.match(regex)).toBeFalsy()
  expect('FOO-I'.match(regex)).toBeFalsy()
  expect('FOO-FOO-1'.match(regex)).toBeFalsy()
  expect('BAZ-1234'.match(regex)).toBeFalsy()
})


// resolve
//~~~~~~~~~~~

test('resolve (empty projectKeys)', async () => {
  const jiraProjects = { projectKeys: [] }
  const jiraResolver = new JiraResolver({
    jira: {},
    jiraProjects,
  })
  await expect(jiraResolver.resolve({})).resolves.toEqual([])
})


test('resolve (regex; is not bound)', async () => {
  const jira = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const jiraProjects = { projectKeys: ['FOO', 'BAR'] }
  const jiraResolver = new JiraResolver({
    jira,
    jiraProjects,
  })

  const isBound = jest.fn().mockReturnValue(false)
  jiraProjects.isBound = isBound

  await expect(jiraResolver.resolve({ text: 'FOO-1234' })).resolves.toEqual([])
  await expect(jiraResolver.resolve({ text: 'BAZ-1234' })).resolves.toEqual([])

  expect(isBound.mock.calls.length).toBe(1)
})


test('resolve (regex; is bound)', async () => {
  const jira = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const jiraProjects = { projectKeys: ['FOO', 'BAR'] }
  const jiraResolver = new JiraResolver({
    jira,
    jiraProjects,
  })

  const isBound = jest.fn().mockReturnValue(true)
  const fetchIssue = jest.fn().mockReturnValue({ title: 'BAZ' })
  jiraProjects.isBound = isBound
  jira.fetchIssue = fetchIssue

  await expect(jiraResolver.resolve({ text: 'FOO-1234' }))
    .resolves.toEqual([{ title: 'BAZ' }])
  await expect(jiraResolver.resolve({ text: 'BAZ-1234' }))
    .resolves.toEqual([])

  expect(isBound.mock.calls.length).toBe(1)
  expect(fetchIssue.mock.calls.length).toBe(1)
})

test('resolve (regex; rejected)', async () => {
  const jira = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const jiraProjects = { projectKeys: ['FOO', 'BAR'] }
  const jiraResolver = new JiraResolver({
    jira,
    jiraProjects,
  })

  const isBound = jest.fn().mockReturnValue(true)
  const fetchIssue = jest.fn(() => Promise.reject('ERROR'))
  jiraProjects.isBound = isBound
  jira.fetchIssue = fetchIssue

  const consoleLog = jest.spyOn(console, 'error')
  consoleLog.mockImplementation(() => void 0)

  await expect(jiraResolver.resolve({ text: 'FOO-1234' }))
    .resolves.toEqual([])

  expect(isBound.mock.calls.length).toBe(1)
  expect(fetchIssue.mock.calls.length).toBe(1)

  expect(consoleLog.mock.calls.length).toBe(1)
  expect(consoleLog.mock.calls[0][0]).toBe("FOO-1234 -> ERROR")

  consoleLog.mockReset()
  consoleLog.mockRestore()
})
