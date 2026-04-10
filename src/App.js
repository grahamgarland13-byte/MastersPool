import React, { useState, useEffect, useCallback, useMemo } from "react";

// - POOL DATA -
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
  KING: "#2f5d8a",
  HOCH: "#3d6f48",
  MALLOY: "#8a5a34",
  KRAHN: "#6a4c93",
  GUTSCHOW: "#8b5a2b",
  BARRY: "#a14d3f",
  VERCHOTTA: "#3e7c85",
  ORR: "#666666",
  BAR: "#3d7f7b",
};

const COLORS = {
  pageBg: "#ffffff",
  boardBg: "#fffdf7",
  boardTop: "#1c5a38",
  boardTopDark: "#15492d",
  mastersGreen: "#1f5e3b",
  mastersGold: "#c8a951",
  border: "#1f1f1f",
  grid: "#2a2a2a",
  text: "#171717",
  muted: "#5c5c5c",
  positive: "#178a46",
  negative: "#c83232",
  even: "#111111",
  empty: "#9b9b9b",
  cream: "#f3eedf",
};

// [displayName, [[team,pct],...], [aliases], r1_seed, r2_seed]
const POOL = [
  ["Burns, Sam", [["KING", 1]], ["sam burns", "burns"], -5, null],
  ["McIlroy, Rory", [["KRAHN", 0.5], ["BAR", 0.5]], ["rory mcilroy", "mcilroy"], -5, null],
  ["Kitayama, Kurt", [["VERCHOTTA", 1]], ["kurt kitayama", "kitayama"], -3, null],
  ["Day, Jason", [["KRAHN", 1]], ["jason day", "day"], -3, null],
  ["Reed, Patrick", [["HOCH", 0.333], ["KING", 0.333], ["MALLOY", 0.333]], ["patrick reed", "reed"], -3, null],
  ["Clark, Wyndham", [["KRAHN", 1]], ["wyndham clark", "clark"], 0, -4],
  ["Rose, Justin", [["KING", 1]], ["justin rose", "rose"], -2, -2],
  ["Scheffler, Scottie", [["BARRY", 0.25], ["MALLOY", 0.5], ["KING", 0.25]], ["scottie scheffler", "scheffler"], -2, 2],
  ["Aberg, Ludvig", [["VERCHOTTA", 0.5], ["KING", 0.5]], ["ludvig aberg", "ludvig åberg", "aberg"], -1, null],
  ["Koepka, Brooks", [["BAR", 0.5], ["KING", 0.5]], ["brooks koepka", "koepka"], -1, -1],
  ["Hovland, Viktor", [["BARRY", 0.25], ["GUTSCHOW", 0.25], ["ORR", 0.5]], ["viktor hovland", "hovland"], -1, null],
  ["Morikawa, Collin", [["HOCH", 0.5], ["GUTSCHOW", 0.5]], ["collin morikawa", "morikawa"], 0, null],
  ["Hatton, Tyrrell", [["BAR", 1]], ["tyrrell hatton", "hatton"], 1, -2],
  ["Schauffele, Xander", [["HOCH", 1]], ["xander schauffele", "schauffele"], 1, null],
  ["Im, Sungjae", [["MALLOY", 0.5], ["KING", 0.5]], ["sungjae im", "im"], 1, 0],
  ["Fleetwood, Tommy", [["HOCH", 0.5]], ["tommy fleetwood", "fleetwood"], 1, null],
  ["Lee, Min Woo", [["HOCH", 0.667], ["BARRY", 0.333]], ["min woo lee", "min-woo lee", "min woo"], 1, null],
  ["Woodland, Gary", [["KRAHN", 0.5]], ["gary woodland", "woodland"], 1, 0],
  ["Greyserman, Max", [["KING", 1]], ["max greyserman", "greyserman"], 2, null],
  ["Thomas, Justin", [["KING", 0.5]], ["justin thomas", "thomas"], 2, null],
  ["Spieth, Jordan", [["GUTSCHOW", 0.5]], ["jordan spieth", "spieth"], 2, null],
  ["Lowry, Shane", [["MALLOY", 1]], ["shane lowry", "lowry"], 2, null],
  ["Young, Cameron", [["HOCH", 1]], ["cameron young", "young"], 2, null],
  ["Harman, Brian", [["KING", 0.5], ["MALLOY", 0.5]], ["brian harman", "harman"], 2, null],
  ["Olazabal, Jose Maria", [["HOCH", 0.333]], ["jose maria olazabal", "jose maria", "olazabal"], 2, null],
  ["Fitzpatrick, Matt", [["KRAHN", 0.5], ["BAR", 0.5]], ["matt fitzpatrick", "fitzpatrick"], 2, null],
  ["Matsuyama, Hideki", [["VERCHOTTA", 1]], ["hideki matsuyama", "matsuyama"], 2, null],
  ["Scott, Adam", [["BARRY", 0.333], ["MALLOY", 0.333], ["KING", 0.333]], ["adam scott", "scott"], 3, null],
  ["Homa, Max", [["KRAHN", 0.5]], ["max homa", "homa"], 3, null],
  ["MacIntyre, Robert", [["BAR", 1]], ["robert macintyre", "macintyre"], 3, 0],
  ["Cantlay, Patrick", [["KRAHN", 0.5]], ["patrick cantlay", "cantlay"], 3, null],
  ["Johnson, Dustin", [["KING", 1]], ["dustin johnson", "johnson"], 3, null],
  ["Bhatia, Akshay", [["KING", 0.5], ["MALLOY", 0.5]], ["akshay bhatia", "bhatia"], 3, null],
  ["Garcia, Sergio", [["VERCHOTTA", 0.5]], ["sergio garcia", "garcia"], 3, null],
  ["Henley, Russell", [["HOCH", 0.333], ["ORR", 0.333], ["BARRY", 0.167], ["GUTSCHOW", 0.167]], ["russell henley", "henley"], 3, null],
  ["Hojgaard, Rasmus", [["BAR", 0.5], ["KRAHN", 0.5]], ["rasmus hojgaard", "rasmus højgaard", "rasmus hogaard", "hojgaard", "hogaard"], 3, null],
  ["Watson, Bubba", [["KRAHN", 0.333]], ["bubba watson", "watson"], 4, null],
  ["DeChambeau, Bryson", [["KRAHN", 0.5], ["KING", 0.25], ["MALLOY", 0.25]], ["bryson dechambeau", "dechambeau"], 4, null],
  ["Rahm, Jon", [["VERCHOTTA", 0.5]], ["jon rahm", "rahm"], 6, null],
  ["Spaun, J.J.", [["BARRY", 0.335], ["KING", 0.665]], ["j j spaun", "jj spaun", "j.j. spaun", "spaun"], 1, null],
  ["Conners, Corey", [["ORR", 0.5], ["HOCH", 0.5]], ["corey conners", "conners"], 2, null],
  ["Smith, Cameron", [["VERCHOTTA", 1]], ["cameron smith"], 3, null],
];

const BASE_PAYOUTS = [
  27093.99, 20503.56, 16109.94, 13180.86, 11716.32,
  7322.7, 7322.7, 5858.16, 5858.16, 5858.16,
  2929.08, 2929.08, 2929.08, 2929.08, 2929.08,
  2196.81, 2196.81, 2196.81, 2196.81, 2196.81,
];

// - HELPERS -
function fmtScore(s) {
  if (s === null || s === undefined) return "–";
  if (s === 0) return "E";
  return s > 0 ? `+${s}` : `${s}`;
}

function fmtMoney(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "–";
  return "$" + n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function scoreColor(s) {
  if (s === null || s === undefined) return COLORS.muted;
  if (s < 0) return COLORS.positive;
  if (s > 0) return COLORS.negative;
  return COLORS.even;
}

function parseScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value).trim();
  if (str === "E" || str.toLowerCase() === "even") return 0;
  const n = parseInt(str, 10);
  return Number.isNaN(n) ? null : n;
}

function normalizeName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/'/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function matchPlayer(name) {
  const n = normalizeName(name);
  if (!n) return null;

  const normalizedPool = POOL.map((p) => {
    const display = normalizeName(p[0]);
    const aliases = [display, ...(p[2] || []).map(normalizeName)];
    const parts = display.split(" ");
    const reordered =
      parts.length >= 2 ? `${parts.slice(1).join(" ")} ${parts[0]}`.trim() : display;

    return {
      original: p,
      aliases: [...new Set([...aliases, reordered])],
    };
  });

  for (const p of normalizedPool) {
    if (p.aliases.includes(n)) return p.original;
  }

  for (const p of normalizedPool) {
    if (p.aliases.some((a) => a.includes(n) || n.includes(a))) return p.original;
  }

  const last = n.split(" ").pop();
  if (last && last.length >= 4) {
    const candidates = normalizedPool.filter((p) =>
      p.aliases.some((a) => a.split(" ").pop() === last)
    );
    if (candidates.length === 1) return candidates[0].original;
  }

  return null;
}

function normalizePlayerScores(r1, r2, total, displayName = "") {
  const hasR1 = r1 !== null && r1 !== undefined;
  const hasR2 = r2 !== null && r2 !== undefined;
  const hasTotal = total !== null && total !== undefined;

  if (hasR1 && hasR2) {
    const computed = r1 + r2;
    if (hasTotal && computed !== total) {
      console.log("Score mismatch detected:", {
        player: displayName,
        r1,
        r2,
        espnTotal: total,
        computedTotal: computed,
      });
    }
    return { r1, r2, total: computed };
  }

  return {
    r1: hasR1 ? r1 : null,
    r2: hasR2 ? r2 : null,
    total: hasTotal ? total : 0,
  };
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
      for (let k = grpStart; k < grpStart + n; k++) prizes[k] = BASE_PAYOUTS[0];
    } else {
      const paying = Array.from({ length: n }, (_, k) => startPos + k).filter((p) => p <= 20);
      const pool = paying.reduce((sum, p) => sum + BASE_PAYOUTS[p - 1], 0);
      const split = n > 0 ? pool / n : 0;
      for (let k = grpStart; k < grpStart + n; k++) prizes[k] = split;
    }
  }

  return prizes;
}

function buildRows(liveMap) {
  return POOL.map((p) => {
    const live = liveMap[p[0]];
    const r1 = live?.r1 ?? p[3];
    const r2 = live?.r2 ?? p[4];
    const total = live?.total ?? ((p[3] ?? 0) + (p[4] ?? 0));

    return {
      name: p[0],
      ownership: p[1],
      r1,
      r2,
      total,
      thru: live?.thru ?? (p[4] !== null ? (p[0] === "Clark, Wyndham" ? "F" : "*") : "–"),
      live: !!live,
    };
  }).sort((a, b) => {
    if (a.total !== b.total) return a.total - b.total;
    return a.name.localeCompare(b.name);
  });
}

// - ESPN FETCH -
async function fetchESPN() {
  const url = "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`ESPN API ${res.status}`);

  const data = await res.json();
  const events = data?.events || [];
  const masters =
    events.find(
      (e) =>
        e?.name?.toLowerCase().includes("masters") ||
        e?.shortName?.toLowerCase().includes("masters")
    ) || events[0];

  if (!masters) throw new Error("No event found in ESPN feed");

  const comp = masters?.competitions?.[0];
  if (!comp) throw new Error("No competition data");

  const status = comp?.status?.type?.description || "In Progress";
  const round = comp?.status?.period ? `Round ${comp.status.period}` : "In Progress";

  const players = (comp?.competitors || [])
    .map((c) => {
      const name = c?.athlete?.displayName || "";
      const scores = c?.linescores || [];
      const r1 = scores[0] ? parseScore(scores[0].value ?? scores[0].displayValue) : null;
      const r2 = scores[1] ? parseScore(scores[1].value ?? scores[1].displayValue) : null;
      const total = parseScore(c?.score ?? c?.total);
      const thru =
        c?.status?.thru !== undefined && c?.status?.thru !== null
          ? c.status.thru === 0
            ? "F"
            : String(c.status.thru)
          : c?.status?.type?.completed
            ? "F"
            : "–";

      return { name, r1, r2, total, thru };
    })
    .filter((p) => p.name);

  return { round, status, players };
}

export default function MastersPool() {
  const [tab, setTab] = useState("leaderboard");
  const [liveMap, setLiveMap] = useState({});
  const [meta, setMeta] = useState({
    round: "Round 2",
    status: "Seeded Data",
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const rows = useMemo(() => buildRows(liveMap), [liveMap]);
  const prizes = useMemo(() => computePayouts(rows), [rows]);

  const teamStandings = useMemo(() => {
    return Object.keys(TEAM_BIDS)
      .map((team) => {
        let payout = 0;
        let best = null;
        let bestScore = Infinity;
        let earners = 0;

        rows.forEach((r, i) => {
          const prize = prizes[i];
          let ownsThisPlayer = false;

          r.ownership.forEach(([t, pct]) => {
            if (t !== team) return;
            ownsThisPlayer = true;
            payout += prize * pct;
            if (r.total < bestScore) {
              bestScore = r.total;
              best = r.name;
            }
          });

          if (prize > 0 && ownsThisPlayer) earners++;
        });

        return {
          team,
          bid: TEAM_BIDS[team],
          payout,
          best,
          bestScore,
          earners,
          roi: (payout - TEAM_BIDS[team]) / TEAM_BIDS[team],
        };
      })
      .sort((a, b) => b.payout - a.payout);
  }, [rows, prizes]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const data = await fetchESPN();
      const map = {};
      const unmatched = [];

      for (const ap of data.players || []) {
        const pool = matchPlayer(ap.name);
        if (!pool) {
          unmatched.push(ap.name);
          continue;
        }

        const normalized = normalizePlayerScores(
          ap.r1 ?? null,
          ap.r2 ?? null,
          ap.total ?? null,
          pool[0]
        );

        map[pool[0]] = {
          r1: normalized.r1,
          r2: normalized.r2,
          total: normalized.total,
          thru: ap.thru ?? "–",
        };
      }

      if (unmatched.length) {
        console.log("Unmatched ESPN players:", unmatched);
      }

      if (map["Hojgaard, Rasmus"]) {
        console.log("Hojgaard mapped score:", map["Hojgaard, Rasmus"]);
      }

      if (Object.keys(map).length > 0) {
        setLiveMap(map);
        setMeta({ round: data.round, status: data.status });
      } else {
        setMeta({ round: "Seeded Data", status: "No matching live players found" });
      }

      setLastUpdated(new Date());
    } catch (e) {
      setFetchError(e?.message || "Unknown error");
      setMeta((prev) => ({
        round: prev.round || "Seeded Data",
        status: "Seeded Data",
      }));
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

  const posInfo = useMemo(() => {
    return rows.map((r, i, arr) => {
      let pos = 1;
      for (let k = 0; k < i; k++) {
        if (arr[k].total < r.total) pos++;
      }
      const ties = arr.filter((x) => x.total === r.total).length;
      return { pos, isTie: ties > 1, tieCount: ties };
    });
  }, [rows]);

  const leaderboardRowBg = (pos, i) =>
    pos === 1 ? "#f7f1da" : pos <= 3 ? "#fbf7ea" : i % 2 === 0 ? "#fffdf7" : "#fcfaf2";

  const teamRowBg = (i) =>
    i === 0 ? "#f7f1da" : i === 1 ? "#fbf7ea" : i % 2 === 0 ? "#fffdf7" : "#fcfaf2";

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        background: COLORS.pageBg,
        minHeight: "100vh",
        color: COLORS.text,
        padding: "24px 0 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          background: COLORS.boardBg,
          border: `2px solid ${COLORS.border}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <style>{`
          * { box-sizing: border-box; }
          .tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
          .tbl th, .tbl td { border: 1px solid ${COLORS.grid}; }
          .tbl th {
            padding: 8px 8px;
            text-align: left;
            background: ${COLORS.cream};
            color: #111;
            font-size: 11px;
            letter-spacing: .06em;
            text-transform: uppercase;
            font-weight: 800;
          }
          .tbl th.c, .tbl td.c { text-align: center; }
          .tbl td {
            padding: 7px 8px;
            background: ${COLORS.boardBg};
            color: ${COLORS.text};
          }
          .tbl tr:hover td { background: #f6f1e2; }
          .teamTag {
            display: inline-block;
            color: #fff;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 0;
            margin-right: 4px;
            margin-bottom: 3px;
            font-weight: 700;
            letter-spacing: .02em;
          }
          .btn {
            background: #fff;
            border: 1px solid #111;
            color: #111;
            padding: 6px 14px;
            cursor: pointer;
            font-size: 11px;
            letter-spacing: .06em;
            font-family: Arial, Helvetica, sans-serif;
            text-transform: uppercase;
            font-weight: 700;
          }
          .btn:hover { background: #f1ead8; }
          .btn:disabled { opacity: .5; cursor: default; }
        `}</style>

        <div
          style={{
            background: `linear-gradient(180deg, ${COLORS.boardTop}, ${COLORS.boardTopDark})`,
            borderBottom: `4px solid ${COLORS.mastersGold}`,
            padding: "12px 20px 10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#ebf3eb",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Augusta National
              </div>
              <div
                style={{
                  fontSize: 32,
                  lineHeight: 1,
                  color: "#ffffff",
                  fontWeight: 900,
                  letterSpacing: ".03em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                Leaders
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#ebf3eb",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                Masters Pool Tracker
              </div>
            </div>

            <button className="btn" onClick={refresh} disabled={loading}>
              {loading ? "Fetching..." : "Refresh"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 10,
              alignItems: "center",
            }}
          >
            {[meta.round, meta.status, "Pool payouts live"].map((lbl, i) => (
              <span
                key={i}
                style={{
                  background: i === 1 ? COLORS.mastersGold : "#ffffff",
                  color: i === 1 ? "#111111" : COLORS.mastersGreen,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "4px 8px",
                  border: "1px solid #111",
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                {lbl}
              </span>
            ))}

            {fetchError ? (
              <span style={{ color: "#ffe6e6", fontSize: 11, fontWeight: 700 }}>
                ESPN fetch failed ({fetchError}) — showing seeded data
              </span>
            ) : lastUpdated ? (
              <span style={{ color: "#eef6ee", fontSize: 11, fontWeight: 700 }}>
                Updated {lastUpdated.toLocaleTimeString()} — refreshes every 3 min
              </span>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: `2px solid ${COLORS.border}`,
            background: COLORS.cream,
            padding: "0 18px",
          }}
        >
          {[
            ["leaderboard", "Leaderboard"],
            ["teams", "Team Standings"],
            ["payouts", "Payout Table"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "12px 16px 10px",
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: tab === id ? `4px solid ${COLORS.mastersGreen}` : "4px solid transparent",
                marginBottom: -2,
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: 800,
                color: tab === id ? "#111111" : COLORS.muted,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 18px 18px" }}>
          {tab === "leaderboard" && (
            <table className="tbl">
              <thead>
                <tr>
                  <th className="c" style={{ width: 64 }}>Pos</th>
                  <th style={{ width: 220 }}>Player</th>
                  <th style={{ width: 170 }}>Team(s)</th>
                  <th className="c" style={{ width: 58 }}>R1</th>
                  <th className="c" style={{ width: 58 }}>R2</th>
                  <th className="c" style={{ width: 68 }}>Total</th>
                  <th className="c" style={{ width: 70 }}>Thru</th>
                  <th className="c" style={{ width: 130 }}>Prize</th>
                  <th>Team Share</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const { pos, isTie, tieCount } = posInfo[i];
                  const prize = prizes[i];
                  const bg = leaderboardRowBg(pos, i);

                  return (
                    <tr key={r.name}>
                      <td
                        className="c"
                        style={{
                          background: bg,
                          color: pos === 1 ? COLORS.mastersGreen : "#111111",
                          fontWeight: 900,
                          fontSize: 13,
                        }}
                      >
                        {(isTie ? "T" : "") + pos}
                      </td>

                      <td
                        style={{
                          background: bg,
                          color: "#111111",
                          fontWeight: pos <= 3 ? 800 : 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {r.name}
                        {r.live && (
                          <span
                            style={{
                              color: COLORS.mastersGreen,
                              fontSize: 10,
                              marginLeft: 6,
                              fontWeight: 900,
                              letterSpacing: ".05em",
                            }}
                          >
                            LIVE
                          </span>
                        )}
                      </td>

                      <td style={{ background: bg }}>
                        {r.ownership.map(([t, pct]) => (
                          <span
                            key={t}
                            className="teamTag"
                            style={{ background: TEAM_COLORS[t] || "#333" }}
                          >
                            {t}
                            {pct < 1 ? ` ${Math.round(pct * 100)}%` : ""}
                          </span>
                        ))}
                      </td>

                      <td className="c" style={{ background: bg, color: scoreColor(r.r1), fontWeight: 900 }}>
                        {fmtScore(r.r1)}
                      </td>
                      <td className="c" style={{ background: bg, color: scoreColor(r.r2), fontWeight: 900 }}>
                        {r.r2 != null ? fmtScore(r.r2) : "--"}
                      </td>
                      <td
                        className="c"
                        style={{
                          background: bg,
                          color: scoreColor(r.total),
                          fontWeight: 900,
                          fontSize: 15,
                        }}
                      >
                        {fmtScore(r.total)}
                      </td>
                      <td className="c" style={{ background: bg, color: "#111111", fontWeight: 700 }}>
                        {r.thru}
                      </td>

                      <td className="c" style={{ background: bg }}>
                        {prize > 0 ? (
                          <span style={{ color: "#111111", fontWeight: 900 }}>
                            {fmtMoney(prize)}
                            {isTie && pos > 1 && (
                              <span style={{ color: COLORS.muted, fontSize: 10 }}> /{tieCount}</span>
                            )}
                          </span>
                        ) : (
                          <span style={{ color: COLORS.empty }}>--</span>
                        )}
                      </td>

                      <td style={{ background: bg }}>
                        {prize > 0 ? (
                          r.ownership.map(([t, pct]) => (
                            <span key={t} style={{ display: "inline-block", marginRight: 10, fontSize: 12 }}>
                              <span style={{ color: TEAM_COLORS[t] || "#111", fontWeight: 900 }}>{t}</span>
                              <span style={{ color: "#111", fontWeight: 700 }}> {fmtMoney(prize * pct)}</span>
                            </span>
                          ))
                        ) : (
                          <span style={{ color: COLORS.empty }}>--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {tab === "teams" && (
            <table className="tbl">
              <thead>
                <tr>
                  <th className="c" style={{ width: 64 }}>Rank</th>
                  <th style={{ width: 130 }}>Team</th>
                  <th className="c" style={{ width: 110 }}>Bid</th>
                  <th>Best Player</th>
                  <th className="c" style={{ width: 84 }}>Earners</th>
                  <th className="c" style={{ width: 140 }}>Payout</th>
                  <th className="c" style={{ width: 90 }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {teamStandings.map((t, i) => {
                  const bg = teamRowBg(i);

                  return (
                    <tr key={t.team}>
                      <td
                        className="c"
                        style={{
                          background: bg,
                          color: i === 0 ? COLORS.mastersGreen : "#111",
                          fontWeight: 900,
                          fontSize: 14,
                        }}
                      >
                        {i + 1}
                      </td>

                      <td style={{ background: bg }}>
                        <span
                          className="teamTag"
                          style={{
                            background: TEAM_COLORS[t.team] || "#333",
                            fontSize: 12,
                            padding: "4px 10px",
                          }}
                        >
                          {t.team}
                        </span>
                      </td>

                      <td className="c" style={{ background: bg, color: "#111", fontWeight: 700 }}>
                        {fmtMoney(t.bid).replace(".00", "")}
                      </td>

                      <td style={{ background: bg, color: "#111", fontWeight: 700 }}>
                        {t.best ? (
                          <>
                            {t.best}{" "}
                            <span style={{ color: scoreColor(t.bestScore), fontWeight: 900 }}>
                              {fmtScore(t.bestScore)}
                            </span>
                          </>
                        ) : (
                          "--"
                        )}
                      </td>

                      <td
                        className="c"
                        style={{
                          background: bg,
                          color: t.earners > 0 ? "#111" : COLORS.empty,
                          fontWeight: 900,
                        }}
                      >
                        {t.earners}
                      </td>

                      <td className="c" style={{ background: bg }}>
                        <strong
                          style={{
                            color: t.payout > t.bid ? COLORS.mastersGreen : "#111",
                            fontSize: 14,
                            fontWeight: 900,
                          }}
                        >
                          {t.payout > 0 ? fmtMoney(t.payout) : "--"}
                        </strong>
                      </td>

                      <td
                        className="c"
                        style={{
                          background: bg,
                          fontWeight: 900,
                          color: t.roi >= 0 ? COLORS.mastersGreen : COLORS.negative,
                        }}
                      >
                        {t.payout > 0 ? `${t.roi >= 0 ? "+" : ""}${(t.roi * 100).toFixed(1)}%` : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {tab === "payouts" && (
            <div style={{ maxWidth: 520, paddingTop: 4 }}>
              <div
                style={{
                  background: COLORS.cream,
                  border: `2px solid ${COLORS.border}`,
                  padding: "10px 14px",
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#111",
                  fontWeight: 700,
                }}
              >
                <strong style={{ color: COLORS.mastersGreen }}>Tie Rule: </strong>
                Positions 2-20 pool their prizes and split equally. Position 1 always pays full{" "}
                {fmtMoney(BASE_PAYOUTS[0])}. Total distributed = $146,454.
              </div>

              <table className="tbl">
                <thead>
                  <tr>
                    <th className="c">Place</th>
                    <th className="c">Base Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {BASE_PAYOUTS.map((amt, i) => {
                    const pos = i + 1;
                    const suf = { 1: "st", 2: "nd", 3: "rd" }[pos] || "th";
                    const bg = pos <= 3 ? "#fbf7ea" : i % 2 === 0 ? "#fffdf7" : "#fcfaf2";

                    return (
                      <tr key={pos}>
                        <td
                          className="c"
                          style={{
                            background: bg,
                            color: "#111",
                            fontWeight: pos <= 3 ? 900 : 700,
                          }}
                        >
                          {pos}{suf}
                        </td>
                        <td
                          className="c"
                          style={{
                            background: bg,
                            color: "#111",
                            fontWeight: pos <= 3 ? 900 : 700,
                          }}
                        >
                          {fmtMoney(amt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
