'use strict'

const ConfluenceResolver = require('./confluence_resolver')


// constructor
//~~~~~~~~~~~~~~~~~

test('constructor (properties)', () => {
  const confluenceSpaces = { spaceKeys: [] }
  const confluenceResolver = new ConfluenceResolver({
    confluence: 'CONFLUENCE',
    confluenceSpaces,
  })
  expect(confluenceResolver.confluence).toBe('CONFLUENCE')
  expect(confluenceResolver.confluenceSpaces).toBe(confluenceSpaces)
})

test('constructor (contentPattern)', () => {
  const confluence = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const confluenceSpaces = { spaceKeys: ['FOO', 'BAR'] }
  const confluenceResolver = new ConfluenceResolver({
    confluence,
    confluenceSpaces,
  })

  const pattern = confluenceResolver.contentPattern
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/12345'.match(pattern)).toBeTruthy()
  expect('https://www.foo-bar.com/wiki/spaces/BAR/pages/12345'.match(pattern)).toBeTruthy()
  expect('https://www.foo-bar.com/wiki/spaces/BAR/pages/12345?q=q'.match(pattern)).toBeTruthy()
  expect('https://www.foo-bar.com/wiki/spaces/BAZ/pages/12345'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/abc'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/BAZ/overview'.match(pattern)).toBeFalsy()
})

test('constructor (spacePattern)', () => {
  const confluence = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const confluenceSpaces = { spaceKeys: ['FOO', 'BAR'] }
  const confluenceResolver = new ConfluenceResolver({
    confluence,
    confluenceSpaces,
  })

  const pattern = confluenceResolver.spacePattern
  expect('https://www.foo-bar.com/wiki/spaces/FOO/overview'.match(pattern)).toBeTruthy()
  expect('https://www.foo-bar.com/wiki/spaces/BAR/overview'.match(pattern)).toBeTruthy()
  expect('https://www.foo-bar.com/wiki/spaces/BAR/overview?q=q'.match(pattern)).toBeTruthy()
  expect('https://www.foo-bar.com/wiki/spaces/BAZ/overview'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/12345'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/BAR/pages/12345'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/abc'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/BAZ/pages/12345'.match(pattern)).toBeFalsy()
})


// resolve
//~~~~~~~~~~~

test('resolve (empty spaceKeys)', async () => {
  const confluenceSpaces = { spaceKeys: [] }
  const confluenceResolver = new ConfluenceResolver({
    confluence: {},
    confluenceSpaces,
  })
  await expect(confluenceResolver.resolve({})).resolves.toEqual([])
})

test('resolve (contentPattern; is not bound)', async () => {
  const confluence = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const confluenceSpaces = { spaceKeys: ['FOO', 'BAR'] }
  const confluenceResolver = new ConfluenceResolver({
    confluence,
    confluenceSpaces,
  })

  const isBound = jest.fn().mockReturnValue(false)
  confluenceSpaces.isBound = isBound

  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/FOO/pages/12345' }))
    .resolves.toEqual([])
  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/BAZ/pages/12345' }))
    .resolves.toEqual([])

  expect(isBound.mock.calls.length).toBe(1)
})

test('resolve (contentPattern; is bound)', async () => {
  const confluence = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const confluenceSpaces = { spaceKeys: ['FOO', 'BAR'] }
  const confluenceResolver = new ConfluenceResolver({
    confluence,
    confluenceSpaces,
  })

  const isBound = jest.fn().mockReturnValue(true)
  const fetchContent = jest.fn().mockReturnValue({ title: 'BAZ' })
  confluenceSpaces.isBound = isBound
  confluence.fetchContent = fetchContent

  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/FOO/pages/12345' }))
    .resolves.toEqual([{ title: 'BAZ' }])
  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/BAZ/pages/12345' }))
    .resolves.toEqual([])

  expect(isBound.mock.calls.length).toBe(1)
  expect(fetchContent.mock.calls.length).toBe(1)
})


test('resolve (spacePattern; is not bound)', async () => {
  const confluence = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const confluenceSpaces = { spaceKeys: ['FOO', 'BAR'] }
  const confluenceResolver = new ConfluenceResolver({
    confluence,
    confluenceSpaces,
  })

  const isBound = jest.fn().mockReturnValue(false)
  confluenceSpaces.isBound = isBound

  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/FOO/overview' }))
    .resolves.toEqual([])
  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/BAZ/overview' }))
    .resolves.toEqual([])

  expect(isBound.mock.calls.length).toBe(1)
})

test('resolve (spacePattern; is bound)', async () => {
  const confluence = { escapedBaseUrl: 'https\\://www\\.foo\\-bar\\.com/wiki/' }
  const confluenceSpaces = { spaceKeys: ['FOO', 'BAR'] }
  const confluenceResolver = new ConfluenceResolver({
    confluence,
    confluenceSpaces,
  })

  const isBound = jest.fn().mockReturnValue(true)
  const fetchSpace = jest.fn().mockReturnValue({ title: 'BAZ' })
  confluenceSpaces.isBound = isBound
  confluence.fetchSpace = fetchSpace

  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/FOO/overview' }))
    .resolves.toEqual([{ title: 'BAZ' }])
  await expect(confluenceResolver.resolve({ text: 'https://www.foo-bar.com/wiki/spaces/BAZ/overview' }))
    .resolves.toEqual([])

  expect(isBound.mock.calls.length).toBe(1)
  expect(fetchSpace.mock.calls.length).toBe(1)
})
