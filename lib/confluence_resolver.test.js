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

test('resolve(empty contentPattern)', async () => {
  const confluenceSpaces = { spaceKeys: [] }
  const confluenceResolver = new ConfluenceResolver({
    confluence: {},
    confluenceSpaces,
  })
  await expect(confluenceResolver.resolve({})).resolves.toEqual([])
})

// TODO

  // async resolve({ text, slackDomain, slackChannel }) {
  //   if (!this.contentPattern) return []

  //   const contentMatches = execall(this.contentPattern, text)
  //   const spaceKeyAndContentIds = _.uniq(contentMatches.map(matched =>
  //     ({ spaceKey: matched.sub[0], contentId: matched.sub[1] })))

  //   const spaceMatches = execall(this.spacePattern, text)
  //   const spaceKeys = _.uniq(spaceMatches.map(matched => ({ spaceKey: matched.sub[0] })))

  //   const mergedContents = spaceKeyAndContentIds.concat(spaceKeys)
  //     .filter(({ spaceKey }) => this.confluenceSpaces.isBound({ spaceKey, slackDomain, slackChannel }))
  //     .map(async ({ spaceKey, contentId }) => {
  //       try {
  //         return contentId ?
  //           await promiseRetry(() => this.confluence.fetchContent(contentId)) :
  //           await promiseRetry(() => this.confluence.fetchSpace(spaceKey))
  //       } catch (e) {
  //         log.error(`${contentId || spaceKey} -> ${e}`)
  //       }
  //     })
  //   return (await Promise.all(mergedContents)).filter(v => !!v)
  // }
