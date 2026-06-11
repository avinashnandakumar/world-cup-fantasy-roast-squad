#!/usr/bin/env python3
"""Sync World Cup match data from API-Football into the Apps Script backend.

This script is designed to run locally from cron/launchd. It fetches fixtures,
normalizes them to the Google Sheets schema, hashes the canonical payload, and
POSTs to Apps Script only when the payload changed.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io"
DEFAULT_LEAGUE_ID = "1"
DEFAULT_SEASON = "2026"
DEFAULT_STATE_FILE = ".worldcup-api-sync-state.json"


TEAM_ALIASES = {
    "argentina": "argentina",
    "brazil": "brazil",
    "england": "england",
    "france": "france",
    "spain": "spain",
    "portugal": "portugal",
    "germany": "germany",
    "netherlands": "netherlands",
    "belgium": "belgium",
    "colombia": "colombia",
    "mexico": "mexico",
    "usa": "usa",
    "united-states": "usa",
    "united-states-of-america": "usa",
    "japan": "japan",
    "morocco": "morocco",
    "uruguay": "uruguay",
    "switzerland": "switzerland",
    "croatia": "croatia",
    "norway": "norway",
    "ecuador": "ecuador",
    "senegal": "senegal",
    "austria": "austria",
    "turkey": "turkey",
    "turkiye": "turkey",
    "iran": "iran",
    "egypt": "egypt",
    "south-korea": "south-korea",
    "korea-republic": "south-korea",
    "republic-of-korea": "south-korea",
    "sweden": "sweden",
    "algeria": "algeria",
    "ivory-coast": "ivory-coast",
    "cote-d-ivoire": "ivory-coast",
    "côte-d-ivoire": "ivory-coast",
    "paraguay": "paraguay",
    "australia": "australia",
    "canada": "canada",
    "scotland": "scotland",
    "czech-republic": "czech-republic",
    "czechia": "czech-republic",
    "ghana": "ghana",
    "tunisia": "tunisia",
    "south-africa": "south-africa",
    "saudi-arabia": "saudi-arabia",
    "qatar": "qatar",
    "uzbekistan": "uzbekistan",
    "jordan": "jordan",
    "iraq": "iraq",
    "dr-congo": "dr-congo",
    "congo-dr": "dr-congo",
    "congo-d-r": "dr-congo",
    "democratic-republic-of-the-congo": "dr-congo",
    "bosnia-herzegovina": "bosnia-herzegovina",
    "bosnia-and-herzegovina": "bosnia-herzegovina",
    "new-zealand": "new-zealand",
    "panama": "panama",
    "haiti": "haiti",
    "curacao": "curacao",
    "curaçao": "curacao",
    "cape-verde": "cape-verde",
}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def slug(value: str) -> str:
    normalized = value.strip().lower().replace("&", "and")
    chars = []
    previous_dash = False
    for char in normalized:
        if char.isalnum():
            chars.append(char)
            previous_dash = False
        elif not previous_dash:
            chars.append("-")
            previous_dash = True
    return "".join(chars).strip("-")


def team_id(team: dict[str, Any]) -> str:
    name = str(team.get("name") or "")
    candidate = slug(name)
    if candidate in TEAM_ALIASES:
        return TEAM_ALIASES[candidate]
    raise ValueError(f"No team alias for provider team name: {name!r}")


def api_get(path: str, query: dict[str, str], api_key: str) -> dict[str, Any]:
    url = f"{API_FOOTBALL_BASE_URL}{path}?{urllib.parse.urlencode(query)}"
    request = urllib.request.Request(url, headers={"x-apisports-key": api_key})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"API-Football HTTP {error.code}: {body}") from error
    return json.loads(body)


def post_json(url: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            response_body = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        response_body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Apps Script HTTP {error.code}: {response_body}") from error
    return json.loads(response_body)


def normalize_status(short_status: str) -> str:
    value = (short_status or "").upper()
    if value in {"NS", "TBD"}:
        return "scheduled"
    if value in {"1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"}:
        return "live"
    if value in {"FT", "AET", "PEN"}:
        return "final"
    if value in {"PST", "CANC", "ABD", "AWD", "WO"}:
        return "postponed"
    return "scheduled"


def normalize_stage(round_name: str) -> tuple[str, str]:
    value = (round_name or "").strip()
    lower = value.lower()
    group = ""
    if "group" in lower:
        parts = value.replace("-", " ").split()
        if parts:
            group = parts[-1].upper()
        return "group", group
    if "round of 32" in lower:
        return "round_of_32", ""
    if "round of 16" in lower:
        return "round_of_16", ""
    if "quarter" in lower:
        return "quarterfinal", ""
    if "semi" in lower:
        return "semifinal", ""
    if "final" in lower:
        return "final", ""
    return lower.replace(" ", "_") or "group", group


def normalize_fixture(item: dict[str, Any]) -> dict[str, Any]:
    fixture = item.get("fixture") or {}
    league = item.get("league") or {}
    teams = item.get("teams") or {}
    goals = item.get("goals") or {}
    score = item.get("score") or {}
    status = fixture.get("status") or {}
    stage, group = normalize_stage(str(league.get("round") or ""))
    home = teams.get("home") or {}
    away = teams.get("away") or {}
    home_id = team_id(home)
    away_id = team_id(away)
    home_winner = home.get("winner")
    away_winner = away.get("winner")
    winner = home_id if home_winner is True else away_id if away_winner is True else ""
    short_status = str(status.get("short") or "")
    penalty_score = score.get("penalty") or {}

    return {
        "matchId": f"api-football-{fixture.get('id')}",
        "stage": stage,
        "group": group,
        "homeTeamId": home_id,
        "awayTeamId": away_id,
        "homeScore": goals.get("home"),
        "awayScore": goals.get("away"),
        "status": normalize_status(short_status),
        "winnerTeamId": winner,
        "decidedByPens": short_status.upper() == "PEN" or any(v is not None for v in penalty_score.values()),
        "kickoffUtc": fixture.get("date") or "",
        "lastUpdatedUtc": utc_now_iso(),
        "manualOverride": False,
        "_providerFixtureId": str(fixture.get("id")),
    }


def should_fetch_events(match: dict[str, Any]) -> bool:
    return match["status"] in {"live", "final"}


def normalize_events(api_key: str, matches: list[dict[str, Any]], sleep_seconds: float) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    for match in matches:
        if not should_fetch_events(match):
            continue
        provider_fixture_id = match.get("_providerFixtureId")
        if not provider_fixture_id:
            continue
        payload = api_get("/fixtures/events", {"fixture": provider_fixture_id}, api_key)
        for index, event in enumerate(payload.get("response") or [], start=1):
            event_type = str(event.get("type") or "")
            detail = str(event.get("detail") or "")
            if event_type.lower() != "card" or "red" not in detail.lower():
                continue
            team = event.get("team") or {}
            events.append(
                {
                    "eventId": f"{match['matchId']}::red-card::{team_id(team)}::{index}",
                    "matchId": match["matchId"],
                    "teamId": team_id(team),
                    "eventType": "red_card",
                    "minute": (event.get("time") or {}).get("elapsed") or "",
                    "count": 1,
                    "notes": detail or "Red card",
                    "source": "api-football",
                }
            )
        if sleep_seconds > 0:
            time.sleep(sleep_seconds)
    return events


def fetch_api_football_payload(args: argparse.Namespace) -> dict[str, Any]:
    api_key = env_required("API_FOOTBALL_KEY")
    query = {"league": args.league_id, "season": args.season}
    if args.date:
        query["date"] = args.date
    payload = api_get("/fixtures", query, api_key)
    matches = [normalize_fixture(item) for item in payload.get("response") or []]
    events = normalize_events(api_key, matches, args.event_sleep_seconds) if args.fetch_events else []

    for match in matches:
        match.pop("_providerFixtureId", None)

    return {
        "source": "api-football",
        "fetchedAtUtc": utc_now_iso(),
        "matches": matches,
        "events": events,
    }


def canonical_hash(payload: dict[str, Any]) -> str:
    comparable = {
        "source": payload.get("source"),
        "matches": payload.get("matches") or [],
        "events": payload.get("events") or [],
    }
    encoded = json.dumps(comparable, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text())


def save_state(path: Path, state: dict[str, Any]) -> None:
    path.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n")


def env_required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync World Cup match data into Google Sheets via Apps Script.")
    parser.add_argument("--league-id", default=os.environ.get("API_FOOTBALL_LEAGUE_ID", DEFAULT_LEAGUE_ID))
    parser.add_argument("--season", default=os.environ.get("API_FOOTBALL_SEASON", DEFAULT_SEASON))
    parser.add_argument("--date", default=os.environ.get("API_FOOTBALL_DATE", ""))
    parser.add_argument("--state-file", default=os.environ.get("WORLD_CUP_SYNC_STATE_FILE", DEFAULT_STATE_FILE))
    parser.add_argument("--force", action="store_true", help="POST even when the normalized payload hash did not change.")
    parser.add_argument("--dry-run", action="store_true", help="Fetch and normalize but do not POST.")
    parser.add_argument("--fetch-events", action="store_true", default=os.environ.get("API_FOOTBALL_FETCH_EVENTS") == "1")
    parser.add_argument("--event-sleep-seconds", type=float, default=float(os.environ.get("API_FOOTBALL_EVENT_SLEEP_SECONDS", "0.25")))
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    app_script_url = env_required("APPS_SCRIPT_WEBAPP_URL")
    sync_token = env_required("APPS_SCRIPT_SYNC_TOKEN")
    state_path = Path(args.state_file)

    payload = fetch_api_football_payload(args)
    payload_hash = canonical_hash(payload)
    state = load_state(state_path)
    if not args.force and state.get("lastHash") == payload_hash:
        print(f"No data change. matches={len(payload['matches'])} events={len(payload['events'])} hash={payload_hash}")
        return 0

    post_payload = dict(payload)
    post_payload["token"] = sync_token
    if args.dry_run:
        print(json.dumps({k: v for k, v in payload.items() if k != "matches" and k != "events"}, indent=2))
        print(f"Dry run: matches={len(payload['matches'])} events={len(payload['events'])} hash={payload_hash}")
        return 0

    result = post_json(app_script_url, post_payload)
    if not result.get("ok"):
        raise RuntimeError(f"Apps Script rejected sync: {result}")

    save_state(
        state_path,
        {
            "lastHash": payload_hash,
            "lastPostedAtUtc": utc_now_iso(),
            "matches": len(payload["matches"]),
            "events": len(payload["events"]),
            "appsScriptResult": result,
        },
    )
    print(f"Posted changed data. matches={len(payload['matches'])} events={len(payload['events'])} hash={payload_hash}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
