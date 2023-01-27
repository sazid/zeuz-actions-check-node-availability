# ZeuZ GitHub Action - Check node availability

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: sazid/zeuz-actions-check-node-availability@v1.0
with:
  zeuz_server_host: https://localhost
  zeuz_api_key: ${{ secrets.ZEUZ_API_KEY }}
  zeuz_team_id: 2
  zeuz_project_id: PROJ-17
  node_id: your-node-id
```

**We highly recommend to put the api key in GitHub secrets**.

See the [actions tab](https://github.com/sazid/zeuz-actions-check-node-availability/actions/workflows/test.yml) for runs of this action! :rocket:
