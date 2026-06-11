var DRAFT_SHEETS = {
  SETTINGS: 'DraftSettings',
  MANAGERS: 'DraftManagers',
  TEAMS: 'DraftTeams',
  PICKS: 'DraftPicks',
  BIDS: 'DraftBids',
  COMMAND_CENTER: 'DraftCommandCenter',
  SNAKE_ORDER: 'SnakeDraftOrder',
  ANOMALIES: 'DraftAnomalies'
};

var DRAFT_HEADERS = {
  DraftSettings: ['key', 'value', 'notes'],
  DraftManagers: ['managerId', 'displayName', 'active', 'startingBudget', 'rosterSize', 'randomSeed', 'notes'],
  DraftTeams: [
    'teamId',
    'countryName',
    'group',
    'draftTier',
    'draftPhase',
    'suggestedOrder',
    'draftedByManagerId',
    'draftPrice',
    'actualPhase',
    'pickNumber',
    'notes'
  ],
  DraftPicks: ['pickNumber', 'pickedAtUtc', 'phase', 'managerId', 'teamId', 'price', 'notes'],
  DraftBids: ['bidRound', 'managerId', 'teamId', 'bidAmount', 'submittedAtUtc', 'notes'],
  DraftCommandCenter: ['section', 'value'],
  SnakeDraftOrder: ['orderSlot', 'managerId', 'displayName', 'countriesRostered', 'remainingBudget', 'liveWins', 'randomSeed', 'notes'],
  DraftAnomalies: ['severity', 'type', 'sheetName', 'rowNumber', 'message']
};

var DRAFT_DEFAULT_SETTINGS = [
  ['numberManagers', 8, 'Set to 8 or 12 before setup/refresh.'],
  ['startingBudget', 100, 'Budget used for live and sealed auction phases.'],
  ['rosterSize', '', 'Optional override. Blank means 8 managers=6 countries, 12 managers=4 countries.'],
  ['minRemainingBudgetPerOpenSlot', 1, 'Managers must preserve this amount per empty roster slot.'],
  ['liveAuctionWinCap', '', 'Optional override. Blank means half roster rounded down.'],
  ['sealedAuctionWinCap', '', 'Optional override. Blank means 8 managers=2, 12 managers=1.'],
  ['enforceLiveAuctionWinCap', false, 'TRUE to enforce a hard live-auction win cap.'],
  ['sealedAuctionWinCapEnabled', true, 'TRUE to enforce Tier C sealed auction win caps.'],
  ['lastDraftRefreshUtc', '', 'Managed by Apps Script.']
];

var DRAFT_COLORS = {
  NAVY: '#17324d',
  BLUE: '#2f80ed',
  GREEN: '#219653',
  TEAL: '#168aad',
  GOLD: '#f2c94c',
  RED: '#eb5757',
  ORANGE: '#f2994a',
  PURPLE: '#7b61ff',
  INK: '#1f2933',
  MUTED: '#667085',
  GRID: '#d0d5dd',
  SOFT_BLUE: '#eaf3ff',
  SOFT_GREEN: '#eaf7ee',
  SOFT_GOLD: '#fff7dc',
  SOFT_RED: '#fdecec',
  SOFT_ORANGE: '#fff0e1',
  SOFT_PURPLE: '#f1edff',
  SOFT_GRAY: '#f6f8fa',
  WHITE: '#ffffff'
};

var DRAFT_TEAMS = [
  ['argentina', 'Argentina', 'C', 'A', 'live', 1],
  ['brazil', 'Brazil', 'J', 'A', 'live', 2],
  ['england', 'England', 'L', 'A', 'live', 3],
  ['france', 'France', 'I', 'A', 'live', 4],
  ['spain', 'Spain', 'H', 'A', 'live', 5],
  ['portugal', 'Portugal', 'K', 'A', 'live', 6],
  ['germany', 'Germany', 'E', 'B', 'live', 7],
  ['netherlands', 'Netherlands', 'F', 'B', 'live', 8],
  ['belgium', 'Belgium', 'G', 'B', 'live', 9],
  ['colombia', 'Colombia', 'K', 'B', 'live', 10],
  ['mexico', 'Mexico', 'A', 'B', 'live', 11],
  ['usa', 'USA', 'D', 'B', 'live', 12],
  ['japan', 'Japan', 'F', 'B', 'live', 13],
  ['morocco', 'Morocco', 'A', 'B', 'live', 14],
  ['uruguay', 'Uruguay', 'H', 'B', 'live', 15],
  ['switzerland', 'Switzerland', 'B', 'B', 'live', 16],
  ['croatia', 'Croatia', 'L', 'B', 'live', 17],
  ['norway', 'Norway', 'I', 'B', 'live', 18],
  ['ecuador', 'Ecuador', 'E', 'C', 'sealed', 19],
  ['senegal', 'Senegal', 'I', 'C', 'sealed', 20],
  ['austria', 'Austria', 'C', 'C', 'sealed', 21],
  ['turkey', 'Turkey', 'D', 'C', 'sealed', 22],
  ['iran', 'Iran', 'G', 'C', 'sealed', 23],
  ['egypt', 'Egypt', 'G', 'C', 'sealed', 24],
  ['south-korea', 'South Korea', 'A', 'C', 'sealed', 25],
  ['sweden', 'Sweden', 'F', 'C', 'sealed', 26],
  ['algeria', 'Algeria', 'C', 'C', 'sealed', 27],
  ['ivory-coast', 'Ivory Coast', 'E', 'C', 'sealed', 28],
  ['paraguay', 'Paraguay', 'D', 'C', 'sealed', 29],
  ['australia', 'Australia', 'D', 'C', 'sealed', 30],
  ['canada', 'Canada', 'B', 'D/E', 'snake', 31],
  ['scotland', 'Scotland', 'A', 'D/E', 'snake', 32],
  ['czech-republic', 'Czech Republic', 'J', 'D/E', 'snake', 33],
  ['ghana', 'Ghana', 'L', 'D/E', 'snake', 34],
  ['tunisia', 'Tunisia', 'F', 'D/E', 'snake', 35],
  ['south-africa', 'South Africa', 'J', 'D/E', 'snake', 36],
  ['saudi-arabia', 'Saudi Arabia', 'H', 'D/E', 'snake', 37],
  ['qatar', 'Qatar', 'B', 'D/E', 'snake', 38],
  ['uzbekistan', 'Uzbekistan', 'K', 'D/E', 'snake', 39],
  ['jordan', 'Jordan', 'J', 'D/E', 'snake', 40],
  ['iraq', 'Iraq', 'I', 'D/E', 'snake', 41],
  ['dr-congo', 'DR Congo', 'K', 'D/E', 'snake', 42],
  ['bosnia-herzegovina', 'Bosnia-Herzegovina', 'B', 'D/E', 'snake', 43],
  ['new-zealand', 'New Zealand', 'G', 'D/E', 'snake', 44],
  ['panama', 'Panama', 'L', 'D/E', 'snake', 45],
  ['haiti', 'Haiti', 'C', 'D/E', 'snake', 46],
  ['curacao', 'Curacao', 'E', 'D/E', 'snake', 47],
  ['cape-verde', 'Cape Verde', 'H', 'D/E', 'snake', 48]
];

function setupDraftSheets() {
  var spreadsheet = getFantasySpreadsheet_();
  Object.keys(DRAFT_HEADERS).forEach(function (sheetName) {
    ensureSheet_(spreadsheet, sheetName, DRAFT_HEADERS[sheetName]);
  });

  seedDraftSettings_();
  seedDraftManagers_();
  seedDraftTeams_();
  setupDraftCommandCenter_();
  refreshDraftBoard();
  formatDraftWorkbook_();
}

function refreshDraftBoard() {
  var state = getDraftState_();
  updateDraftTeamsFromPicks_(state);
  writeDraftBudgetBoard_(state);
  writeDraftAnomalies_(state);
  writeDraftSettingsValue_('lastDraftRefreshUtc', new Date().toISOString());
  formatDraftWorkbook_();
}

function formatDraftWorkbook() {
  formatDraftWorkbook_();
}

function recordDraftPickFromCommandCenter() {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.COMMAND_CENTER);
  if (!sheet) {
    throw new Error('Run setupDraftSheets first.');
  }

  var state = getDraftState_();
  var startRow = 9;
  var startColumn = 1;
  var columnCount = 9;
  var lastRow = 56;
  var rowCount = Math.max(0, lastRow - startRow + 1);
  var values = rowCount > 0 ? sheet.getRange(startRow, startColumn, rowCount, columnCount).getValues() : [];
  var processed = 0;
  var errors = [];

  values.forEach(function (row, index) {
    var rowNumber = startRow + index;
    var status = String(row[7] || '').trim().toLowerCase();
    var displayName = String(row[1] || '').trim();
    var country = String(row[2] || '').trim();
    var phase = String(row[3] || '').trim().toLowerCase();
    var price = Number(row[4] || 0);
    var notes = String(row[5] || '').trim();

    if (!displayName && !country && !phase && row[4] === '') {
      return;
    }
    if (status === 'recorded') {
      return;
    }

    try {
      if (!displayName || !country || !phase) {
        throw new Error('displayName, country, and phase are required.');
      }
      var manager = findDraftManagerByInput_(displayName, state);
      if (!manager) {
        throw new Error('Unknown manager/displayName: ' + displayName);
      }
      var team = findDraftTeamByInput_(country);
      if (!team) {
        throw new Error('Unknown country: ' + country);
      }

      var pickNumber = appendDraftPick_(phase, manager.managerId, team.teamId, price, notes);
      sheet.getRange(rowNumber, 1).setValue(pickNumber);
      sheet.getRange(rowNumber, 7, 1, 3).setValues([[
        new Date().toISOString(),
        'recorded',
        manager.managerId + ' / ' + team.teamId
      ]]);
      processed += 1;
      state.picks.push({
        pickNumber: state.picks.length + 1,
        pickedAtUtc: new Date().toISOString(),
        phase: phase,
        managerId: manager.managerId,
        teamId: team.teamId,
        price: price,
        notes: notes,
        rowNumber: ''
      });
      state.pickByTeam[team.teamId] = state.picks[state.picks.length - 1];
    } catch (error) {
      sheet.getRange(rowNumber, 8, 1, 2).setValues([['error', error.message]]);
      errors.push('Row ' + rowNumber + ': ' + error.message);
    }
  });

  refreshDraftBoard();
  if (errors.length > 0) {
    throw new Error('Recorded ' + processed + ' row(s). Fix these command center rows: ' + errors.join(' | '));
  }
  return processed;
}

function resolveSealedBids() {
  var state = getDraftState_();
  var bids = readDraftRows_(DRAFT_SHEETS.BIDS);
  var settings = state.settings;
  var sealedCapEnabled = parseBoolean_(settings.sealedAuctionWinCapEnabled, true);
  var sealedCap = getSealedAuctionWinCap_(settings);
  var awardedByTeam = {};
  var bidsByTeam = {};

  bids.forEach(function (bid) {
    var team = state.teamMap[normalizeId_(bid.teamId)];
    var manager = state.managerMap[normalizeId_(bid.managerId)];
    var amount = Number(bid.bidAmount);
    if (!team || !manager || !manager.active || team.draftPhase !== 'sealed' || amount <= 0 || state.pickByTeam[team.teamId]) {
      return;
    }
    if (!bidsByTeam[team.teamId]) {
      bidsByTeam[team.teamId] = [];
    }
    bidsByTeam[team.teamId].push({
      managerId: manager.managerId,
      teamId: team.teamId,
      amount: amount,
      randomSeed: Number(manager.randomSeed || 999)
    });
  });

  Object.keys(bidsByTeam)
    .sort(function (a, b) {
      return state.teamMap[a].suggestedOrder - state.teamMap[b].suggestedOrder;
    })
    .forEach(function (teamId) {
      var candidates = bidsByTeam[teamId].filter(function (candidate) {
        var summary = calculateManagerDraftSummary_(candidate.managerId, state, awardedByTeam);
        if (sealedCapEnabled && summary.sealedWins >= sealedCap) {
          return false;
        }
        return isLegalDraftPrice_(candidate.managerId, candidate.amount, state, awardedByTeam);
      });

      candidates.sort(function (a, b) {
        if (b.amount !== a.amount) return b.amount - a.amount;
        var aSummary = calculateManagerDraftSummary_(a.managerId, state, awardedByTeam);
        var bSummary = calculateManagerDraftSummary_(b.managerId, state, awardedByTeam);
        if (aSummary.countryCount !== bSummary.countryCount) return aSummary.countryCount - bSummary.countryCount;
        if (bSummary.remainingBudget !== aSummary.remainingBudget) return bSummary.remainingBudget - aSummary.remainingBudget;
        if (aSummary.liveWins !== bSummary.liveWins) return aSummary.liveWins - bSummary.liveWins;
        return a.randomSeed - b.randomSeed;
      });

      if (candidates.length > 0) {
        var winner = candidates[0];
        awardedByTeam[teamId] = {
          managerId: winner.managerId,
          price: winner.amount,
          phase: 'sealed'
        };
      }
    });

  Object.keys(awardedByTeam).forEach(function (teamId) {
    var award = awardedByTeam[teamId];
    appendDraftPick_('sealed', award.managerId, teamId, award.price, 'Resolved from DraftBids');
  });

  refreshDraftBoard();
  return Object.keys(awardedByTeam).length;
}

function generateSnakeDraftOrder() {
  var state = getDraftState_();
  var summaries = getManagerDraftSummaries_(state).filter(function (summary) {
    return summary.active && summary.countryCount < summary.rosterSize;
  });

  summaries.sort(function (a, b) {
    if (a.countryCount !== b.countryCount) return a.countryCount - b.countryCount;
    if (b.remainingBudget !== a.remainingBudget) return b.remainingBudget - a.remainingBudget;
    if (a.liveWins !== b.liveWins) return a.liveWins - b.liveWins;
    return a.randomSeed - b.randomSeed;
  });

  var rows = summaries.map(function (summary, index) {
    return {
      orderSlot: index + 1,
      managerId: summary.managerId,
      displayName: summary.displayName,
      countriesRostered: summary.countryCount,
      remainingBudget: summary.remainingBudget,
      liveWins: summary.liveWins,
      randomSeed: summary.randomSeed,
      notes: summary.countryCount === getLowestRosterCount_(summaries) ? 'Catch-up eligible now' : 'Wait until roster counts catch up'
    };
  });

  writeTable_(DRAFT_SHEETS.SNAKE_ORDER, DRAFT_HEADERS.DraftSnakeOrder || DRAFT_HEADERS.SnakeDraftOrder, rows);
  writeDraftBudgetBoard_(state);
  return rows;
}

function exportDraftToRosters() {
  var exportData = buildLeagueTabsFromCommandCenter_();
  writeTable_(WC_SHEETS.MANAGERS, WC_HEADERS.Managers, exportData.managers);
  writeTable_(WC_SHEETS.TEAMS, WC_HEADERS.Teams, exportData.teams);
  writeTable_(WC_SHEETS.ROSTERS, WC_HEADERS.Rosters, exportData.rosters);
  appendSyncLog_(
    'info',
    'exportDraftToRosters',
    'Exported Command Center draft into Managers, Teams, and Rosters.',
    'managers=' + exportData.managers.length + ', teams=' + exportData.teams.length + ', rosters=' + exportData.rosters.length
  );
  return exportData;
}

function buildLeagueTabsFromCommandCenter_() {
  var commandRows = readCommandCenterDraftRows_();
  if (commandRows.length === 0) {
    throw new Error('No Command Center picks found. Fill displayName values in DraftCommandCenter rows 9-56 first.');
  }

  var state = getDraftState_();
  var managerByInput = {};
  state.managers.forEach(function (manager) {
    managerByInput[manager.managerId] = manager;
    managerByInput[normalizeId_(manager.displayName)] = manager;
  });

  var managerMap = {};
  var rosters = commandRows.map(function (row, index) {
    var managerInput = normalizeId_(row.displayName);
    var existingManager = managerByInput[managerInput];
    var managerId = existingManager ? existingManager.managerId : normalizeId_(row.displayName);
    var displayName = existingManager ? existingManager.displayName : row.displayName;

    if (!managerMap[managerId]) {
      managerMap[managerId] = {
        managerId: managerId,
        displayName: displayName,
        color: '',
        icon: '',
        active: true
      };
    }

    return {
      managerId: managerId,
      teamId: row.teamId,
      draftSlot: row.pickNumber || index + 1,
      notes: row.phase + ' draft, price=' + row.price
    };
  });

  return {
    managers: Object.keys(managerMap)
      .sort()
      .map(function (managerId) {
        return managerMap[managerId];
      }),
    teams: buildLeagueTeamsFromDraftTeams_(),
    rosters: rosters.sort(function (a, b) {
      return Number(a.draftSlot || 0) - Number(b.draftSlot || 0);
    })
  };
}

function readCommandCenterDraftRows_() {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.COMMAND_CENTER);
  if (!sheet) {
    throw new Error('Run setupDraftSheets first.');
  }

  var values = sheet.getRange(9, 1, 48, 9).getValues();
  return values
    .map(function (row, index) {
      var countryInput = String(row[2] || '').trim();
      var team = findDraftTeamByInput_(countryInput);
      return {
        pickNumber: row[0] === '' ? index + 1 : Number(row[0]),
        displayName: String(row[1] || '').trim(),
        country: countryInput,
        teamId: team ? team.teamId : normalizeId_(countryInput),
        phase: String(row[3] || '').trim().toLowerCase(),
        price: Number(row[4] || 0),
        rowNumber: index + 9
      };
    })
    .filter(function (row) {
      return row.displayName !== '' && row.country !== '';
    });
}

function buildLeagueTeamsFromDraftTeams_() {
  return DRAFT_TEAMS.map(function (team) {
    return {
      teamId: team[0],
      countryName: team[1],
      group: team[2],
      flagEmoji: '',
      status: 'scheduled',
      qualifiedForKnockouts: false,
      wonGroup: false,
      isChampion: false
    };
  });
}

function seedDraftSettings_() {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.SETTINGS);
  if (sheet.getLastRow() <= 1) {
    sheet.getRange(2, 1, DRAFT_DEFAULT_SETTINGS.length, DRAFT_DEFAULT_SETTINGS[0].length).setValues(DRAFT_DEFAULT_SETTINGS);
  }
}

function seedDraftManagers_() {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.MANAGERS);
  if (sheet.getLastRow() > 1) {
    return;
  }

  var rows = [];
  for (var index = 1; index <= 12; index += 1) {
    rows.push(['m' + pad2_(index), 'Manager ' + index, index <= 8, '', '', index, 'Replace with real name']);
  }
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function seedDraftTeams_() {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.TEAMS);
  if (sheet.getLastRow() > 1) {
    return;
  }

  var rows = DRAFT_TEAMS.map(function (team) {
    return team.concat(['', '', '', '', '']);
  });
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function setupDraftCommandCenter_() {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.COMMAND_CENTER);
  sheet.clear();
  sheet.clearConditionalFormatRules();
  sheet.getRange('A1').setValue('World Cup Fantasy Draft Command Center');
  sheet.getRange('Z2:AA6').setValues([
    ['League Size', '=VLOOKUP("numberManagers",DraftSettings!A:B,2,FALSE)'],
    ['Starting Budget', '=VLOOKUP("startingBudget",DraftSettings!A:B,2,FALSE)'],
    ['Roster Size', '=IF(VLOOKUP("rosterSize",DraftSettings!A:B,2,FALSE)="",IF(AA2=8,6,IF(AA2=12,4,"Set rosterSize")),VLOOKUP("rosterSize",DraftSettings!A:B,2,FALSE))'],
    ['Live Cap Enforced?', '=VLOOKUP("enforceLiveAuctionWinCap",DraftSettings!A:B,2,FALSE)'],
    ['Last Refresh', '=VLOOKUP("lastDraftRefreshUtc",DraftSettings!A:B,2,FALSE)']
  ]);
  sheet.getRange('A8:I8').setValues([[
    'pick #',
    'displayName',
    'country',
    'phase',
    'price',
    'notes',
    'recordedAtUtc',
    'status',
    'resolvedIds'
  ]]);
  sheet.getRange('A9:I56').clearContent();
  sheet.getRange('A9:I56').clearDataValidations();
  seedCommandCenterCountryRows_(sheet);
  sheet.getRange('J2').setValue('Live Budget Board');
  sheet.getRange('J17').setValue('Snake Order Preview');
  sheet.getRange('T2').setValue('Anomalies');
  sheet.getRange('A58').setValue('Menu flow');
  sheet.getRange('A59:B64').setValues([
    ['1', 'Set up draft sheets'],
    ['2', 'Enter managers in DraftManagers'],
    ['3', 'Fill displayName and price in rows 9-56'],
    ['4', 'Enter sealed bids in DraftBids'],
    ['5', 'Resolve sealed bids'],
    ['6', 'Generate snake draft order']
  ]);
  sheet.getRange('D9:D56').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['live', 'sealed', 'snake', 'catch-up'], true)
      .build()
  );
  sheet.getRange('A8:I8').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 20);
}

function seedCommandCenterCountryRows_(sheet) {
  var rows = DRAFT_TEAMS.map(function (team, index) {
    var tier = team[3];
    var phase = team[4];
    return [
      '',
      '',
      team[1],
      phase,
      '',
      '',
      '',
      '',
      team[0]
    ];
  });
  sheet.getRange(9, 1, rows.length, rows[0].length).setValues(rows);
}

function getDraftState_() {
  var settings = readDraftSettingsMap_();
  var managers = readDraftRows_(DRAFT_SHEETS.MANAGERS)
    .filter(function (manager) {
      return manager.managerId !== '';
    })
    .map(function (manager) {
      return {
        managerId: normalizeId_(manager.managerId),
        displayName: String(manager.displayName || manager.managerId).trim(),
        active: parseBoolean_(manager.active, true),
        startingBudget: Number(manager.startingBudget || settings.startingBudget || 100),
        rosterSize: Number(manager.rosterSize || getRosterSize_(settings)),
        randomSeed: Number(manager.randomSeed || 999),
        notes: manager.notes || ''
      };
    });

  var teams = readDraftRows_(DRAFT_SHEETS.TEAMS)
    .filter(function (team) {
      return team.teamId !== '';
    })
    .map(function (team) {
      return {
        teamId: normalizeId_(team.teamId),
        countryName: String(team.countryName || '').trim(),
        group: String(team.group || '').trim(),
        draftTier: String(team.draftTier || '').trim(),
        draftPhase: String(team.draftPhase || '').trim().toLowerCase(),
        suggestedOrder: Number(team.suggestedOrder || 999),
        notes: team.notes || ''
      };
    });

  var picks = readDraftRows_(DRAFT_SHEETS.PICKS)
    .filter(function (pick) {
      return pick.managerId !== '' || pick.teamId !== '';
    })
    .map(function (pick, index) {
      return {
        pickNumber: Number(pick.pickNumber || index + 1),
        pickedAtUtc: pick.pickedAtUtc || '',
        phase: String(pick.phase || '').trim().toLowerCase(),
        managerId: normalizeId_(pick.managerId),
        teamId: normalizeId_(pick.teamId),
        price: Number(pick.price || 0),
        notes: pick.notes || '',
        rowNumber: index + 2
      };
    });

  var managerMap = {};
  managers.forEach(function (manager) {
    managerMap[manager.managerId] = manager;
  });

  var teamMap = {};
  teams.forEach(function (team) {
    teamMap[team.teamId] = team;
  });

  var pickByTeam = {};
  picks.forEach(function (pick) {
    if (!pickByTeam[pick.teamId]) {
      pickByTeam[pick.teamId] = pick;
    }
  });

  return {
    settings: settings,
    managers: managers,
    teams: teams,
    picks: picks,
    managerMap: managerMap,
    teamMap: teamMap,
    pickByTeam: pickByTeam
  };
}

function readDraftSettingsMap_() {
  var settings = readDraftRows_(DRAFT_SHEETS.SETTINGS);
  var map = {};
  settings.forEach(function (row) {
    if (row.key !== '') {
      map[row.key] = row.value;
    }
  });
  return map;
}

function readDraftRows_(sheetName) {
  return readTable_(sheetName).map(function (row) {
    var normalized = {};
    Object.keys(row).forEach(function (key) {
      normalized[key] = row[key];
    });
    return normalized;
  });
}

function updateDraftTeamsFromPicks_(state) {
  var rows = state.teams.map(function (team) {
    var pick = state.pickByTeam[team.teamId];
    return {
      teamId: team.teamId,
      countryName: team.countryName,
      group: team.group,
      draftTier: team.draftTier,
      draftPhase: team.draftPhase,
      suggestedOrder: team.suggestedOrder,
      draftedByManagerId: pick ? pick.managerId : '',
      draftPrice: pick ? pick.price : '',
      actualPhase: pick ? pick.phase : '',
      pickNumber: pick ? pick.pickNumber : '',
      notes: team.notes || ''
    };
  });
  writeTable_(DRAFT_SHEETS.TEAMS, DRAFT_HEADERS.DraftTeams, rows);
}

function writeDraftBudgetBoard_(state) {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.COMMAND_CENTER);
  var headers = ['managerId', 'displayName', 'countries', 'budgetSpent', 'remainingBudget', 'maxLegalBid', 'liveWins', 'sealedWins', 'slotsLeft'];
  var values = state.managers.filter(function (manager) {
    return manager.active;
  }).map(function (manager) {
    return [
      manager.managerId,
      manager.displayName,
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ];
  });
  sheet.getRange(3, 10, 40, headers.length).clearContent();
  sheet.getRange(3, 10, 1, headers.length).setValues([headers]);
  if (values.length > 0) {
    sheet.getRange(4, 10, values.length, headers.length).setValues(values);
    writeDraftBudgetFormulas_(sheet, values.length);
    writeLiveSnakeOrderFormulas_(sheet, values.length);
  }
}

function writeDraftBudgetFormulas_(sheet, rowCount) {
  var formulas = [];
  for (var index = 0; index < rowCount; index += 1) {
    var row = 4 + index;
    formulas.push([
      '=COUNTIF($B$9:$B$56,K' + row + ')+COUNTIF($B$9:$B$56,J' + row + ')',
      '=SUMIF($B$9:$B$56,K' + row + ',$E$9:$E$56)+SUMIF($B$9:$B$56,J' + row + ',$E$9:$E$56)',
      '=IF(IFERROR(VLOOKUP(J' + row + ',DraftManagers!A:D,4,FALSE),"")="",VLOOKUP("startingBudget",DraftSettings!A:B,2,FALSE),VLOOKUP(J' + row + ',DraftManagers!A:D,4,FALSE))-M' + row,
      '=MAX(0,N' + row + '-MAX(0,R' + row + '-1)*VLOOKUP("minRemainingBudgetPerOpenSlot",DraftSettings!A:B,2,FALSE))',
      '=COUNTIFS($B$9:$B$56,K' + row + ',$D$9:$D$56,"live")+COUNTIFS($B$9:$B$56,J' + row + ',$D$9:$D$56,"live")',
      '=COUNTIFS($B$9:$B$56,K' + row + ',$D$9:$D$56,"sealed")+COUNTIFS($B$9:$B$56,J' + row + ',$D$9:$D$56,"sealed")',
      '=IF(IFERROR(VLOOKUP(J' + row + ',DraftManagers!A:E,5,FALSE),"")="",IF(VLOOKUP("rosterSize",DraftSettings!A:B,2,FALSE)="",IF(VLOOKUP("numberManagers",DraftSettings!A:B,2,FALSE)=12,4,6),VLOOKUP("rosterSize",DraftSettings!A:B,2,FALSE)),VLOOKUP(J' + row + ',DraftManagers!A:E,5,FALSE))-L' + row
    ]);
  }
  sheet.getRange(4, 12, rowCount, 7).setFormulas(formulas);
}

function writeLiveSnakeOrderFormulas_(sheet, rowCount) {
  var headers = DRAFT_HEADERS.SnakeDraftOrder;
  var endRow = 3 + rowCount;
  sheet.getRange(18, 10, 40, headers.length).clearContent();
  sheet.getRange(18, 10, 1, headers.length).setValues([headers]);
  sheet.getRange('J19').setFormula(
    '=LET(data,FILTER({$J$4:$J$' + endRow + ',$K$4:$K$' + endRow + ',$L$4:$L$' + endRow + ',$N$4:$N$' + endRow + ',$P$4:$P$' + endRow + ',VLOOKUP($J$4:$J$' + endRow + ',DraftManagers!A:F,6,FALSE),IF($L$4:$L$' + endRow + '=MIN(FILTER($L$4:$L$' + endRow + ',$R$4:$R$' + endRow + '>0)),"Catch-up eligible now","Wait until roster counts catch up")},$R$4:$R$' + endRow + '>0),sorted,SORT(data,3,TRUE,4,FALSE,5,TRUE,6,TRUE),{SEQUENCE(ROWS(sorted)),sorted})'
  );
}

function writeSnakeOrderToCommandCenter_(rows) {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.COMMAND_CENTER);
  var headers = DRAFT_HEADERS.SnakeDraftOrder;
  sheet.getRange(18, 10, 40, headers.length).clearContent();
  sheet.getRange(18, 10, 1, headers.length).setValues([headers]);
  if (rows.length > 0) {
    sheet.getRange(19, 10, rows.length, headers.length).setValues(rows.map(function (row) {
      return headers.map(function (header) {
        return row[header] === undefined ? '' : row[header];
      });
    }));
  }
}

function writeDraftAnomalies_(state) {
  var anomalies = buildDraftAnomalies_(state);
  writeTable_(DRAFT_SHEETS.ANOMALIES, DRAFT_HEADERS.DraftAnomalies, anomalies);

  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.COMMAND_CENTER);
  var headers = DRAFT_HEADERS.DraftAnomalies;
  sheet.getRange(3, 20, 80, headers.length).clearContent();
  sheet.getRange(3, 20, 1, headers.length).setValues([headers]);
  writeLiveAnomalyFormulas_(sheet);
}

function writeLiveAnomalyFormulas_(sheet) {
  var formulas = [];
  for (var row = 9; row <= 56; row += 1) {
    var managerKnown = 'OR(COUNTIF(DraftManagers!$B:$B,$B' + row + ')>0,COUNTIF(DraftManagers!$A:$A,$B' + row + ')>0)';
    var hasPick = '$B' + row + '<>""';
    var duplicateCountry = 'COUNTIF($C$9:$C$56,$C' + row + ')>1';
    var missingPrice = 'AND(' + hasPick + ',$E' + row + '="")';
    var invalidPrice = 'AND(' + hasPick + ',$E' + row + '<>"",OR(NOT(ISNUMBER($E' + row + ')),$E' + row + '<0))';
    var unknownManager = 'AND(' + hasPick + ',NOT(' + managerKnown + '))';
    var wrongPaidPrice = 'AND(' + hasPick + ',$E' + row + '<>"",OR($D' + row + '="live",$D' + row + '="sealed"),$E' + row + '<1)';
    var managerFilter = '($K$4:$K$15=$B' + row + ')+($J$4:$J$15=$B' + row + ')';
    var remainingBudget = 'IFERROR(INDEX(FILTER($N$4:$N$15,' + managerFilter + '),1),0)';
    var slotsLeft = 'IFERROR(INDEX(FILTER($R$4:$R$15,' + managerFilter + '),1),0)';
    var overBudget = 'AND(' + hasPick + ',' + managerKnown + ',' + remainingBudget + '<0)';
    var rosterOverfill = 'AND(' + hasPick + ',' + managerKnown + ',' + slotsLeft + '<0)';
    var budgetFloor = 'AND(' + hasPick + ',' + managerKnown + ',' + remainingBudget + '<MAX(0,' + slotsLeft + ')*VLOOKUP("minRemainingBudgetPerOpenSlot",DraftSettings!A:B,2,FALSE))';
    var severityFormula = '=IF(' + unknownManager + ',"error",IF(' + invalidPrice + ',"error",IF(' + duplicateCountry + ',"error",IF(' + wrongPaidPrice + ',"error",IF(' + rosterOverfill + ',"error",IF(' + overBudget + ',"error",IF(' + budgetFloor + ',"error",IF(' + missingPrice + ',"warning",""))))))))';
    var anomalyRow = row - 10;
    var typeFormula = '=IF(T' + anomalyRow + '="","",IF(' + unknownManager + ',"unknown_manager",IF(' + invalidPrice + ',"invalid_price",IF(' + duplicateCountry + ',"duplicate_country",IF(' + wrongPaidPrice + ',"paid_price_floor",IF(' + rosterOverfill + ',"roster_overfill",IF(' + overBudget + ',"over_budget",IF(' + budgetFloor + ',"budget_floor",IF(' + missingPrice + ',"missing_price","")))))))))';
    var messageFormula = '=IF(T' + anomalyRow + '="","",IF(' + unknownManager + ',"Unknown manager/displayName: "&$B' + row + ',IF(' + invalidPrice + ',"Price must be a number zero or greater.",IF(' + duplicateCountry + ',$C' + row + '&" appears more than once.",IF(' + wrongPaidPrice + ',"Live/sealed picks must cost at least $1.",IF(' + rosterOverfill + ',"Manager has more picks than roster slots.",IF(' + overBudget + ',"Manager is over budget.",IF(' + budgetFloor + ',"Manager does not have enough budget for remaining slots.",IF(' + missingPrice + ',"Enter a price for "&$C' + row + ',""))))))))';
    formulas.push([
      severityFormula,
      typeFormula,
      '=IF(T' + anomalyRow + '="","","DraftCommandCenter")',
      '=IF(T' + anomalyRow + '="", "", ' + row + ')',
      messageFormula
    ]);
  }
  sheet.getRange('T4:X80').clearContent();
  sheet.getRange(4, 20, formulas.length, 5).setFormulas(formulas);
}

function buildDraftAnomalies_(state) {
  var anomalies = [];
  var seenTeams = {};
  var activeManagers = state.managers.filter(function (manager) {
    return manager.active;
  });
  var settings = state.settings;
  var liveCap = getLiveAuctionWinCap_(settings);
  var sealedCap = getSealedAuctionWinCap_(settings);
  var enforceLiveCap = parseBoolean_(settings.enforceLiveAuctionWinCap, false);
  var enforceSealedCap = parseBoolean_(settings.sealedAuctionWinCapEnabled, true);
  var expectedManagers = Number(settings.numberManagers || activeManagers.length);

  if (activeManagers.length !== expectedManagers) {
    anomalies.push(draftAnomaly_('warning', 'manager_count', DRAFT_SHEETS.MANAGERS, '', 'Active manager count is ' + activeManagers.length + ', but numberManagers is ' + expectedManagers + '.'));
  }

  state.picks.forEach(function (pick) {
    var manager = state.managerMap[pick.managerId];
    var team = state.teamMap[pick.teamId];
    if (!manager) {
      anomalies.push(draftAnomaly_('error', 'unknown_manager', DRAFT_SHEETS.PICKS, pick.rowNumber, 'Unknown managerId: ' + pick.managerId));
    } else if (!manager.active) {
      anomalies.push(draftAnomaly_('error', 'inactive_manager', DRAFT_SHEETS.PICKS, pick.rowNumber, 'Pick assigned to inactive manager: ' + pick.managerId));
    }
    if (!team) {
      anomalies.push(draftAnomaly_('error', 'unknown_team', DRAFT_SHEETS.PICKS, pick.rowNumber, 'Unknown teamId: ' + pick.teamId));
    }
    if (seenTeams[pick.teamId]) {
      anomalies.push(draftAnomaly_('error', 'duplicate_team', DRAFT_SHEETS.PICKS, pick.rowNumber, 'Team already drafted in row ' + seenTeams[pick.teamId] + ': ' + pick.teamId));
    }
    seenTeams[pick.teamId] = pick.rowNumber;
    if (isNaN(pick.price) || pick.price < 0) {
      anomalies.push(draftAnomaly_('error', 'invalid_price', DRAFT_SHEETS.PICKS, pick.rowNumber, 'Price must be zero or greater.'));
    }
    if (team && pick.phase && team.draftPhase !== pick.phase && !isAllowedCommandCenterPhaseOverride_(team.draftPhase, pick.phase)) {
      anomalies.push(draftAnomaly_('warning', 'phase_mismatch', DRAFT_SHEETS.PICKS, pick.rowNumber, team.countryName + ' belongs to ' + team.draftPhase + ', not ' + pick.phase + '.'));
    }
    if (pick.phase === 'live' && pick.price < 1) {
      anomalies.push(draftAnomaly_('error', 'paid_price_floor', DRAFT_SHEETS.PICKS, pick.rowNumber, 'Live auction picks must cost at least $1.'));
    }
    if (pick.phase === 'sealed' && pick.price < 1) {
      anomalies.push(draftAnomaly_('error', 'paid_price_floor', DRAFT_SHEETS.PICKS, pick.rowNumber, 'Sealed auction picks must cost at least $1.'));
    }
  });

  buildDraftBidAnomalies_(state).forEach(function (anomaly) {
    anomalies.push(anomaly);
  });

  getManagerDraftSummaries_(state).forEach(function (summary) {
    if (!summary.active) {
      return;
    }
    if (summary.countryCount > summary.rosterSize) {
      anomalies.push(draftAnomaly_('error', 'roster_overfill', DRAFT_SHEETS.MANAGERS, '', summary.displayName + ' has ' + summary.countryCount + ' countries but roster size is ' + summary.rosterSize + '.'));
    }
    if (summary.remainingBudget < 0) {
      anomalies.push(draftAnomaly_('error', 'over_budget', DRAFT_SHEETS.MANAGERS, '', summary.displayName + ' is over budget by $' + Math.abs(summary.remainingBudget) + '.'));
    }
    if (summary.remainingBudget < summary.slotsLeft * getMinBudgetPerOpenSlot_(settings)) {
      anomalies.push(draftAnomaly_('error', 'budget_floor', DRAFT_SHEETS.MANAGERS, '', summary.displayName + ' does not have enough budget to preserve minimum future bids.'));
    }
    if (enforceLiveCap && summary.liveWins > liveCap) {
      anomalies.push(draftAnomaly_('error', 'live_cap', DRAFT_SHEETS.MANAGERS, '', summary.displayName + ' exceeds live auction cap of ' + liveCap + '.'));
    }
    if (enforceSealedCap && summary.sealedWins > sealedCap) {
      anomalies.push(draftAnomaly_('error', 'sealed_cap', DRAFT_SHEETS.MANAGERS, '', summary.displayName + ' exceeds sealed auction cap of ' + sealedCap + '.'));
    }
  });

  return anomalies;
}

function buildDraftBidAnomalies_(state) {
  var anomalies = [];
  var seenBid = {};
  var bids = readDraftRows_(DRAFT_SHEETS.BIDS);

  bids.forEach(function (bid, index) {
    var rowNumber = index + 2;
    if (bid.managerId === '' && bid.teamId === '' && bid.bidAmount === '') {
      return;
    }

    var managerId = normalizeId_(bid.managerId);
    var teamId = normalizeId_(bid.teamId);
    var amount = Number(bid.bidAmount);
    var manager = state.managerMap[managerId];
    var team = state.teamMap[teamId];
    var bidKey = managerId + '|' + teamId;

    if (!manager) {
      anomalies.push(draftAnomaly_('error', 'bid_unknown_manager', DRAFT_SHEETS.BIDS, rowNumber, 'Unknown managerId in sealed bid: ' + managerId));
    } else if (!manager.active) {
      anomalies.push(draftAnomaly_('error', 'bid_inactive_manager', DRAFT_SHEETS.BIDS, rowNumber, 'Inactive manager submitted sealed bid: ' + managerId));
    }
    if (!team) {
      anomalies.push(draftAnomaly_('error', 'bid_unknown_team', DRAFT_SHEETS.BIDS, rowNumber, 'Unknown teamId in sealed bid: ' + teamId));
    } else if (team.draftPhase !== 'sealed') {
      anomalies.push(draftAnomaly_('error', 'bid_wrong_phase', DRAFT_SHEETS.BIDS, rowNumber, team.countryName + ' is not a Tier C sealed-auction country.'));
    } else if (state.pickByTeam[teamId]) {
      anomalies.push(draftAnomaly_('error', 'bid_team_taken', DRAFT_SHEETS.BIDS, rowNumber, team.countryName + ' is already drafted.'));
    }
    if (isNaN(amount) || amount < 1) {
      anomalies.push(draftAnomaly_('error', 'bid_invalid_amount', DRAFT_SHEETS.BIDS, rowNumber, 'Sealed bid amount must be at least $1.'));
    }
    if (seenBid[bidKey]) {
      anomalies.push(draftAnomaly_('warning', 'bid_duplicate', DRAFT_SHEETS.BIDS, rowNumber, 'Duplicate manager/team bid also appears in row ' + seenBid[bidKey] + '.'));
    }
    seenBid[bidKey] = rowNumber;
    if (manager && !isNaN(amount) && amount > calculateManagerDraftSummary_(managerId, state, {}).maxLegalBid) {
      anomalies.push(draftAnomaly_('warning', 'bid_over_current_max', DRAFT_SHEETS.BIDS, rowNumber, 'Bid exceeds current max legal bid before sealed awards are resolved.'));
    }
  });

  return anomalies;
}

function getManagerDraftSummaries_(state) {
  return state.managers.map(function (manager) {
    return calculateManagerDraftSummary_(manager.managerId, state, {});
  });
}

function calculateManagerDraftSummary_(managerId, state, pendingAwardsByTeam) {
  var manager = state.managerMap[managerId];
  var picks = state.picks.filter(function (pick) {
    return pick.managerId === managerId;
  });
  Object.keys(pendingAwardsByTeam || {}).forEach(function (teamId) {
    var award = pendingAwardsByTeam[teamId];
    if (award.managerId === managerId) {
      picks.push({
        phase: award.phase,
        price: award.price,
        managerId: managerId,
        teamId: teamId
      });
    }
  });

  var spent = picks.reduce(function (total, pick) {
    return total + Number(pick.price || 0);
  }, 0);
  var countryCount = picks.length;
  var liveWins = picks.filter(function (pick) {
    return pick.phase === 'live';
  }).length;
  var sealedWins = picks.filter(function (pick) {
    return pick.phase === 'sealed';
  }).length;
  var rosterSize = manager ? manager.rosterSize : getRosterSize_(state.settings);
  var startingBudget = manager ? manager.startingBudget : Number(state.settings.startingBudget || 100);
  var remainingBudget = startingBudget - spent;
  var slotsLeft = Math.max(0, rosterSize - countryCount);
  var minFuture = getMinBudgetPerOpenSlot_(state.settings) * Math.max(0, slotsLeft - 1);
  var maxLegalBid = slotsLeft > 0 ? Math.max(0, remainingBudget - minFuture) : 0;

  return {
    managerId: managerId,
    displayName: manager ? manager.displayName : managerId,
    active: manager ? manager.active : false,
    countryCount: countryCount,
    spent: spent,
    remainingBudget: remainingBudget,
    maxLegalBid: maxLegalBid,
    liveWins: liveWins,
    sealedWins: sealedWins,
    slotsLeft: slotsLeft,
    rosterSize: rosterSize,
    randomSeed: manager ? manager.randomSeed : 999
  };
}

function isLegalDraftPrice_(managerId, price, state, pendingAwardsByTeam) {
  var summary = calculateManagerDraftSummary_(managerId, state, pendingAwardsByTeam || {});
  if (!summary.active || summary.slotsLeft <= 0) {
    return false;
  }
  return Number(price) <= summary.maxLegalBid;
}

function appendDraftPick_(phase, managerId, teamId, price, notes) {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.PICKS);
  var nextPick = Math.max(1, sheet.getLastRow());
  sheet.appendRow([
    nextPick,
    new Date().toISOString(),
    phase,
    normalizeId_(managerId),
    normalizeId_(teamId),
    Number(price || 0),
    notes || ''
  ]);
  return nextPick;
}

function findDraftTeamByInput_(input) {
  var normalized = normalizeId_(input);
  var teams = readDraftRows_(DRAFT_SHEETS.TEAMS);
  for (var index = 0; index < teams.length; index += 1) {
    var team = teams[index];
    if (normalizeId_(team.teamId) === normalized || normalizeId_(team.countryName) === normalized) {
      return {
        teamId: normalizeId_(team.teamId),
        countryName: team.countryName
      };
    }
  }
  return null;
}

function findDraftManagerByInput_(input, state) {
  var normalized = normalizeId_(input);
  var managers = state ? state.managers : getDraftState_().managers;
  for (var index = 0; index < managers.length; index += 1) {
    var manager = managers[index];
    if (manager.managerId === normalized || normalizeId_(manager.displayName) === normalized) {
      return manager;
    }
  }
  return null;
}

function isAllowedCommandCenterPhaseOverride_(teamDraftPhase, pickPhase) {
  return (teamDraftPhase === 'snake' && pickPhase === 'catch-up') ||
    (teamDraftPhase === 'snake' && pickPhase === 'sealed');
}

function formatDraftWorkbook_() {
  var spreadsheet = getFantasySpreadsheet_();
  formatCoreFantasySheets_(spreadsheet);
  formatBasicDraftSheet_(spreadsheet.getSheetByName(DRAFT_SHEETS.SETTINGS));
  formatBasicDraftSheet_(spreadsheet.getSheetByName(DRAFT_SHEETS.MANAGERS));
  formatBasicDraftSheet_(spreadsheet.getSheetByName(DRAFT_SHEETS.PICKS));
  formatBasicDraftSheet_(spreadsheet.getSheetByName(DRAFT_SHEETS.BIDS));
  formatBasicDraftSheet_(spreadsheet.getSheetByName(DRAFT_SHEETS.SNAKE_ORDER));
  formatDraftTeamsSheet_(spreadsheet.getSheetByName(DRAFT_SHEETS.TEAMS));
  formatDraftAnomaliesSheet_(spreadsheet.getSheetByName(DRAFT_SHEETS.ANOMALIES));
  formatDraftCommandCenter_(spreadsheet.getSheetByName(DRAFT_SHEETS.COMMAND_CENTER));
}

function formatCoreFantasySheets_(spreadsheet) {
  if (typeof WC_HEADERS === 'undefined') {
    return;
  }

  Object.keys(WC_HEADERS).forEach(function (sheetName) {
    formatBasicDraftSheet_(spreadsheet.getSheetByName(sheetName));
  });
}

function formatBasicDraftSheet_(sheet) {
  if (!sheet) {
    return;
  }

  var lastRow = Math.max(sheet.getLastRow(), 1);
  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, lastColumn)
    .setBackground(DRAFT_COLORS.NAVY)
    .setFontColor(DRAFT_COLORS.WHITE)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.getRange(1, 1, lastRow, lastColumn)
    .setBorder(true, true, true, true, true, true, DRAFT_COLORS.GRID, SpreadsheetApp.BorderStyle.SOLID);

  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastColumn)
      .setBackground(DRAFT_COLORS.WHITE)
      .setFontColor(DRAFT_COLORS.INK);
    applyAlternatingRows_(sheet, 2, lastRow, lastColumn);
  }
  sheet.autoResizeColumns(1, Math.min(lastColumn, 12));
}

function formatDraftTeamsSheet_(sheet) {
  if (!sheet) {
    return;
  }

  formatBasicDraftSheet_(sheet);
  var lastRow = Math.max(sheet.getLastRow(), 2);
  if (lastRow < 2) {
    return;
  }

  var tierRange = sheet.getRange(2, 4, lastRow - 1, 1);
  var phaseRange = sheet.getRange(2, 5, lastRow - 1, 1);
  var draftedRange = sheet.getRange(2, 7, lastRow - 1, 3);
  clearConditionalRulesForSheet_(sheet);
  sheet.setConditionalFormatRules([
    textRule_(tierRange, 'A', DRAFT_COLORS.SOFT_GOLD),
    textRule_(tierRange, 'B', DRAFT_COLORS.SOFT_BLUE),
    textRule_(tierRange, 'C', DRAFT_COLORS.SOFT_GREEN),
    textRule_(tierRange, 'D/E', DRAFT_COLORS.SOFT_PURPLE),
    textRule_(phaseRange, 'live', DRAFT_COLORS.SOFT_GOLD),
    textRule_(phaseRange, 'sealed', DRAFT_COLORS.SOFT_GREEN),
    textRule_(phaseRange, 'snake', DRAFT_COLORS.SOFT_PURPLE),
    nonEmptyRule_(draftedRange, DRAFT_COLORS.SOFT_GRAY)
  ]);
  sheet.setColumnWidths(1, 1, 145);
  sheet.setColumnWidths(2, 1, 150);
  sheet.setColumnWidths(4, 2, 95);
  sheet.setColumnWidths(7, 3, 130);
}

function formatDraftAnomaliesSheet_(sheet) {
  if (!sheet) {
    return;
  }

  formatBasicDraftSheet_(sheet);
  var lastRow = Math.max(sheet.getLastRow(), 2);
  if (lastRow < 2) {
    return;
  }

  var severityRange = sheet.getRange(2, 1, lastRow - 1, 1);
  clearConditionalRulesForSheet_(sheet);
  sheet.setConditionalFormatRules([
    textRule_(severityRange, 'error', DRAFT_COLORS.SOFT_RED),
    textRule_(severityRange, 'warning', DRAFT_COLORS.SOFT_ORANGE)
  ]);
  sheet.setColumnWidths(1, 1, 95);
  sheet.setColumnWidths(2, 1, 150);
  sheet.setColumnWidths(5, 1, 520);
}

function formatDraftCommandCenter_(sheet) {
  if (!sheet) {
    return;
  }

  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(13);
  sheet.getRange('A1:X1')
    .breakApart()
    .merge()
    .setValue('World Cup Fantasy Draft Command Center')
    .setBackground(DRAFT_COLORS.NAVY)
    .setFontColor(DRAFT_COLORS.WHITE)
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center');

  formatCommandSection_(sheet, 'A8:I56', 'Pick Entry', DRAFT_COLORS.SOFT_GOLD);
  formatCommandSection_(sheet, 'J2:R15', 'Live Budget Board', DRAFT_COLORS.SOFT_GREEN);
  formatCommandSection_(sheet, 'J17:Q35', 'Snake Order Preview', DRAFT_COLORS.SOFT_PURPLE);
  formatCommandSection_(sheet, 'T2:X30', 'Anomalies', DRAFT_COLORS.SOFT_RED);
  formatCommandSection_(sheet, 'A58:B64', 'Menu Flow', DRAFT_COLORS.SOFT_GRAY);
  formatCommandSection_(sheet, 'Z1:AA6', 'Settings', DRAFT_COLORS.SOFT_GRAY);

  sheet.getRange('A8:I8')
    .setBackground(DRAFT_COLORS.GOLD)
    .setFontColor(DRAFT_COLORS.INK)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.getRange('A9:I56')
    .setBackground(DRAFT_COLORS.WHITE)
    .setBorder(true, true, true, true, true, true, DRAFT_COLORS.GRID, SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange('J3:R3')
    .setBackground(DRAFT_COLORS.GREEN)
    .setFontColor(DRAFT_COLORS.WHITE)
    .setFontWeight('bold');
  sheet.getRange('J18:Q18')
    .setBackground(DRAFT_COLORS.PURPLE)
    .setFontColor(DRAFT_COLORS.WHITE)
    .setFontWeight('bold');
  sheet.getRange('T3:X3')
    .setBackground(DRAFT_COLORS.RED)
    .setFontColor(DRAFT_COLORS.WHITE)
    .setFontWeight('bold');

  var lastRow = Math.max(sheet.getLastRow(), 80);
  sheet.getRange(1, 1, lastRow, 24).setVerticalAlignment('middle');
  sheet.setColumnWidths(1, 1, 70);
  sheet.setColumnWidths(2, 1, 135);
  sheet.setColumnWidths(3, 1, 150);
  sheet.setColumnWidths(4, 1, 95);
  sheet.setColumnWidths(5, 1, 75);
  sheet.setColumnWidths(6, 1, 180);
  sheet.setColumnWidths(7, 1, 160);
  sheet.setColumnWidths(8, 1, 95);
  sheet.setColumnWidths(9, 1, 170);
  sheet.setColumnWidths(10, 9, 110);
  sheet.setColumnWidths(20, 5, 155);
  sheet.setColumnWidths(26, 2, 145);

  repairCommandCenterValidations_(sheet);
  applyCommandCenterConditionalFormatting_(sheet);
}

function repairCommandCenterValidations_(sheet) {
  sheet.getRange('C9:C56').clearDataValidations();
  sheet.getRange('D9:D56').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['live', 'sealed', 'snake', 'catch-up'], true)
      .build()
  );
}

function formatCommandSection_(sheet, a1Notation, title, background) {
  var range = sheet.getRange(a1Notation);
  range
    .setBorder(true, true, true, true, false, false, DRAFT_COLORS.NAVY, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
    .setBackground(background);
  var titleCell = range.getCell(1, 1);
  titleCell
    .setValue(title)
    .setFontWeight('bold')
    .setFontColor(DRAFT_COLORS.INK);
}

function applyCommandCenterConditionalFormatting_(sheet) {
  var phaseRange = sheet.getRange('D9:D56');
  var statusRange = sheet.getRange('H9:H56');
  var anomalySeverityRange = sheet.getRange('T4:T80');
  var pickRows = sheet.getRange('A9:I56');
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$T4="error"')
      .setBackground(DRAFT_COLORS.SOFT_RED)
      .setRanges([pickRows])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$T4="warning"')
      .setBackground(DRAFT_COLORS.SOFT_ORANGE)
      .setRanges([pickRows])
      .build(),
    textRule_(phaseRange, 'live', DRAFT_COLORS.SOFT_GOLD),
    textRule_(phaseRange, 'sealed', DRAFT_COLORS.SOFT_GREEN),
    textRule_(phaseRange, 'snake', DRAFT_COLORS.SOFT_PURPLE),
    textRule_(phaseRange, 'catch-up', DRAFT_COLORS.SOFT_BLUE),
    textRule_(statusRange, 'recorded', DRAFT_COLORS.SOFT_GREEN),
    textRule_(statusRange, 'error', DRAFT_COLORS.SOFT_RED),
    textRule_(anomalySeverityRange, 'error', DRAFT_COLORS.SOFT_RED),
    textRule_(anomalySeverityRange, 'warning', DRAFT_COLORS.SOFT_ORANGE)
  ]);
}

function applyAlternatingRows_(sheet, startRow, lastRow, lastColumn) {
  for (var row = startRow; row <= lastRow; row += 1) {
    if ((row - startRow) % 2 === 1) {
      sheet.getRange(row, 1, 1, lastColumn).setBackground(DRAFT_COLORS.SOFT_GRAY);
    }
  }
}

function clearConditionalRulesForSheet_(sheet) {
  sheet.setConditionalFormatRules([]);
}

function textRule_(range, text, background) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(text)
    .setBackground(background)
    .setRanges([range])
    .build();
}

function nonEmptyRule_(range, background) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenCellNotEmpty()
    .setBackground(background)
    .setRanges([range])
    .build();
}

function writeDraftSettingsValue_(key, value) {
  var sheet = getFantasySpreadsheet_().getSheetByName(DRAFT_SHEETS.SETTINGS);
  var values = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();
  for (var index = 1; index < values.length; index += 1) {
    if (values[index][0] === key) {
      sheet.getRange(index + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value, '']);
}

function getRosterSize_(settings) {
  if (settings.rosterSize !== '' && settings.rosterSize !== undefined) {
    return Number(settings.rosterSize);
  }
  var managerCount = Number(settings.numberManagers || 8);
  if (managerCount === 12) return 4;
  return 6;
}

function getLiveAuctionWinCap_(settings) {
  if (settings.liveAuctionWinCap !== '' && settings.liveAuctionWinCap !== undefined) {
    return Number(settings.liveAuctionWinCap);
  }
  return Math.floor(getRosterSize_(settings) / 2);
}

function getSealedAuctionWinCap_(settings) {
  if (settings.sealedAuctionWinCap !== '' && settings.sealedAuctionWinCap !== undefined) {
    return Number(settings.sealedAuctionWinCap);
  }
  return Number(settings.numberManagers || 8) === 12 ? 1 : 2;
}

function getMinBudgetPerOpenSlot_(settings) {
  return Number(settings.minRemainingBudgetPerOpenSlot || 1);
}

function getLowestRosterCount_(summaries) {
  if (summaries.length === 0) return 0;
  return summaries.reduce(function (lowest, summary) {
    return Math.min(lowest, summary.countryCount);
  }, summaries[0].countryCount);
}

function normalizeId_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseBoolean_(value, defaultValue) {
  if (value === '' || value === undefined || value === null) {
    return defaultValue;
  }
  if (value === true || value === false) {
    return value;
  }
  return String(value).trim().toLowerCase() === 'true';
}

function pad2_(value) {
  return value < 10 ? '0' + value : String(value);
}

function draftAnomaly_(severity, type, sheetName, rowNumber, message) {
  return {
    severity: severity,
    type: type,
    sheetName: sheetName,
    rowNumber: rowNumber,
    message: message
  };
}
