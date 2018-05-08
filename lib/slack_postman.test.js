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
      iconUrl: 'https://www.example.com/icon.png',
    },
  })

  await postman.post('channel', null, 'hello')

  expect(postMessage.mock.calls.length).toBe(1)
  expect(postMessage.mock.calls[0][0]).toBe(1)
  // expect(jiraPostman.web).toBe('WEB')
  // expect(jiraPostman.botUser).toBe('BOT_USER')
})

  // async post(channel, threadTs, text) {
  //   await this.web.chat.postMessage({
  //     channel,
  //     text,
  //     username: this.botUser.username,
  //     icon_url: this.botUser.iconUrl,
  //     thread_ts: threadTs,
  //     reply_broadcast: false,
  //   })
  // }
