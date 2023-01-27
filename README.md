# ZeuZ GitHub Action - Check node availability
[![Test action](https://github.com/sazid/zeuz-actions-check-node-availability/actions/workflows/test.yml/badge.svg)](https://github.com/sazid/zeuz-actions-check-node-availability/actions/workflows/test.yml)

## Usage

```yaml
uses: sazid/zeuz-actions-check-node-availability@v1.1
with:
  zeuz_server_host: https://localhost
  zeuz_api_key: ${{ secrets.ZEUZ_API_KEY }}
  zeuz_team_id: 2
  zeuz_project_id: PROJ-17
  node_id: your-node-id
```

**We highly recommend to put the api key in GitHub secrets**.

See the [actions tab](https://github.com/sazid/zeuz-actions-check-node-availability/actions/workflows/test.yml) for runs of this action! :rocket:

### Optional parameters

```
retry_timeout:
  description: 'retry timeout in seconds (default: 5)'
retry_interval:
  description: 'retry interval in seconds (default: 2)'
```
