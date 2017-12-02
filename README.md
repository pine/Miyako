## Miyako


## Requirements

- Yarn
- Node v`$(cat .node-version)`

## Getting started
### 1. Fetch JIRA session

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
