'use strict'

const nock = require('nock')
const Confluence = require('./confluence')


// constructor
//~~~~~~~~~~~~~~~~~

test('constructor (end with a slash)', () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  expect(confluence.atlassian).toBe(atlassian)
  expect(confluence.baseUrl).toBe('https://www.foo-bar.com/wiki/')
  expect(confluence.escapedBaseUrl).toBe('https\\://www\\.foo\\-bar\\.com/wiki/')
})

test('constructor (not end with a slash)', () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com' }
  const confluence = new Confluence({ atlassian })

  expect(confluence.atlassian).toBe(atlassian)
  expect(confluence.baseUrl).toBe('https://www.foo-bar.com/wiki/')
  expect(confluence.escapedBaseUrl).toBe('https\\://www\\.foo\\-bar\\.com/wiki/')
})


// fetchContent
//~~~~~~~~~~~~~~~~~

test('fetchContent (ok)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/content/1')
    .reply(200, JSON.stringify({
      id: 12345,
      title: 'foo',
      space: { key: 'bar' },
    }))

  await expect(confluence.fetchContent(1)).resolves.toEqual({
    id: 12345,
    title: 'foo',
    spaceKey: 'bar',
    url: 'https://www.foo-bar.com/wiki/spaces/bar/pages/12345',
  })
})

test('fetchContent (broken response: id)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/content/1')
    .reply(200, JSON.stringify({
      id: null,
      title: 'foo',
      space: { key: 'bar' },
    }))

  await expect(confluence.fetchContent(1)).resolves.toBeNull()
})

test('fetchContent (broken response: title)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/content/1')
    .reply(200, JSON.stringify({
      id: 12345,
      title: null,
      space: { key: 'bar' },
    }))

  await expect(confluence.fetchContent(1)).resolves.toBeNull()
})

test('fetchContent (broken response: space.key)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/content/1')
    .reply(200, JSON.stringify({
      id: 12345,
      title: 'foo',
      space: { key: null },
    }))

  await expect(confluence.fetchContent(1)).resolves.toBeNull()
})

test('fetchContent (not found)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/content/1')
    .reply(404, '')

  await expect(confluence.fetchContent(1)).rejects.toThrow()
})


// fetchSpace
//~~~~~~~~~~~~~~~~~

test('fetchSpace (ok)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/space/baz')
    .reply(200, JSON.stringify({
      id: 12345,
      name: 'foo',
    }))

  await expect(confluence.fetchSpace('baz')).resolves.toEqual({
    id: 12345,
    title: 'foo',
    spaceKey: 'baz',
    url: 'https://www.foo-bar.com/wiki/spaces/baz/overview',
  })
})

test('fetchSpace (broken response: id)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/space/baz')
    .reply(200, JSON.stringify({
      id: null,
      name: 'foo',
    }))

  await expect(confluence.fetchSpace('baz')).resolves.toBeNull()
})

test('fetchSpace (broken response: name)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/space/baz')
    .reply(200, JSON.stringify({
      id: 12345,
      name: null,
    }))

  await expect(confluence.fetchSpace('baz')).resolves.toBeNull()
})

test('fetchSpace (not found)', async () => {
  const atlassian = { baseUrl: 'https://www.foo-bar.com/' }
  const confluence = new Confluence({ atlassian })

  const scope = nock('https://www.foo-bar.com')
    .get('/wiki/rest/api/space/baz')
    .reply(404, '')

  await expect(confluence.fetchSpace('baz')).rejects.toThrow()
})
