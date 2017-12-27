'use strict'

const cookie = require('cookie')

class Attlasian {
  constructor({ session, baseUrl }) {
    this.session = session
    this.baseUrl = baseUrl
  }

  get headers() {
    return {
      cookie: cookie.serialize(this.session.name, this.session.value),
    }
  }
}

module.exports = Attlasian
