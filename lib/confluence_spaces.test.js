'use strict'

const ConfluenceSpaces = require('./confluence_spaces')


// constructor
//~~~~~~~~~~~~~~~~~

test('constructor (empty)', () => {
  const confluenceSpaces = new ConfluenceSpaces([])
  expect(confluenceSpaces.spaces).toEqual([])
  expect(confluenceSpaces.spaceKeys).toEqual([])
})

test('constructor (single)', () => {
  const confluenceSpaces = new ConfluenceSpaces([
    { confluence: { keys: ['FOO'] } },
  ])

  expect(confluenceSpaces.spaces).toEqual([
    { confluence: { keys: ['FOO'] } },
  ])
  expect(confluenceSpaces.spaceKeys).toEqual(['FOO'])
})

test('constructor (duplicated)', () => {
  const confluenceSpaces = new ConfluenceSpaces([
    { confluence: { keys: ['FOO', 'BAR', 'FOO'] } },
  ])

  expect(confluenceSpaces.spaces).toEqual([
    { confluence: { keys: ['FOO', 'BAR', 'FOO'] } },
  ])
  expect(confluenceSpaces.spaceKeys).toEqual(['FOO', 'BAR'])
})

test('constructor (multi)', () => {
  const confluenceSpaces = new ConfluenceSpaces([
    { confluence: { keys: ['FOO'] } },
    { confluence: { keys: ['BAR', 'BAZ'] } },
  ])

  expect(confluenceSpaces.spaces).toEqual([
    { confluence: { keys: ['FOO'] } },
    { confluence: { keys: ['BAR', 'BAZ'] } },
  ])
  expect(confluenceSpaces.spaceKeys).toEqual(['FOO', 'BAR', 'BAZ'])
})


// isBound
//~~~~~~~~~~~~~~~~~

test('isBound (empty)', () => {
  const confluenceSpaces = new ConfluenceSpaces([])
  expect(confluenceSpaces.isBound({ spaceKey: 'FOO' })).toBeFalsy()
})

test('isBound (bound)', () => {
  const confluenceSpaces = new ConfluenceSpaces([
    {
      confluence: { keys: ['FOO'] },
      slackTeams: [
        {
          domain: 'foo',
          channels: ['general'],
        },
      ],
    },
  ])

  expect(confluenceSpaces.isBound({
    spaceKey: 'FOO',
    slackDomain: 'foo',
    slackChannel: 'general',
  })).toBeTruthy()
})

test('isBound (not bound)', () => {
  const confluenceSpaces = new ConfluenceSpaces([
    {
      confluence: { keys: ['FOO'] },
      slackTeams: [
        {
          domain: 'foo',
          channels: ['general'],
        },
      ],
    },
  ])

  expect(confluenceSpaces.isBound({
    spaceKey: 'BAR',
    slackDomain: 'foo',
    slackChannel: 'general',
  })).toBeFalsy()

  expect(confluenceSpaces.isBound({
    spaceKey: 'FOO',
    slackDomain: 'bar',
    slackChannel: 'general',
  })).toBeFalsy()

  expect(confluenceSpaces.isBound({
    spaceKey: 'FOO',
    slackDomain: 'foo',
    slackChannel: 'all',
  })).toBeFalsy()
})

