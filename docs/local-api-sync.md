# Local API Sync Setup

This project can sync real match data from a local Mac into the Google Sheet backend.

Recommended flow:

```text
cron or launchd on Mac
  -> scripts/sync_worldcup_api.py
  -> API-Football
  -> Apps Script Web App doPost
  -> Google Sheet Matches + MatchEvents
  -> scoring rebuild + website snapshot
```

The script hashes normalized match data and only sends it to Google Sheets when something changed.

## Provider Choice

Use **API-Football / API-Sports** as the default provider.

Why:

- Supports fixtures, live status, scores, goals, cards, and event timelines.
- Simple HTTP API from Python.
- Auth uses the `x-apisports-key` header.
- Free tier is probably too small for live polling, so plan on a paid month during the tournament.

Avoid scraping Google match cards. It is brittle, lacks stable IDs, and may violate automated-access rules.

Useful provider docs:

- [API-Football documentation](https://www.api-football.com/documentation-v3)
- [API-Football pricing](https://www.api-football.com/pricing)
- [API-Football coverage](https://www.api-football.com/coverage)

## Apps Script Setup

1. Copy the latest Apps Script files into your bound Apps Script project.
2. Deploy the project as a Web App:
   - Execute as: **Me**
   - Who has access: **Anyone with the link**
3. Copy the Web App URL.
4. In Apps Script, open **Project Settings > Script Properties**.
5. Add:

```text
EXTERNAL_SYNC_TOKEN = a-long-random-secret
```

The Python script must send this same token.

## Local Mac Setup

From the repo root:

```bash
python3 -m py_compile scripts/sync_worldcup_api.py
```

Set environment variables:

```bash
export API_FOOTBALL_KEY="your-api-football-key"
export APPS_SCRIPT_WEBAPP_URL="https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
export APPS_SCRIPT_SYNC_TOKEN="same-long-random-secret"
export API_FOOTBALL_LEAGUE_ID="1"
export API_FOOTBALL_SEASON="2026"
```

`API_FOOTBALL_LEAGUE_ID=1` is the expected World Cup league id for API-Football, but confirm it with:

```bash
curl --request GET \
  --url "https://v3.football.api-sports.io/leagues?name=World%20Cup" \
  --header "x-apisports-key: $API_FOOTBALL_KEY"
```

## Smoke Test

Run a dry run first:

```bash
python3 scripts/sync_worldcup_api.py --dry-run
```

Then force one post:

```bash
python3 scripts/sync_worldcup_api.py --force
```

Check these tabs:

- `Matches`
- `MatchEvents`
- `ScoringLedger`
- `Standings`
- `SyncLog`

If you need red-card events, enable event fetching:

```bash
API_FOOTBALL_FETCH_EVENTS=1 python3 scripts/sync_worldcup_api.py --force
```

This calls `/fixtures/events` for live/final fixtures, so it uses more API quota.

## Run Every Minute With Cron

Create a small shell wrapper so cron has all environment variables.

Example: `/Users/avi/Documents/World Cup 2026/scripts/run_worldcup_sync.sh`

```bash
#!/bin/zsh
cd "/Users/avi/Documents/World Cup 2026" || exit 1

export API_FOOTBALL_KEY="your-api-football-key"
export APPS_SCRIPT_WEBAPP_URL="https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
export APPS_SCRIPT_SYNC_TOKEN="same-long-random-secret"
export API_FOOTBALL_LEAGUE_ID="1"
export API_FOOTBALL_SEASON="2026"
export API_FOOTBALL_FETCH_EVENTS="1"

/usr/bin/python3 scripts/sync_worldcup_api.py >> logs/worldcup-sync.log 2>&1
```

Create the log folder:

```bash
mkdir -p logs
```

Make the wrapper executable:

```bash
chmod +x "scripts/run_worldcup_sync.sh"
```

Edit cron:

```bash
crontab -e
```

Add:

```cron
* * * * * /Users/avi/Documents/World\ Cup\ 2026/scripts/run_worldcup_sync.sh
```

## How Change Detection Works

The Python script stores the last normalized payload hash in:

```text
.worldcup-api-sync-state.json
```

If the hash is unchanged, it exits without posting to Apps Script.

Use `--force` when you intentionally want to post anyway.

## Important Notes

- The script posts canonical `matches` and `events` arrays to Apps Script.
- Apps Script preserves `Matches` rows where `manualOverride` is `TRUE`.
- Apps Script preserves existing `MatchEvents` rows where `source` is `manual`.
- Penalty shootout goals are not separately counted.
- The first real provider test should be supervised from the Apps Script `SyncLog`.
- If API-Football returns a team name that is not in the alias map, the Python script fails loudly so you can add the alias before it writes bad data.
