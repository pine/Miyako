## Miyako


## Requirements

- Yarn
- Node v`$(cat .node-version)`

## Getting started
### 1. Fetch JIRA session

```
curl -X POST \
  https://www.example.net/jira/rest/auth/1/session \
  -H 'content-type: application/json' \
  -d '{ "username": "username@example.com", "password": "password" }'
```

## License
MIT &copy; Pine Mizune
