'use strict'

const { WebClient } = require('@slack/client')
const SlackPostman = require('./slack_postman')


// constructor
//~~~~~~~~~~~~~~~~~

test('constructor', () => {
  const postman = new SlackPostman({
    web: 'WEB',
    botUser: 'BOT_USER',
  })
  expect(postman.web).toBe('WEB')
  expect(postman.botUser).toBe('BOT_USER')
})



// post
//~~~~~~~~~~~~~~~~~

test('post', async () => {
  const web = new WebClient('xxx')
  const postMessage = jest.fn().mockReturnValue(Promise.resolve())
  web.chat.postMessage = postMessage

  const postman = new SlackPostman({
    web,
    botUser: {
      username: 'username',
      iconUrl: 'iconUrl',
    },
  })
  await postman.post('channel', 1234, 'hello')

  expect(postMessage.mock.calls.length).toBe(1)
  expect(postMessage.mock.calls[0][0]).toMatchObject({
    channel: 'channel',
    text: 'hello',
    username: 'username',
    icon_url: 'iconUrl',
    thread_ts: 1234,
    reply_broadcast: false,
  })
})
