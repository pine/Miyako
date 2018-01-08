'use strict'

const ConfluenceResolver = require('./confluence_resolver')

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
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/FOO/pages/abc'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/BAZ/pages/12345'.match(pattern)).toBeFalsy()
  expect('https://www.foo-bar.com/wiki/spaces/BAZ/overview'.match(pattern)).toBeFalsy()
})
