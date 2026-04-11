import React, { useState, useEffect, useCallback, useMemo } from "react";

const MASTERS_GREEN = "#006747";
const MASTERS_YELLOW = "#FFCD00";
const MASTERS_LIGHT = "#f0f4f0";

const TEAM_BIDS = {
  KING: 20654,
  HOCH: 27300,
  MALLOY: 13642,
  KRAHN: 26550,
  GUTSCHOW: 7304,
  BARRY: 8167,
  VERCHOTTA: 16700,
  ORR: 11017,
  BAR: 16021,
};

const TEAM_COLORS = {
  KING: "#1a3a5c",
  HOCH: "#2d5016",
  MALLOY: "#7b3308",
  KRAHN: "#5a1e8c",
  GUTSCHOW: "#6b3200",
  BARRY: "#9b0000",
  VERCHOTTA: "#004d6b",
  ORR: "#333333",
  BAR: "#005a5a",
};

const BASE_PAYOUTS = [
  27093.99, 20503.56, 16109.94, 13180.86, 11716.32,
  7322.7, 7322.7, 5858.16, 5858.16, 5858.16,
  2929.08, 2929.08, 2929.08, 2929.08, 2929.08,
  2196.81, 2196.81, 2196.81, 2196.81, 2196.81,
];

const POSITION_POT = 146454;

const SPECIAL_PRIZES = [
  { key: "r1Leader", label: "1st Round Leader", amount: 300 },
  { key: "r2Leader", label: "2nd Round Leader", amount: 300 },
  { key: "worst36", label: "Worst 36-Hole Score", amount: 150 },
  { key: "lowAmateur", label: "Low Amateur", amount: 150 },
];

const SPECIAL_PRIZE_POT = SPECIAL_PRIZES.reduce((sum, p) => sum + p.amount, 0);

const AMATEURS = new Set(["Fang, Ethan", "Howell, Mason"]);

// [name, ownership, aliases, r1, r2, dnp?]
const POOL = [
  // -- Active Competitors --
  ["Scheffler, Scottie", [["BARRY", 0.25], ["MALLOY", 0.5], ["KING", 0.25]], ["scottie scheffler", "scheffler"], null, null],
  ["McIlroy, Rory", [["KRAHN", 0.5], ["BAR", 0.5]], ["rory mcilroy", "mcilroy"], null, null],
  ["Aberg, Ludvig", [["VERCHOTTA", 0.5], ["KING", 0.5]], ["ludvig aberg", "aberg", "ludvig åberg"], null, null],
  ["Fleetwood, Tommy", [["HOCH", 1]], ["tommy fleetwood", "fleetwood"], null, null],
  ["Schauffele, Xander", [["HOCH", 1]], ["xander schauffele", "schauffele"], null, null],
  ["Morikawa, Collin", [["HOCH", 0.5], ["GUTSCHOW", 0.5]], ["collin morikawa", "morikawa"], null, null],
  ["Spieth, Jordan", [["GUTSCHOW", 1]], ["jordan spieth", "spieth"], null, null],
  ["Hovland, Viktor", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["viktor hovland", "hovland"], null, null],
  ["Thomas, Justin", [["KING", 1]], ["justin thomas"], null, null],
  ["Koepka, Brooks", [["BAR", 0.5], ["KING", 0.5]], ["brooks koepka", "koepka"], null, null],
  ["Rose, Justin", [["KING", 1]], ["justin rose", "rose"], null, null],
  ["Day, Jason", [["KRAHN", 1]], ["jason day", "day"], null, null],
  ["Matsuyama, Hideki", [["VERCHOTTA", 1]], ["hideki matsuyama", "matsuyama"], null, null],
  ["Hatton, Tyrrell", [["BAR", 1]], ["tyrrell hatton", "hatton"], null, null],
  ["Reed, Patrick", [["HOCH", 0.333], ["KING", 0.333], ["MALLOY", 0.333]], ["patrick reed", "reed"], null, null],
  ["Lowry, Shane", [["MALLOY", 1]], ["shane lowry", "lowry"], null, null],
  ["Rahm, Jon", [["VERCHOTTA", 1]], ["jon rahm", "rahm"], null, null],
  ["Clark, Wyndham", [["KRAHN", 1]], ["wyndham clark", "clark"], null, null],
  ["Young, Cameron", [["HOCH", 1]], ["cameron young", "young"], null, null],
  ["Burns, Sam", [["KING", 1]], ["sam burns", "burns"], null, null],
  ["Bhatia, Akshay", [["KING", 0.5], ["MALLOY", 0.5]], ["akshay bhatia", "bhatia"], null, null],
  ["Scott, Adam", [["BARRY", 0.333], ["MALLOY", 0.333], ["KING", 0.333]], ["adam scott"], null, null],
  ["Henley, Russell", [["HOCH", 0.333], ["ORR", 0.333], ["BARRY", 0.167], ["GUTSCHOW", 0.167]], ["russell henley", "henley"], null, null],
  ["Im, Sungjae", [["MALLOY", 0.5], ["KING", 0.5]], ["sungjae im", "im"], null, null],
  ["Harman, Brian", [["KING", 0.5], ["MALLOY", 0.5]], ["brian harman", "harman"], null, null],
  ["Lee, Min Woo", [["HOCH", 0.667], ["BARRY", 0.333]], ["min woo lee", "min-woo lee"], null, null],
  ["DeChambeau, Bryson", [["KRAHN", 0.5], ["KING", 0.25], ["MALLOY", 0.25]], ["bryson dechambeau", "dechambeau"], null, null],
  ["MacIntyre, Robert", [["BAR", 1]], ["robert macintyre", "macintyre"], null, null],
  ["Fitzpatrick, Matt", [["KRAHN", 0.5], ["BAR", 0.5]], ["matt fitzpatrick", "fitzpatrick"], null, null],
  ["Cantlay, Patrick", [["KRAHN", 1]], ["patrick cantlay", "cantlay"], null, null],
  ["Greyserman, Max", [["KING", 1]], ["max greyserman", "greyserman"], null, null],
  ["Johnson, Dustin", [["KING", 1]], ["dustin johnson"], null, null],
  ["Garcia, Sergio", [["VERCHOTTA", 1]], ["sergio garcia", "garcia"], null, null],
  ["Homa, Max", [["KRAHN", 1]], ["max homa", "homa"], null, null],
  ["Smith, Cameron", [["VERCHOTTA", 1]], ["cameron smith"], null, null],
  ["Kitayama, Kurt", [["VERCHOTTA", 1]], ["kurt kitayama", "kitayama"], null, null],
  ["Woodland, Gary", [["KRAHN", 1]], ["gary woodland", "woodland"], null, null],
  ["Spaun, J.J.", [["KING", 0.667], ["BARRY", 0.333]], ["j.j. spaun", "jj spaun", "spaun"], null, null],
  ["Kataoka, Naoyuki", [["KING", 0.667], ["BARRY", 0.333]], ["naoyuki kataoka", "kataoka"], null, null],
  ["Hojgaard, Rasmus", [["BAR", 0.5], ["KRAHN", 0.5]], ["rasmus hojgaard", "rasmus højgaard"], null, null],
  ["Hojgaard, Nicolai", [["BAR", 0.5], ["KRAHN", 0.5]], ["nicolai hojgaard", "nicolai højgaard"], null, null],
  ["Conners, Corey", [["ORR", 0.5], ["HOCH", 0.5]], ["corey conners", "conners"], null, null],
  ["Watson, Bubba", [["KRAHN", 1]], ["bubba watson"], null, null],
  ["Fox, Ryan", [["VERCHOTTA", 1]], ["ryan fox"], null, null],
  ["Straka, Sepp", [["HOCH", 1]], ["sepp straka", "straka"], null, null],
  ["Gotterup, Chris", [["ORR", 0.5], ["KRAHN", 0.5]], ["chris gotterup", "gotterup"], null, null],
  ["Knapp, Jake", [["ORR", 0.5], ["KRAHN", 0.5]], ["jake knapp", "knapp"], null, null],
  ["Bradley, Keegan", [["ORR", 0.5], ["BARRY", 0.5]], ["keegan bradley", "bradley"], null, null],
  ["McNealy, Maverick", [["ORR", 0.5], ["KRAHN", 0.5]], ["maverick mcnealy", "mcnealy"], null, null],
  ["Berger, Daniel", [["KRAHN", 1]], ["daniel berger", "berger"], null, null],
  ["McKibbin, Tom", [["ORR", 0.5], ["BARRY", 0.5]], ["tom mckibbin", "mckibbin"], null, null],
  ["Rai, Aaron", [["KRAHN", 1]], ["aaron rai", "rai"], null, null],
  ["Noren, Alex", [["ORR", 0.5], ["GUTSCHOW", 0.25], ["BARRY", 0.25]], ["alex noren", "noren"], null, null],
  ["Novak, Andrew", [["ORR", 0.5], ["GUTSCHOW", 0.25], ["BARRY", 0.25]], ["andrew novak", "novak"], null, null],
  ["Neergaard-Petersen, Rasmus", [["ORR", 0.5], ["GUTSCHOW", 0.25], ["BARRY", 0.25]], ["rasmus neergaard-petersen", "neergaard-petersen", "neergaard petersen"], null, null],
  ["Bridgeman, Jacob", [["ORR", 0.5], ["GUTSCHOW", 0.25], ["BARRY", 0.25]], ["jacob bridgeman", "bridgeman"], null, null],
  ["Reitan, Kristoffer", [["ORR", 0.5], ["GUTSCHOW", 0.25], ["BARRY", 0.25]], ["kristoffer reitan", "reitan"], null, null],
  ["Willett, Danny", [["ORR", 0.5], ["GUTSCHOW", 0.25], ["BARRY", 0.25]], ["danny willett", "willett"], null, null],
  ["Griffin, Ben", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["ben griffin", "griffin"], null, null],
  ["Kim, Si Woo", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["si woo kim", "si-woo kim"], null, null],
  ["Keefer, John", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["john keefer", "keefer"], null, null],
  ["Campbell, Brian", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["brian campbell", "campbell"], null, null],
  ["Cabrera, Angel", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["angel cabrera", "cabrera"], null, null],
  ["Gerard, Ryan", [["HOCH", 0.333], ["BARRY", 0.333], ["GUTSCHOW", 0.333]], ["ryan gerard", "gerard"], null, null],
  ["Hall, Harry", [["HOCH", 0.333], ["BARRY", 0.333], ["GUTSCHOW", 0.333]], ["harry hall", "hall"], null, null],
  ["Jarvis, Casey", [["HOCH", 0.333], ["BARRY", 0.333], ["GUTSCHOW", 0.333]], ["casey jarvis", "jarvis"], null, null],
  ["Penge, Marco", [["GUTSCHOW", 1]], ["marco penge", "penge"], null, null],
  ["Ortiz, Carlos", [["ORR", 0.5], ["GUTSCHOW", 0.5]], ["carlos ortiz", "ortiz"], null, null],
  ["Brennan, Michael", [["ORR", 0.5], ["GUTSCHOW", 0.5]], ["michael brennan", "brennan"], null, null],
  ["Riley, Davis", [["ORR", 0.5], ["BARRY", 0.5]], ["davis riley", "riley"], null, null],
  ["Stevens, Samuel", [["ORR", 0.5], ["BARRY", 0.5]], ["sam stevens", "samuel stevens", "stevens"], null, null],
  ["Echavarria, Nicolas", [["KRAHN", 1]], ["nicolas echavarria", "echavarria"], null, null],
  ["Potgieter, Aldrich", [["KRAHN", 1]], ["aldrich potgieter", "potgieter"], null, null],
  ["Li, Haotong", [["KRAHN", 1]], ["haotong li", "li haotong"], null, null],
  ["Howell, Mason", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["mason howell", "howell"], null, null],
  ["Fang, Ethan", [["KRAHN", 1]], ["ethan fang", "fang"], null, null],
  ["Kim, Michael", [["KRAHN", 1]], ["michael kim"], null, null],
  ["Taylor, Nick", [["KRAHN", 1]], ["nick taylor"], null, null],
  ["Weir, Mike", [["KRAHN", 1]], ["mike weir", "weir"], null, null],
  ["Johnson, Zach", [["HOCH", 1]], ["zach johnson"], null, null],
  ["McCarty, Matt", [["HOCH", 1]], ["matt mccarty", "mccarty"], null, null],
  ["Olazabal, Jose Maria", [["HOCH", 1]], ["jose maria olazabal", "olazabal"], null, null],
  ["Valimaki, Sami", [["HOCH", 1]], ["sami valimaki", "valimaki"], null, null],
  ["English, Harris", [["BAR", 1]], ["harris english", "english"], null, null],
  ["Schwartzel, Charl", [["BAR", 1]], ["charl schwartzel", "schwartzel"], null, null],
  ["Couples, Fred", [["BAR", 1]], ["fred couples", "couples"], null, null],
  ["Singh, Vijay", [["KRAHN", 1]], ["vijay singh", "singh"], null, null],

  // -- DNP Past Champions (paired with active players in draft) --
  ["Stadler, Craig", [["BARRY", 0.25], ["MALLOY", 0.5], ["KING", 0.25]], ["craig stadler"], null, null, true],
  ["Langer, Bernhard", [["BAR", 0.5], ["KING", 0.5]], ["bernhard langer"], null, null, true],
  ["Mize, Larry", [["HOCH", 0.333], ["KING", 0.333], ["MALLOY", 0.333]], ["larry mize"], null, null, true],
  ["Lyle, Sandy", [["HOCH", 0.5], ["GUTSCHOW", 0.5]], ["sandy lyle"], null, null, true],
  ["Crenshaw, Ben", [["HOCH", 1]], ["ben crenshaw"], null, null, true],
  ["Faldo, Nick", [["KRAHN", 0.5], ["BAR", 0.5]], ["nick faldo"], null, null, true],
  ["Woods, Tiger", [["KRAHN", 0.5], ["BAR", 0.5]], ["tiger woods"], null, null, true],
  ["Mickelson, Phil", [["KRAHN", 0.5], ["BAR", 0.5]], ["phil mickelson"], null, null, true],
  ["Immelman, Trevor", [["KING", 1]], ["trevor immelman"], null, null, true],
  ["Nicklaus, Jack", [["KRAHN", 1]], ["jack nicklaus"], null, null, true],
  ["OMeara, Mark", [["KRAHN", 1]], ["mark o'meara", "omeara"], null, null, true],
  ["Floyd, Raymond", [["KRAHN", 1]], ["raymond floyd"], null, null, true],
  ["Watson, Tom", [["HOCH", 1]], ["tom watson"], null, null, true],
  ["Player, Gary", [["KRAHN", 1]], ["gary player"], null, null, true],
  ["Coody, Charles", [["VERCHOTTA", 1]], ["charles coody"], null, null, true],
  ["Woosnam, Ian", [["ORR", 0.5], ["GUTSCHOW", 0.25], ["BARRY", 0.25]], ["ian woosnam"], null, null, true],
  ["Aaron, Tommy", [["ORR", 0.5], ["GUTSCHOW", 0.5]], ["tommy aaron"], null, null, true],
];

function fmtScore(s) {
  if (s === null || s === undefined) return "-";
  if (s === 0) return "E";
  return s > 0 ? `+${s}` : `${s}`;
}

function fmtMoney(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtMoneyFull(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  return "$" + n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseScore(str) {
  if (str === null || str === undefined || str === "") return null;
  if (str === "E" || str === "Even") return 0;
  const n = parseInt(String(str), 10);
  return Number.isNaN(n) ? null : n;
}

function normalizeName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,']/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function matchPlayer(name) {
  const n = normalizeName(name);
  if (!n) return null;

  for (const p of POOL.filter((row) => !row[5])) {
    const aliases = p[2].map(normalizeName);
    if (aliases.some((a) => n === a || n.includes(a) || a.includes(n))) {
      return p;
    }
  }

  const last = n.split(" ").pop();
  if (last && last.length >= 4) {
    for (const p of POOL.filter((row) => !row[5])) {
      const aliases = p[2].map(normalizeName);
      if (aliases.some((a) => a === last || a.endsWith(" " + last))) {
        return p;
      }
    }
  }

  return null;
}

function sumBasePayouts() {
  return BASE_PAYOUTS.reduce((sum, n) => sum + n, 0);
}

function computePayouts(sorted) {
  const prizes = new Array(sorted.length).fill(0);
  let i = 0;

  while (i < sorted.length) {
    const score = sorted[i].total;
    const grpStart = i;

    while (i < sorted.length && sorted[i].total === score) i++;

    const n = i - grpStart;
    const startPos = grpStart + 1;

    if (startPos === 1) {
      for (let k = grpStart; k < grpStart + n; k++) {
        prizes[k] = BASE_PAYOUTS[0];
      }
    } else {
      const paying = Array.from({ length: n }, (_, k) => startPos + k).filter((p) => p <= 20);
      const pool = paying.reduce((sum, p) => sum + BASE_PAYOUTS[p - 1], 0);
      const split = n > 0 ? pool / n : 0;

      for (let k = grpStart; k < grpStart + n; k++) {
        prizes[k] = split;
      }
    }
  }

  return prizes;
}

function getOwnedTeamShares(playerName, ownershipMap, amount) {
  const ownership = ownershipMap[playerName] || [];
  return ownership.map(([team, pct]) => ({
    team,
    pct,
    amount: amount * pct,
  }));
}

function computeSpecialPrizeResults(rows) {
  const ownershipMap = Object.fromEntries(rows.map((r) => [r.name, r.ownership]));

  const validRows = rows.filter((r) => r.total !== null && r.total !== undefined);
  const r1Rows = rows.filter((r) => r.r1 !== null && r.r1 !== undefined);
  const r2Rows = rows.filter((r) => r.r2 !== null && r.r2 !== undefined);
  const amateurRows = rows.filter((r) => AMATEURS.has(r.name) && r.total !== null && r.total !== undefined);

  const minR1 = r1Rows.length ? Math.min(...r1Rows.map((r) => r.r1)) : null;
  const minR2 = r2Rows.length ? Math.min(...r2Rows.map((r) => r.r2)) : null;
  const max36 = validRows.length ? Math.max(...validRows.map((r) => r.total)) : null;
  const lowAm = amateurRows.length ? Math.min(...amateurRows.map((r) => r.total)) : null;

  const results = [
    {
      key: "r1Leader",
      label: "1st Round Leader",
      amount: 300,
      winners: minR1 === null ? [] : r1Rows.filter((r) => r.r1 === minR1),
      metricLabel: "R1",
      metricValue: minR1,
    },
    {
      key: "r2Leader",
      label: "2nd Round Leader",
      amount: 300,
      winners: minR2 === null ? [] : r2Rows.filter((r) => r.r2 === minR2),
      metricLabel: "R2",
      metricValue: minR2,
    },
    {
      key: "worst36",
      label: "Worst 36-Hole Score",
      amount: 150,
      winners: max36 === null ? [] : validRows.filter((r) => r.total === max36),
      metricLabel: "36 Holes",
      metricValue: max36,
    },
    {
      key: "lowAmateur",
      label: "Low Amateur",
      amount: 150,
      winners: lowAm === null ? [] : amateurRows.filter((r) => r.total === lowAm),
      metricLabel: "Total",
      metricValue: lowAm,
    },
  ].map((prize) => {
    const split = prize.winners.length ? prize.amount / prize.winners.length : 0;

    return {
      ...prize,
      split,
      winners: prize.winners.map((winner) => ({
        ...winner,
        teamShares: getOwnedTeamShares(winner.name, ownershipMap, split),
      })),
    };
  });

  return results;
}

function computeSpecialPrizeTeamTotals(prizeResults) {
  const totals = {};

  Object.keys(TEAM_BIDS).forEach((team) => {
    totals[team] = 0;
  });

  prizeResults.forEach((prize) => {
    prize.winners.forEach((winner) => {
      winner.teamShares.forEach((share) => {
        totals[share.team] = (totals[share.team] || 0) + share.amount;
      });
    });
  });

  return totals;
}

function buildRows(liveMap) {
  return POOL
    .filter((p) => !p[5])
    .map((p) => {
      const live = liveMap[p[0]];
      const r1 = live ? live.r1 : p[3];
      const r2 = live ? live.r2 : p[4];
      const total = live ? live.total : ((p[3] || 0) + (p[4] || 0));

      return {
        name: p[0],
        ownership: p[1],
        r1,
        r2,
        total,
        thru: live ? live.thru : p[4] !== null ? "F" : "-",
        live: !!live,
      };
    })
    .sort((a, b) => a.total - b.total || a.name.localeCompare(b.name));
}

async function fetchESPN() {
  const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard");
  if (!res.ok) throw new Error(`ESPN ${res.status}`);

  const data = await res.json();
  const events = data.events || [];
  const masters =
    events.find((e) => String(e?.name || "").toLowerCase().includes("masters")) || events[0];

  if (!masters) throw new Error("No Masters event");

  const comp = masters.competitions && masters.competitions[0];
  if (!comp) throw new Error("No competition");

  const status = comp?.status?.type?.description || "In Progress";
  const period = comp?.status?.period;
  const round = period ? `Round ${period}` : "In Progress";

  const players = (comp.competitors || [])
    .map((c) => {
      const name = c?.athlete?.displayName || "";
      const scores = c?.linescores || [];
      const r1 = scores[0] ? parseScore(scores[0].value ?? scores[0].displayValue) : null;
      const r2 = scores[1] ? parseScore(scores[1].value ?? scores[1].displayValue) : null;
      const total = parseScore(c.score || c.total || "0");
      const thru =
        c?.status?.thru !== undefined
          ? c.status.thru === 0
            ? "F"
            : String(c.status.thru)
          : c?.status?.type?.completed
            ? "F"
            : "-";

      return { name, r1, r2, total, thru };
    })
    .filter((p) => p.name);

  return { round, status, players };
}

function ScorePill({ score, size = "lg" }) {
  if (score === null || score === undefined) {
    return <span style={{ color: "#999" }}>-</span>;
  }

  const isUnder = score < 0;
  const isEven = score === 0;
  const s = fmtScore(score);

  if (size === "lg") {
    return (
      <span
        style={{
          display: "inline-block",
          minWidth: 44,
          textAlign: "center",
          background: isUnder ? "#cc0000" : "#e8e8e8",
          color: isUnder ? "#fff" : "#222",
          fontWeight: "bold",
          fontSize: 18,
          borderRadius: 4,
          padding: "1px 8px",
          fontFamily: "Georgia, serif",
          letterSpacing: ".01em",
        }}
      >
        {isEven ? "E" : s}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-block",
        minWidth: 32,
        textAlign: "center",
        background: isUnder ? "#cc0000" : "#e8e8e8",
        color: isUnder ? "#fff" : "#444",
        fontWeight: "bold",
        fontSize: 13,
        borderRadius: 3,
        padding: "0px 5px",
        fontFamily: "Georgia, serif",
      }}
    >
      {isEven ? "E" : s}
    </span>
  );
}

export default function App() {
  const [tab, setTab] = useState("teams");
  const [liveMap, setLiveMap] = useState({});
  const [meta, setMeta] = useState({ round: "Round 2", status: "In Progress" });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const rows = useMemo(() => buildRows(liveMap), [liveMap]);
  const prizes = useMemo(() => computePayouts(rows), [rows]);
  const positionPotTotal = useMemo(() => sumBasePayouts(), []);
  const prizeResults = useMemo(() => computeSpecialPrizeResults(rows), [rows]);
  const specialPrizeTeamTotals = useMemo(() => computeSpecialPrizeTeamTotals(prizeResults), [prizeResults]);

  const teamStandings = useMemo(() => {
    return Object.keys(TEAM_BIDS)
      .map((team) => {
        let payout = 0;
        let best = null;
        let bestScore = 999;
        let earners = 0;

        rows.forEach((r, i) => {
          const prize = prizes[i];
          let ownsThisRow = false;

          r.ownership.forEach(([t, pct]) => {
            if (t !== team) return;
            payout += prize * pct;
            ownsThisRow = true;

            if (r.total < bestScore) {
              bestScore = r.total;
              best = r.name.split(",")[0];
            }
          });

          if (ownsThisRow && prize > 0) earners++;
        });

        const specialPrizePayout = specialPrizeTeamTotals[team] || 0;
        const totalPayout = payout + specialPrizePayout;

        return {
          team,
          bid: TEAM_BIDS[team],
          payout: totalPayout,
          positionPayout: payout,
          specialPrizePayout,
          best,
          bestScore,
          earners,
          roi: (totalPayout - TEAM_BIDS[team]) / TEAM_BIDS[team],
        };
      })
      .sort((a, b) => b.payout - a.payout);
  }, [rows, prizes, specialPrizeTeamTotals]);

  const posInfo = useMemo(() => {
    return rows.map((r, i, arr) => {
      let pos = 1;
      for (let k = 0; k < i; k++) {
        if (arr[k].total < r.total) pos++;
      }
      const ties = arr.filter((x) => x.total === r.total).length;
      return { pos, isTie: ties > 1 };
    });
  }, [rows]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const data = await fetchESPN();

      if (data.players && data.players.length > 0) {
        const map = {};

        for (const ap of data.players) {
          const pool = matchPlayer(ap.name);
          if (pool) {
            map[pool[0]] = {
              r1: ap.r1,
              r2: ap.r2,
              total: ap.total ?? ((ap.r1 || 0) + (ap.r2 || 0)),
              thru: ap.thru,
            };
          }
        }

        if (Object.keys(map).length > 0) {
          setLiveMap(map);
        }

        setMeta({ round: data.round, status: data.status });
      }

      setLastUpdated(new Date());
    } catch (e) {
      setFetchError(e.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(refresh, 3 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div
      style={{
        background: MASTERS_LIGHT,
        minHeight: "100vh",
        color: "#222",
        fontFamily: "Georgia, serif",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <div style={{ background: MASTERS_GREEN, overflow: "hidden" }}>
        <div style={{ height: 5, background: MASTERS_YELLOW }} />

        <div style={{ padding: "14px 16px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#a8d5b5",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Augusta National · 2026
              </div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 2, lineHeight: 1.1 }}>
                Masters Pool
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: MASTERS_YELLOW,
                  fontFamily: "Arial, sans-serif",
                  marginTop: 3,
                  letterSpacing: ".04em",
                }}
              >
                {meta.round} · {meta.status}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <button
                onClick={refresh}
                disabled={loading}
                style={{
                  background: MASTERS_YELLOW,
                  border: "none",
                  color: MASTERS_GREEN,
                  padding: "8px 18px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: "Arial, sans-serif",
                  letterSpacing: ".04em",
                }}
              >
                {loading ? "..." : "Live"}
              </button>

              {lastUpdated && !fetchError && (
                <div
                  style={{
                    fontSize: 9,
                    color: "#a8d5b5",
                    marginTop: 5,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Updated{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}

              {fetchError && (
                <div
                  style={{
                    fontSize: 9,
                    color: "#fca5a5",
                    marginTop: 5,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Cached data
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          {[
            ["teams", "Teams"],
            ["players", "Players"],
            ["payouts", "Payouts"],
            ["prizes", "Prizes"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                padding: "11px 4px",
                fontSize: 14,
                fontWeight: tab === id ? "bold" : "normal",
                background: "none",
                border: "none",
                borderBottom: tab === id ? `3px solid ${MASTERS_YELLOW}` : "3px solid transparent",
                color: tab === id ? MASTERS_YELLOW : "rgba(255,255,255,0.65)",
                cursor: "pointer",
                fontFamily: "Arial, sans-serif",
                letterSpacing: ".04em",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px 10px 40px" }}>
        {tab === "teams" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 12px 4px",
                fontSize: 10,
                color: "#666",
                fontFamily: "Arial, sans-serif",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              <span>Team</span>
              <span>Winnings</span>
            </div>

            {teamStandings.map((t, i) => {
              const isTop = i === 0;
              return (
                <div
                  key={t.team}
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    marginBottom: 7,
                    overflow: "hidden",
                    boxShadow: isTop
                      ? "0 2px 12px rgba(0,103,71,0.18)"
                      : "0 1px 4px rgba(0,0,0,0.07)",
                    border: isTop ? `1.5px solid ${MASTERS_GREEN}` : "1.5px solid #e0e8e4",
                  }}
                >
                  {isTop && <div style={{ height: 3, background: MASTERS_GREEN }} />}
                  <div style={{ padding: "13px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background:
                              i === 0 ? MASTERS_GREEN : i === 1 ? "#e8f0eb" : i === 2 ? "#f2f0e8" : "#f5f5f5",
                            color: i === 0 ? "#fff" : MASTERS_GREEN,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: 15,
                          }}
                        >
                          {i + 1}
                        </div>

                        <div>
                          <div style={{ fontWeight: "bold", fontSize: 16, color: "#111" }}>{t.team}</div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#555",
                              fontFamily: "Arial, sans-serif",
                              marginTop: 2,
                            }}
                          >
                            {t.best ? (
                              <>
                                {t.best}{" "}
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: t.bestScore < 0 ? "#cc0000" : "#444",
                                  }}
                                >
                                  {fmtScore(t.bestScore)}
                                </span>
                              </>
                            ) : (
                              <span style={{ color: "#aaa" }}>No data</span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#999",
                              fontFamily: "Arial, sans-serif",
                              marginTop: 1,
                            }}
                          >
                            Bid {fmtMoney(t.bid)}
                            {t.earners > 0 && (
                              <span style={{ marginLeft: 8, color: MASTERS_GREEN }}>
                                · {t.earners} earning
                              </span>
                            )}
                          </div>
                          {t.specialPrizePayout > 0 && (
                            <div
                              style={{
                                fontSize: 11,
                                color: MASTERS_GREEN,
                                fontFamily: "Arial, sans-serif",
                                marginTop: 2,
                                fontWeight: "bold",
                              }}
                            >
                              Prize bonus {fmtMoneyFull(t.specialPrizePayout)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: t.payout > t.bid ? MASTERS_GREEN : t.payout > 0 ? "#555" : "#bbb",
                          }}
                        >
                          {t.payout > 0 ? fmtMoney(t.payout) : "--"}
                        </div>
                        {t.payout > 0 && (
                          <div
                            style={{
                              fontSize: 12,
                              fontFamily: "Arial, sans-serif",
                              color: t.roi >= 0 ? MASTERS_GREEN : "#cc0000",
                              fontWeight: "bold",
                            }}
                          >
                            {(t.roi >= 0 ? "+" : "") + (t.roi * 100).toFixed(0)}% ROI
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "players" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 56px 80px",
                background: MASTERS_GREEN,
                borderRadius: "8px 8px 0 0",
                padding: "7px 12px",
                fontSize: 10,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "Arial, sans-serif",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                gap: 4,
              }}
            >
              <span>Pos</span>
              <span>Player</span>
              <span style={{ textAlign: "center" }}>Score</span>
              <span style={{ textAlign: "right" }}>Prize</span>
            </div>

            {rows.map((r, i) => {
              const { pos, isTie } = posInfo[i];
              const prize = prizes[i];
              const posStr = (isTie ? "T" : "") + pos;
              const isLeader = pos === 1;
              const inMoney = prize > 0;
              const evenRow = i % 2 === 0;

              return (
                <div
                  key={r.name}
                  style={{
                    background: isLeader ? "#f0f8f3" : evenRow ? "#fff" : "#fafcfb",
                    borderLeft: `3px solid ${isLeader ? MASTERS_GREEN : inMoney ? "#a8d5b5" : "transparent"}`,
                    borderBottom: "1px solid #e8eeeb",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "36px 1fr 56px 80px",
                      padding: "10px 12px",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: isLeader ? MASTERS_GREEN : "#888",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      {posStr}
                    </span>

                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: pos <= 5 ? "bold" : "normal",
                          color: "#111",
                          lineHeight: 1.2,
                        }}
                      >
                        {r.name.split(", ").reverse().join(" ")}
                        {r.live && (
                          <span
                            style={{
                              fontSize: 9,
                              color: MASTERS_GREEN,
                              fontFamily: "Arial, sans-serif",
                              marginLeft: 5,
                              background: "#e0f0e8",
                              padding: "1px 5px",
                              borderRadius: 10,
                            }}
                          >
                            LIVE
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                        {r.ownership.map(([t, pct]) => {
                          const share = prize > 0 ? prize * pct : 0;
                          return (
                            <span
                              key={`${r.name}-${t}`}
                              style={{
                                background: TEAM_COLORS[t] || "#444",
                                color: "#fff",
                                fontSize: 9,
                                padding: "2px 6px",
                                borderRadius: 3,
                                fontFamily: "Arial, sans-serif",
                                letterSpacing: ".03em",
                              }}
                            >
                              {t}
                              {pct < 1 ? ` ${Math.round(pct * 100)}%` : ""}
                              {share > 0 ? ` ${fmtMoney(share)}` : ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <ScorePill score={r.total} />
                      <div
                        style={{
                          fontSize: 9,
                          color: "#aaa",
                          marginTop: 3,
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {r.r1 !== null ? fmtScore(r.r1) : "--"}/{r.r2 !== null ? fmtScore(r.r2) : "--"}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      {prize > 0 ? (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            color: MASTERS_GREEN,
                          }}
                        >
                          {fmtMoney(prize)}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#ccc",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          --
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                borderRadius: "0 0 8px 8px",
                overflow: "hidden",
                height: 4,
                background: MASTERS_GREEN,
              }}
            />
          </div>
        )}

        {tab === "payouts" && (
          <div>
            <div
              style={{
                background: "#fff",
                border: "1.5px solid #c8ddd2",
                borderRadius: 10,
                padding: "12px 14px",
                margin: "8px 0 14px",
                fontSize: 12,
                color: "#444",
                fontFamily: "Arial, sans-serif",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: MASTERS_GREEN }}>Tie Rule: </strong>
              Tied positions 2-20 pool their prizes and split equally. 1st place always receives the full{" "}
              {fmtMoneyFull(BASE_PAYOUTS[0])}. Position payouts total {fmtMoneyFull(POSITION_POT)}.
              Special prizes are tracked separately on the Prizes tab for {fmtMoneyFull(SPECIAL_PRIZE_POT)}.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: MASTERS_GREEN,
                borderRadius: "8px 8px 0 0",
                padding: "8px 16px",
                fontSize: 10,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "Arial, sans-serif",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              <span>Position</span>
              <span style={{ textAlign: "right" }}>Prize</span>
            </div>

            {BASE_PAYOUTS.map((amt, i) => {
              const pos = i + 1;
              const suf = { 1: "st", 2: "nd", 3: "rd" }[pos] || "th";

              return (
                <div
                  key={pos}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    padding: "11px 16px",
                    background: pos <= 3 ? "#f0f8f3" : i % 2 === 0 ? "#fff" : "#fafcfb",
                    borderBottom: "1px solid #e8eeeb",
                    borderLeft: `3px solid ${pos <= 3 ? MASTERS_GREEN : "transparent"}`,
                  }}
                >
                  <span
                    style={{
                      fontWeight: pos <= 3 ? "bold" : "normal",
                      color: pos <= 3 ? MASTERS_GREEN : "#555",
                      fontFamily: "Georgia, serif",
                      fontSize: 14,
                    }}
                  >
                    {pos}
                    {suf} place
                  </span>
                  <span
                    style={{
                      textAlign: "right",
                      fontWeight: pos <= 3 ? "bold" : "normal",
                      color: pos <= 3 ? MASTERS_GREEN : "#333",
                      fontFamily: "Georgia, serif",
                      fontSize: 14,
                    }}
                  >
                    {fmtMoneyFull(amt)}
                  </span>
                </div>
              );
            })}

            <div
              style={{
                background: "#fff",
                borderBottom: "1px solid #e8eeeb",
                borderRadius: "0 0 8px 8px",
                padding: "10px 16px",
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "Arial, sans-serif",
                fontSize: 11,
                color: "#888",
              }}
            >
              <span>Position pot</span>
              <span style={{ fontWeight: "bold", color: MASTERS_GREEN }}>
                {fmtMoneyFull(positionPotTotal)}
              </span>
            </div>

            <div
              style={{
                height: 4,
                background: MASTERS_GREEN,
                borderRadius: "0 0 8px 8px",
                marginTop: -1,
              }}
            />
          </div>
        )}

        {tab === "prizes" && (
          <div>
            <div
              style={{
                background: "#fff",
                border: "1.5px solid #c8ddd2",
                borderRadius: 10,
                padding: "12px 14px",
                margin: "8px 0 14px",
                fontSize: 12,
                color: "#444",
                fontFamily: "Arial, sans-serif",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: MASTERS_GREEN }}>Special prizes: </strong>
              1st Round Leader ($300), 2nd Round Leader ($300), Worst 36-Hole Score ($150), and Low Amateur ($150).
            </div>

            {prizeResults.map((prize) => (
              <div
                key={prize.key}
                style={{
                  background: "#fff",
                  border: "1.5px solid #dce7e0",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 10,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    gap: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#111",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {prize.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#666",
                        fontFamily: "Arial, sans-serif",
                        marginTop: 2,
                      }}
                    >
                      {prize.metricLabel}: {fmtScore(prize.metricValue)}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: MASTERS_GREEN,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {fmtMoneyFull(prize.amount)}
                  </div>
                </div>

                {prize.winners.length === 0 ? (
                  <div style={{ color: "#999", fontFamily: "Arial, sans-serif", fontSize: 12 }}>
                    No winner available yet.
                  </div>
                ) : (
                  prize.winners.map((winner) => (
                    <div
                      key={`${prize.key}-${winner.name}`}
                      style={{
                        borderTop: "1px solid #edf2ee",
                        paddingTop: 10,
                        marginTop: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                              color: "#111",
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            {winner.name.split(", ").reverse().join(" ")}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#666",
                              fontFamily: "Arial, sans-serif",
                              marginTop: 3,
                            }}
                          >
                            Award share: {fmtMoneyFull(prize.split)}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <ScorePill score={winner.total} size="sm" />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                        {winner.teamShares.length ? (
                          winner.teamShares.map((share) => (
                            <span
                              key={`${prize.key}-${winner.name}-${share.team}`}
                              style={{
                                background: TEAM_COLORS[share.team] || "#444",
                                color: "#fff",
                                fontSize: 10,
                                padding: "3px 7px",
                                borderRadius: 3,
                                fontFamily: "Arial, sans-serif",
                                letterSpacing: ".02em",
                              }}
                            >
                              {share.team} {fmtMoneyFull(share.amount)}
                            </span>
                          ))
                        ) : (
                          <span
                            style={{
                              background: "#f3f3f3",
                              color: "#666",
                              fontSize: 10,
                              padding: "3px 7px",
                              borderRadius: 3,
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            No owned team
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}

            <div
              style={{
                background: "#fff",
                border: "1.5px solid #dce7e0",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#666",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                Prize pot total
              </span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: MASTERS_GREEN,
                  fontFamily: "Georgia, serif",
                }}
              >
                {fmtMoneyFull(SPECIAL_PRIZE_POT)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
