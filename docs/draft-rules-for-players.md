# World Cup Fantasy Draft Rules

This league drafts countries, not individual players. Your roster earns points from each country based on match results, goals, defense, discipline, group-stage bonuses, and the World Cup champion bonus.

## Draft Overview

The draft has three phases:

1. **Live Auction** for the premium countries.
2. **Sealed Auction** for the middle countries.
3. **Catch-Up Draft + Snake Draft** for the remaining countries.

All managers start with the same draft budget. The budget carries across the live auction and sealed auction. The final draft phase does not cost money.

## Roster Sizes

| League Size | Countries Per Manager |
| --- | ---: |
| 8 managers | 6 |
| 12 managers | 4 |

If the league uses a different number of managers, the commissioner will announce the roster size before the draft starts.

## Budget Rules

- Starting budget: `$100`.
- Minimum paid country price: `$1`.
- You must always preserve `$1` for every remaining empty roster slot.
- Your max legal bid is:

```text
remaining budget - remaining empty roster slots + 1
```

Example: if you have `$24` left and need 3 more countries, your max legal bid is `$22`.

## Phase 1: Live Auction

The live auction uses open bidding over voice.

### Live Auction Teams

| Tier | Countries |
| --- | --- |
| A | Spain, France, England, Portugal, Argentina, Brazil |
| B | Germany, Netherlands, Belgium, Colombia, Mexico, USA, Japan, Morocco, Uruguay, Switzerland, Croatia, Norway |

### Live Auction Rules

- Countries are nominated one at a time.
- The nominating manager opens bidding at `$1` or more.
- Minimum raise is `$1`.
- The highest legal bid wins the country.
- The commissioner repeats the current high bid and winner.
- A country is sold when the commissioner completes the countdown and says "sold."
- Bids after "sold" do not count.
- Bids cannot be withdrawn.

### Live Auction Win Guidance

There is no hard max live-auction win cap by default. The budget is the main limiter.

The commissioner may enable a cap before the draft if the group wants stronger premium-country distribution:

| League Size | Optional Live-Auction Cap |
| --- | ---: |
| 8 managers | 3 countries |
| 12 managers | 2 countries |

## Phase 2: Sealed Auction

The sealed auction gives everyone a fair shot at the strongest middle-tier countries without relying on random draft order.

### Sealed Auction Teams

| Tier | Countries |
| --- | --- |
| C | Ecuador, Senegal, Austria, Turkey, Iran, Egypt, South Korea, Sweden, Algeria, Ivory Coast, Paraguay, Australia |

### Sealed Auction Rules

- Everyone submits bids for Tier C countries at the same time.
- You may bid on as many Tier C countries as you want.
- The highest valid bid for each country wins.
- Winner pays their submitted bid.
- One sealed round is used unless the commissioner announces otherwise before the draft.
- Bids are invalid if they:
  - exceed your legal budget,
  - overfill your roster,
  - fail to preserve `$1` per remaining empty roster slot,
  - target a country that is already drafted,
  - target a country outside Tier C.

### Sealed Auction Win Caps

| League Size | Max Tier C Wins |
| --- | ---: |
| 8 managers | 2 countries |
| 12 managers | 1 country |

### Sealed Bid Ties

Ties are broken in this order:

1. Fewer total countries already rostered.
2. More remaining budget.
3. Fewer live-auction countries.
4. Predraft random seed.

## Phase 3: Catch-Up Draft + Snake Draft

The remaining countries are drafted for free.

### Remaining Teams

| Tier | Countries |
| --- | --- |
| D/E | Canada, Scotland, Czech Republic, Ghana, Tunisia, South Africa, Saudi Arabia, Qatar, Uzbekistan, Jordan, Iraq, DR Congo, Bosnia-Herzegovina, New Zealand, Panama, Haiti, Curacao, Cape Verde |

### Catch-Up Draft

The catch-up draft balances roster counts after the paid phases.

- Initial order is calculated by:
  1. Fewest countries rostered.
  2. Most remaining budget.
  3. Fewest live-auction countries.
  4. Predraft random seed.
- Only managers with the fewest countries pick.
- Use the same order each catch-up pass.
- Continue until every active manager has the same number of countries.

### Snake Draft

Once all active managers have the same number of countries, the draft becomes a normal snake draft using the same order.

- Round 1 goes top to bottom.
- Round 2 goes bottom to top.
- Continue until every roster is full.
- Managers with full rosters are skipped.

## Commissioner Authority

The commissioner maintains the official draft board and resolves timing, input, and eligibility issues. If the commissioner is also drafting, sealed bid submissions should be timestamped and visible only after the submission deadline.

## Tier Sources

The tiers are based on current outright odds, confirmed 2026 World Cup groups, and fantasy scoring fit. The field and group structure were checked against FIFA/Squawka team lists and current public odds before this document was created. The commissioner may lock updated tiers before draft night if major news changes team value.
