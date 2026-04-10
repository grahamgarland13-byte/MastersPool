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
  ["Aberg, Ludvig", [["VERCHOTTA", 0.5], ["KING", 0.5]], ["ludvig aberg", "aberg"], -1, null],
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
  ["Olazabal, Jose Maria", [["HOCH", 0.333]], ["jose maria olazabal", "olazabal"], 2, null],
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
  ["Hogaard, Rasmus", [["BAR", 0.5], ["KRAHN", 0.5]], ["rasmus hojgaard", "rasmus hogaard", "hojgaard", "hogaard"], 3, null],
  ["Watson, Bubba", [["KRAHN", 0.333]], ["bubba watson", "watson"], 4, null],
  ["DeChambeau, Bryson", [["KRAHN", 0.5], ["KING", 0.25], ["MALLOY", 0.25]], ["bryson dechambeau", "dechambeau"], 4, null],
  ["Rahm, Jon", [["VERCHOTTA", 0.5]], ["jon rahm", "rahm"], 6, null],
  ["Spaun, J.J.", [["BARRY", 0.335], ["KING", 0.665]], ["j.j. spaun", "jj spaun", "spaun"], 1, null],
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
  if (s === null || s === undefined) return "#4a6a5a";
  return s < 0 ? "#5dba5d" : s > 0 ? "#e05050" : "#c9a84c";
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
    .normalize("NFD")                 // split accented chars
    .replace(/[\u0300-\u036f]/g, "")  // remove accents/diacritics
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

  // exact alias match first
  for (const p of POOL) {
    const aliases = [p[0], ...(p[2] || [])].map(normalizeName);
    if (aliases.includes(n)) return p;
  }

  // exact reordered-name match
  for (const p of POOL) {
    const display = normalizeName(p[0]); // e.g. "hogaard rasmus"
    const parts = display.split(" ");
    if (parts.length >= 2) {
      const reordered = `${parts.slice(1).join(" ")} ${parts[0]}`.trim(); // "rasmus hogaard"
      if (reordered === n) return p;
    }
  }

  // contains match
  for (const p of POOL) {
    const aliases = [p[0], ...(p[2] || [])].map(normalizeName);
    if (aliases.some((a) => a.includes(n) || n.includes(a))) return p;
  }

  // last-name fallback
  const words = n.split(" ");
  const last = words[words.length - 1];
  if (last && last.length >= 4) {
    for (const p of POOL) {
      const aliases = [p[0], ...(p[2] || [])].map(normalizeName);
      if (aliases.some((a) => {
        const aliasWords = a.split(" ");
        return aliasWords[aliasWords.length - 1] === last;
      })) {
        return p;
      }
    }
  }

  return null;
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

      for (const ap of data.players || []) {
        const pool = matchPlayer(ap.name);
        if (!pool) continue;

        map[pool[0]] = {
          r1: ap.r1,
          r2: ap.r2,
          total: ap.total ?? ((ap.r1 ?? 0) + (ap.r2 ?? 0)),
          thru: ap.thru ?? "–",
        };
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

  const rowBg = (pos, i) =>
    pos === 1 ? "#1a2a0a" : pos <= 3 ? "#0f1e14" : i % 2 === 0 ? "#0d1b2e" : "#0a1525";

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: "#0a1628",
        minHeight: "100vh",
        color: "#e8e0d0",
        paddingBottom: 40,
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tbl th {
          padding: 9px 10px;
          text-align: left;
          border-bottom: 1px solid #1e3a2a;
          color: #8aad8a;
          font-size: 11px;
          letter-spacing: .07em;
          text-transform: uppercase;
          font-weight: normal;
          background: #081220;
        }
        .tbl th.c, .tbl td.c { text-align: center; }
        .tbl td { padding: 7px 10px; border-bottom: 1px solid #0f2030; }
        .tbl tr:hover td { filter: brightness(1.08); }
        .tag {
          display: inline-block;
          color: #fff;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 2px;
          margin-right: 3px;
          letter-spacing: .03em;
          margin-bottom: 3px;
        }
        .btn {
          background: transparent;
          border: 1px solid #c9a84c;
          color: #c9a84c;
          padding: 6px 14px;
          cursor: pointer;
          font-size: 11px;
          letter-spacing: .06em;
          font-family: inherit;
          text-transform: uppercase;
        }
        .btn:hover { background: rgba(201,168,76,.12); }
        .btn:disabled { opacity: .5; cursor: default; }
      `}</style>

      <div
        style={{
          background: "linear-gradient(135deg,#0a1628,#1a3a2a 50%,#0a1628)",
          borderBottom: "2px solid #c9a84c",
          padding: "18px 24px 14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#8aad8a",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Augusta National - 2026
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#c9a84c",
                letterSpacing: ".04em",
                textTransform: "uppercase",
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
          {[meta.round, meta.status, "Ties split pool (excl. 1st)"].map((lbl, i) => (
            <span
              key={i}
              style={{
                background: ["#2d5016", "#7b3308", "#5a1e8c"][i],
                color: "#fff",
                fontSize: 11,
                fontWeight: "bold",
                padding: "3px 10px",
                borderRadius: 2,
                letterSpacing: ".05em",
              }}
            >
              {lbl}
            </span>
          ))}

          {fetchError ? (
            <span style={{ color: "#ff8080", fontSize: 11 }}>
              ESPN fetch failed ({fetchError}) — showing seeded data
            </span>
          ) : lastUpdated ? (
            <span style={{ color: "#6b8f6b", fontSize: 11 }}>
              Live via ESPN — Updated {lastUpdated.toLocaleTimeString()} — refreshes every 3 min
            </span>
          ) : null}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #1e3040", padding: "0 24px" }}>
        {[
          ["leaderboard", "Leaderboard"],
          ["teams", "Team Standings"],
          ["payouts", "Payout Table"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: "11px 18px",
              cursor: "pointer",
              fontSize: 12,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom: tab === id ? "2px solid #c9a84c" : "2px solid transparent",
              marginBottom: -1,
              fontFamily: "inherit",
              color: tab === id ? "#c9a84c" : "#6b8080",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "8px 24px 0" }}>
        {tab === "leaderboard" && (
          <table className="tbl">
            <thead>
              <tr>
                <th className="c">Pos</th>
                <th>Player</th>
                <th>Team(s)</th>
                <th className="c">R1</th>
                <th className="c">R2</th>
                <th className="c">Total</th>
                <th className="c">Thru</th>
                <th className="c">Proj. Prize</th>
                <th>Team Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const { pos, isTie, tieCount } = posInfo[i];
                const prize = prizes[i];
                const bg = rowBg(pos, i);

                return (
                  <tr key={r.name}>
                    <td
                      className="c"
                      style={{
                        background: bg,
                        color: pos <= 3 ? "#c9a84c" : "#8aad8a",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {(isTie ? "T" : "") + pos}
                    </td>

                    <td
                      style={{
                        background: bg,
                        color: pos <= 5 ? "#e8e0d0" : "#a0b8a0",
                        fontWeight: pos <= 3 ? "bold" : "normal",
                      }}
                    >
                      {r.name}
                      {r.live && (
                        <span style={{ color: "#5dba5d", fontSize: 10, marginLeft: 6 }}>
                          LIVE
                        </span>
                      )}
                    </td>

                    <td style={{ background: bg }}>
                      {r.ownership.map(([t, pct]) => (
                        <span key={t} className="tag" style={{ background: TEAM_COLORS[t] || "#333" }}>
                          {t}
                          {pct < 1 ? ` ${Math.round(pct * 100)}%` : ""}
                        </span>
                      ))}
                    </td>

                    <td className="c" style={{ background: bg, color: scoreColor(r.r1), fontWeight: "bold" }}>
                      {fmtScore(r.r1)}
                    </td>
                    <td className="c" style={{ background: bg, color: scoreColor(r.r2), fontWeight: "bold" }}>
                      {r.r2 != null ? fmtScore(r.r2) : "--"}
                    </td>
                    <td
                      className="c"
                      style={{ background: bg, color: scoreColor(r.total), fontWeight: "bold", fontSize: 14 }}
                    >
                      {fmtScore(r.total)}
                    </td>
                    <td className="c" style={{ background: bg, color: "#6b9080", fontSize: 12 }}>
                      {r.thru}
                    </td>

                    <td className="c" style={{ background: bg }}>
                      {prize > 0 ? (
                        <span style={{ color: "#c9a84c", fontWeight: "bold" }}>
                          {fmtMoney(prize)}
                          {isTie && pos > 1 && (
                            <span style={{ color: "#8aad8a", fontSize: 10 }}> /{tieCount}</span>
                          )}
                        </span>
                      ) : (
                        <span style={{ color: "#3a5040" }}>--</span>
                      )}
                    </td>

                    <td style={{ background: bg }}>
                      {prize > 0 ? (
                        r.ownership.map(([t, pct]) => (
                          <span key={t} style={{ display: "inline-block", marginRight: 8, fontSize: 12 }}>
                            <span style={{ color: TEAM_COLORS[t] || "#fff", fontWeight: "bold" }}>{t}</span>
                            <span style={{ color: "#8aad8a" }}> {fmtMoney(prize * pct)}</span>
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#3a5040" }}>--</span>
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
                <th className="c">Rank</th>
                <th>Team</th>
                <th className="c">Bid</th>
                <th>Best Player</th>
                <th className="c">Earners</th>
                <th className="c">Proj. Payout</th>
                <th className="c">ROI</th>
              </tr>
            </thead>
            <tbody>
              {teamStandings.map((t, i) => {
                const bg =
                  i === 0
                    ? "#1a2a0a"
                    : i === 1
                      ? "#0f1e14"
                      : i === 2
                        ? "#12161a"
                        : i % 2 === 0
                          ? "#0d1b2e"
                          : "#0a1525";

                return (
                  <tr key={t.team}>
                    <td
                      className="c"
                      style={{
                        background: bg,
                        color: i < 3 ? "#c9a84c" : "#8aad8a",
                        fontWeight: "bold",
                        fontSize: i < 3 ? 16 : 13,
                      }}
                    >
                      {i + 1}
                    </td>

                    <td style={{ background: bg }}>
                      <span
                        className="tag"
                        style={{
                          background: TEAM_COLORS[t.team] || "#333",
                          fontSize: 13,
                          padding: "4px 10px",
                        }}
                      >
                        {t.team}
                      </span>
                    </td>

                    <td className="c" style={{ background: bg, color: "#8aad8a" }}>
                      {fmtMoney(t.bid).replace(".00", "")}
                    </td>

                    <td style={{ background: bg, color: "#c8d8b8" }}>
                      {t.best ? (
                        <>
                          {t.best}{" "}
                          <span style={{ color: scoreColor(t.bestScore) }}>{fmtScore(t.bestScore)}</span>
                        </>
                      ) : (
                        "--"
                      )}
                    </td>

                    <td
                      className="c"
                      style={{
                        background: bg,
                        color: t.earners > 0 ? "#c9a84c" : "#3a5040",
                        fontWeight: "bold",
                      }}
                    >
                      {t.earners}
                    </td>

                    <td className="c" style={{ background: bg }}>
                      <strong
                        style={{
                          color: t.payout > t.bid ? "#5dba5d" : t.payout > 0 ? "#c9a84c" : "#3a5040",
                          fontSize: 14,
                        }}
                      >
                        {t.payout > 0 ? fmtMoney(t.payout) : "--"}
                      </strong>
                    </td>

                    <td
                      className="c"
                      style={{
                        background: bg,
                        fontWeight: "bold",
                        color: t.roi >= 0 ? "#5dba5d" : "#e05050",
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
          <div style={{ maxWidth: 480, paddingTop: 12 }}>
            <div
              style={{
                background: "#0f1e14",
                border: "1px solid #2d5016",
                padding: "10px 16px",
                marginBottom: 14,
                fontSize: 12,
                color: "#8aad8a",
                borderRadius: 2,
              }}
            >
              <strong style={{ color: "#c9a84c" }}>Tie Rule: </strong>
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
                  const bg = pos <= 3 ? "#1a2a0a" : i % 2 === 0 ? "#0d1b2e" : "#0a1525";

                  return (
                    <tr key={pos}>
                      <td
                        className="c"
                        style={{
                          background: bg,
                          color: pos <= 3 ? "#c9a84c" : "#8aad8a",
                          fontWeight: pos <= 3 ? "bold" : "normal",
                        }}
                      >
                        {pos}
                        {suf}
                      </td>
                      <td
                        className="c"
                        style={{
                          background: bg,
                          color: pos <= 3 ? "#c9a84c" : "#a0b8a0",
                          fontWeight: pos <= 3 ? "bold" : "normal",
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
  );
}
