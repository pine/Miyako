## Miyako

[![Greenkeeper badge](https://badges.greenkeeper.io/pine/Miyako.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/pine/Miyako.svg?branch=master)](https://travis-ci.org/pine/Miyako)
[![codecov](https://codecov.io/gh/pine/Miyako/branch/master/graph/badge.svg)](https://codecov.io/gh/pine/Miyako)
[![dependencies Status](https://david-dm.org/pine/Miyako/status.svg)](https://david-dm.org/pine/Miyako)
[![devDependencies Status](https://david-dm.org/pine/Miyako/dev-status.svg)](https://david-dm.org/pine/Miyako?type=dev)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpine%2FMiyako.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpine%2FMiyako?ref=badge_shield)
[![codebeat badge](https://codebeat.co/badges/d9c7e059-d842-4cdb-8949-e8efc43fe1ca)](https://codebeat.co/projects/github-com-pine-miyako-master)

:zap: The lightning-fast Atlassian bot for Slack.

## Requirements

- Yarn
- Node v`$(cat .node-version)`

## Supported Atlassian products

- Confluence
- JIRA

## Getting started
### 1. Fetch Atlassian session

```
$ curl -X POST \
    https://example.atlassian.net/rest/auth/1/session \
    -H 'content-type: application/json' \
    -d '{ "username": "username@example.com", "password": "password" }'
```

### 2. Edit config

```
$ cp config/sample.js config/default.js
$ vim config/default.js
```

### 3. Run

```
$ yarn
$ ./bin/run
```

## License
MIT &copy; Pine Mizune

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpine%2FMiyako.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpine%2FMiyako?ref=badge_large)
