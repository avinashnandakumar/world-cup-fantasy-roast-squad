# Commissioner Draft Runbook

This guide explains how to run the hybrid draft with Google Sheets and Apps Script.

## Draft Structure

1. Live auction: Tier A/B countries.
2. Sealed auction: Tier C countries.
3. Catch-up draft, then snake draft: remaining countries.

Use the `DraftCommandCenter` tab as the main screen during the draft.

## Google Sheets Setup

1. Open the league Google Sheet.
2. Open **Extensions > Apps Script**.
3. Copy the files from this repo's `apps-script/` folder into the Apps Script project.
4. Save and reload the Sheet.
5. Open **World Cup Fantasy > Set up draft sheets**.
6. Enter manager names in `DraftManagers`.
7. Review settings in `DraftSettings`.
8. Run **World Cup Fantasy > Refresh draft board**.

## Draft Tabs

### DraftCommandCenter

Use this as the live operating screen.

- Settings summary.
- Pick entry box.
- Live budget board.
- Snake draft order preview.
- Current anomalies.

To record a pick:

1. Use the prefilled 48-row country table in `DraftCommandCenter`.
2. Enter the drafting manager in `displayName`.
3. Confirm or edit `phase`.
4. Enter `price`.
5. Optional: add notes.
6. Use **World Cup Fantasy > Record command center pick**.
7. The script writes the official row to `DraftPicks` and marks the command center row as `recorded`.

The command center table accepts manager display names or manager IDs. The country rows are prefilled with one row for every country. The `pick #` column starts blank and fills automatically when a row is recorded.

The live budget board, anomaly panel, and snake order preview read directly from the command center table, so they update as soon as you type. Use `Refresh draft board` when you want to repair formulas/formatting or update generated backend tabs.


### DraftSettings

Controls draft behavior.

Important keys:

- `numberManagers`
- `startingBudget`
- `rosterSize`
- `minRemainingBudgetPerOpenSlot`
- `liveAuctionWinCap`
- `sealedAuctionWinCap`
- `enforceLiveAuctionWinCap`
- `sealedAuctionWinCapEnabled`

Recommended defaults:

| League Size | Roster Size | Live Cap | Sealed Cap |
| --- | ---: | ---: | ---: |
| 8 managers | 6 | 3 optional | 2 |
| 12 managers | 4 | 2 optional | 1 |

Set `enforceLiveAuctionWinCap` to `FALSE` unless the group wants a hard live-auction cap.

### DraftManagers

Paste manager names here.

Required fields:

- `managerId`: stable ID such as `m01`.
- `displayName`: visible player name.
- `active`: `TRUE` for participating managers.
- `randomSeed`: predraft tiebreaker order. Lower number wins final ties.

### DraftTeams

Official country list and draft status.

Do not manually edit assignment columns during the draft unless needed for emergency correction. Use `DraftPicks` or the command center pick entry instead.

### DraftPicks

Official pick ledger.

Each paid or snake selection should create one row here.

### DraftBids

Use this for sealed auction submissions.

Required fields:

- `bidRound`
- `managerId`
- `teamId`
- `bidAmount`

After all sealed bids are entered, use **World Cup Fantasy > Resolve sealed bids**. The script will award valid Tier C bids, respecting budgets, roster size, and sealed-win caps.

### SnakeDraftOrder

Generated order after the auction phases.

Use **World Cup Fantasy > Generate snake draft order** after live and sealed phases are complete.

### DraftAnomalies

Shows issues the sheet detects:

- duplicate country assignments,
- unknown manager or country,
- inactive manager picks,
- invalid prices,
- roster overfills,
- budget overspending,
- cap violations,
- phase/tier mismatches.

## Live Auction Execution

1. Share the `DraftCommandCenter` screen.
2. Nominate Tier A/B countries one at a time.
3. Enter each winning country through the command center.
4. Refresh the draft board after each pick.
5. Watch `DraftAnomalies` for illegal bids or roster issues.

Suggested remote timing:

- 20 seconds after nomination.
- 10 seconds after each raise.
- Final verbal countdown: "3, 2, 1, sold."

## Sealed Auction Execution

1. Managers submit Tier C bids using a Google Form or by sending bids to the commissioner.
2. Enter all bids into `DraftBids`.
3. Use **World Cup Fantasy > Resolve sealed bids**.
4. Review `DraftPicks`, `DraftTeams`, `DraftAnomalies`, and the budget board.

For commissioner participation, use a neutral verifier or timestamped Google Form responses so bids are locked before reveal.

## Catch-Up And Snake Execution

1. Use **World Cup Fantasy > Generate snake draft order**.
2. Run catch-up picks first:
   - managers with the fewest countries pick first,
   - use normal order until roster counts are equal.
3. Once counts are equal, run a normal snake.
4. Record each selection through the command center with phase `snake` and price `0`.

## Export To Fantasy Rosters

After the draft is complete, use **World Cup Fantasy > Export Command Center to league tabs**.

This reads the visible Command Center pick table and builds the main `Managers`, `Teams`, and `Rosters` tabs so the scoring system can use the draft results.

## Emergency Corrections

If a mistake happens:

1. Correct the affected row in `DraftPicks`.
2. Run **Refresh draft board**.
3. Confirm no anomalies remain.

Do not delete rows casually during the live draft. Add a note explaining any correction.
