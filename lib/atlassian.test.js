'use strict'

const Attlasian = require('./atlassian')

test('constructor', () => {
  const atlassian = new Attlasian({
    session: 'SESSION',
    baseUrl: 'BASE_URL',
  })
  expect(atlassian.session).toBe('SESSION')
  expect(atlassian.baseUrl).toBe('BASE_URL')
})

test('get headers', () => {
  const atlassian = new Attlasian({
    session: {
      name: 'SESSION',
      value: 'XXXXX',
    },
  })
  expect(atlassian.headers).toEqual({ cookie: 'SESSION=XXXXX' })
})
