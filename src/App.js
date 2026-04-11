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
  ["Hojgaard, Rasmus", [["BAR", 0.5], ["KRAHN", 0.5]], ["rasmus hojgaard", "rasmus højgaard", "rasmus hogaard"], 3, null],
  ["Hojgaard, Nicolai", [["BAR", 0.5], ["KRAHN", 0.5]], ["nicolai hojgaard", "nicolai højgaard", "nicolai hogaard"], 3, null],
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

const PARS = [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4];

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

function parseScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value).trim();
  if (!str) return null;
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

function normalizePlayerScores(r1, r2, total) {
  const hasR1 = r1 !== null && r1 !== undefined;
  const hasR2 = r2 !== null && r2 !== undefined;
  const hasTotal = total !== null && total !== undefined;

  if (hasR1 && hasR2) {
    return { r1, r2, total: r1 + r2 };
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
    const missedCut = live?.thru === "MC";

    return {
      name: p[0],
      shortName: p[0].split(",")[0].toUpperCase(),
      ownership: p[1],
      r1,
      r2,
      total,
      thru: live?.thru ?? (p[4] !== null ? "F" : "–"),
      missedCut,
      live: !!live,
    };
  }).sort((a, b) => {
    if (a.missedCut !== b.missedCut) return a.missedCut ? 1 : -1;
    if (a.total !== b.total) return a.total - b.total;
    return a.name.localeCompare(b.name);
  });
}

function parseMastersScreenReaderText(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();

  const nameMatch = clean.match(/^Player\s+(.+?),\s*Position/i);
  const todayMatch = clean.match(/Today's score is\s*([+\-]?\d+|E)/i);
  const totalMatch = clean.match(/To par total score is\s*([+\-]?\d+|E)/i);
  const missedCut = /MISSED CUT/i.test(clean);

  return {
    rawName: nameMatch?.[1]?.trim() || "",
    today: parseScore(todayMatch?.[1] ?? null),
    total: parseScore(totalMatch?.[1] ?? null),
    missedCut,
  };
}

function extractMastersPlayersFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const allSection = doc.querySelector("#leaderBoardPlayersContent");
  if (!allSection) throw new Error("Masters leaderboard HTML structure not found");

  const nodes = Array.from(allSection.querySelectorAll(".screen-reader-only"));
  const players = [];

  for (const node of nodes) {
    const parsed = parseMastersScreenReaderText(node.textContent || "");
    if (!parsed.rawName) continue;

    const pool = matchPlayer(parsed.rawName);
    const canonicalName = pool ? pool[0] : parsed.rawName;
    const r2 = parsed.today;
    const total = parsed.total;
    const r1 = r2 !== null && total !== null ? total - r2 : null;

    players.push({
      name: canonicalName,
      r1,
      r2,
      total,
      thru: parsed.missedCut ? "MC" : "F",
    });
  }

  const deduped = new Map();
  for (const p of players) {
    if (!deduped.has(p.name)) deduped.set(p.name, p);
  }

  return Array.from(deduped.values());
}

async function fetchMastersLeaderboard() {
  const res = await fetch("https://www.masters.com/en_US/scores/index.html");
  if (!res.ok) throw new Error(`Masters HTML ${res.status}`);
  const html = await res.text();
  const players = extractMastersPlayersFromHtml(html);

  return {
    round: "Round 2",
    status: "Masters Leaderboard",
    players,
  };
}

function buildHoleProgression(r1, r2, missedCut) {
  if (missedCut) return [];
  const final = r2 ?? 0;
  const progression = [];
  for (let i = 1; i <= 18; i++) {
    progression.push(Math.round((final * i) / 18));
  }
  return progression;
}

function posArray(rows) {
  return rows.map((r, i, arr) => {
    let pos = 1;
    for (let k = 0; k < i; k++) {
      if (arr[k].missedCut && !r.missedCut) continue;
      if (!arr[k].missedCut && r.missedCut) pos++;
      else if (arr[k].total < r.total) pos++;
    }
    const same = arr.filter((x) => x.missedCut === r.missedCut && x.total === r.total).length;
    return { pos, isTie: same > 1 };
  });
}

function Cell({ children, width = 38, color = "#b1122f", bold = true }) {
  return (
    <div
      style={{
        width,
        minWidth: width,
        height: 38,
        border: "1px solid #9d9d9d",
        background: "#efeeeb",
        boxShadow: "inset 0 0 0 2px #d9d8d4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: bold ? 800 : 700,
        color,
        fontSize: 18,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

function HeaderCell({ children, width = 38, tall = false }) {
  return (
    <div
      style={{
        width,
        minWidth: width,
        height: tall ? 84 : 42,
        borderRight: "1px solid #666",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: tall ? 18 : 17,
        fontWeight: 700,
        color: "#303336",
        background: "#ddd9d4",
      }}
    >
      {children}
    </div>
  );
}

export default function MastersPool() {
  const [liveMap, setLiveMap] = useState({});
  const [meta, setMeta] = useState({ round: "Round 2", status: "Seeded Data" });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const rows = useMemo(() => buildRows(liveMap), [liveMap]);
  const posInfo = useMemo(() => posArray(rows), [rows]);
  const prizes = useMemo(() => computePayouts(rows.filter((r) => !r.missedCut)), [rows]);

  const favorites = useMemo(() => {
    const favIds = new Set(["McIlroy, Rory", "Scheffler, Scottie", "Bridgeman, Jacob", "DeChambeau, Bryson"]);
    return rows.filter((r) => favIds.has(r.name)).slice(0, 4);
  }, [rows]);

  const allPlayers = useMemo(() => rows.slice(0, 18), [rows]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchMastersLeaderboard();
      const map = {};

      for (const ap of data.players || []) {
        const pool = matchPlayer(ap.name);
        if (!pool) continue;

        const normalized = normalizePlayerScores(
          ap.r1 ?? null,
          ap.r2 ?? null,
          ap.total ?? null
        );

        map[pool[0]] = {
          r1: normalized.r1,
          r2: normalized.r2,
          total: normalized.total,
          thru: ap.thru ?? "–",
        };
      }

      setLiveMap(map);
      setMeta({ round: data.round, status: data.status });
    } catch (e) {
      setFetchError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const renderBoardRow = (r, idx, favorite = false) => {
    const p = rows.findIndex((x) => x.name === r.name);
    const pos = posInfo[p];
    const holes = buildHoleProgression(r.r1, r.r2, r.missedCut);

    return (
      <div
        key={`${favorite ? "fav" : "all"}-${r.name}`}
        style={{
          display: "flex",
          alignItems: "stretch",
          borderBottom: "2px solid #444",
          background: "#dcd9d4",
        }}
      >
        <div style={{ padding: 4 }}>
          <Cell width={38} color="#c5162f">
            {r.missedCut ? "" : fmtScore(r.r1).replace("+", "")}
          </Cell>
        </div>

        <div
          style={{
            width: 270,
            minWidth: 270,
            borderLeft: "2px solid #444",
            borderRight: "2px solid #444",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontWeight: 800,
            fontSize: 20,
            color: "#303336",
            background: "#dcd9d4",
            textTransform: "uppercase",
          }}
        >
          {r.shortName}
        </div>

        {r.missedCut ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 22,
              color: "#333",
              background: "#dcd9d4",
              textTransform: "uppercase",
            }}
          >
            MISSED CUT
          </div>
        ) : (
          <div style={{ display: "flex", padding: 4, gap: 4 }}>
            {holes.map((h, i) => {
              const color = h < 0 ? "#c5162f" : h > 0 ? "#0c6a4b" : "#0c6a4b";
              return (
                <Cell key={i} color={color}>
                  {h}
                </Cell>
              );
            })}
          </div>
        )}

        <div
          style={{
            width: 44,
            minWidth: 44,
            borderLeft: "2px solid #444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b7a50",
            fontSize: 24,
            background: "#dcd9d4",
          }}
        >
          ⚑
        </div>

        <div
          style={{
            width: 44,
            minWidth: 44,
            borderLeft: "1px solid #777",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: favorite ? "#e0b000" : "#80868b",
            fontSize: 24,
            background: "#dcd9d4",
          }}
        >
          ★
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #2866d4 0%, #3d8cf0 38%, #7ec7ff 55%, #5fa63b 56%, #2f6d21 100%)",
        padding: "44px 20px 80px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            background: "linear-gradient(180deg,#2c5a31,#15381d)",
            position: "absolute",
            left: "50%",
            bottom: -110,
            transform: "translateX(-50%)",
            borderRadius: "0 0 20px 20px",
            boxShadow: "inset 0 0 25px rgba(0,0,0,.35)",
          }}
        />
        <div
          style={{
            background: "#d7d4cf",
            border: "3px solid #666",
            boxShadow: "0 10px 30px rgba(0,0,0,.35)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: 92,
              background: "#efeeeb",
              borderBottom: "3px solid #444",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              position: "relative",
              clipPath: "ellipse(60% 100% at 50% 0%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 6,
                fontSize: 64,
                fontWeight: 900,
                color: "#23272b",
                letterSpacing: 2,
              }}
            >
              LEADERS
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderBottom: "3px solid #444",
              background: "#ddd9d4",
            }}
          >
            <div
              style={{
                width: 46,
                minWidth: 46,
                borderRight: "2px solid #444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                writingMode: "vertical-rl",
                textOrientation: "upright",
                fontSize: 14,
                color: "#303336",
                letterSpacing: 1,
                padding: "6px 0",
              }}
            >
              PRIOR
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", borderBottom: "1px solid #666" }}>
                <div
                  style={{
                    width: 270,
                    minWidth: 270,
                    borderRight: "2px solid #444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    fontWeight: 500,
                    letterSpacing: 6,
                    color: "#303336",
                    height: 54,
                  }}
                >
                  HOLE
                </div>
                {Array.from({ length: 18 }, (_, i) => (
                  <HeaderCell key={i}>{i + 1}</HeaderCell>
                ))}
                <HeaderCell width={44} tall>
                  <div style={{ lineHeight: 0.8, textAlign: "center", fontSize: 14 }}>T<br />R<br />A<br />C<br />K</div>
                </HeaderCell>
                <HeaderCell width={44} tall>
                  <div style={{ lineHeight: 0.8, textAlign: "center", fontSize: 14 }}>F<br />A<br />V</div>
                </HeaderCell>
              </div>

              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: 270,
                    minWidth: 270,
                    borderRight: "2px solid #444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    fontWeight: 500,
                    letterSpacing: 5,
                    color: "#303336",
                    height: 42,
                  }}
                >
                  PAR
                </div>
                {PARS.map((p, i) => (
                  <HeaderCell key={i}>{p}</HeaderCell>
                ))}
                <div style={{ width: 44 }} />
                <div style={{ width: 44 }} />
              </div>
            </div>
          </div>

          <div style={{ background: "#d7d4cf" }}>
            <div
              style={{
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 900,
                borderBottom: "2px solid #666",
                background: "#d7d4cf",
              }}
            >
              FAVORITES
            </div>
            {favorites.map((r, i) => renderBoardRow(r, i, true))}

            <div
              style={{
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 900,
                borderTop: "2px solid #666",
                borderBottom: "2px solid #666",
                background: "#d7d4cf",
              }}
            >
              ALL PLAYERS
            </div>
            {allPlayers.map((r, i) => renderBoardRow(r, i, false))}
          </div>

          <div
            style={{
              height: 86,
              background: "linear-gradient(180deg,#3d6740,#254629)",
              borderTop: "3px solid #2f5a33",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              color: "#fff",
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700 }}>
              {loading ? "Refreshing..." : meta.status}
              {fetchError ? ` — ${fetchError}` : ""}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{meta.round}</div>
            <div style={{ fontSize: 14 }}>ⓘ About the Leader Board</div>
          </div>
        </div>
      </div>
    </div>
  );
}
