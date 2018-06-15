'use strict'


class BitbucketResolver {
  constructor({ bitbucket, bitbucketProjects }) {
    this.bitbucket = bitbucket
    this.bitbucketProjects = bitbucketProjects
  }

  async resolve({ text, team }) {
    console.log(text, team)
    return []
  }
}

module.exports = BitbucketResolver
