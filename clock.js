// Pure time + token helpers shared by the page and the tests. No dependencies.

/** n-th Sunday of a month (UTC date at 00:00). */
function nthSunday(year, month, n) {
  const d = new Date(Date.UTC(year, month, 1));
  d.setUTCDate(1 + ((7 - d.getUTCDay()) % 7) + 7 * (n - 1));
  return d;
}

/** US Pacific UTC offset in hours (-7 PDT / -8 PST) for a given instant. */
export function pacificOffset(date) {
  const y = date.getUTCFullYear();
  const start = nthSunday(y, 2, 2); start.setUTCHours(10); // 2am PST
  const end = nthSunday(y, 10, 1); end.setUTCHours(9);     // 2am PDT
  return date >= start && date < end ? -7 : -8;
}

/** Next midnight in US Pacific time (Gemini daily quota reset). */
export function nextPacificMidnight(now = new Date()) {
  const off = pacificOffset(now);
  const local = new Date(now.getTime() + off * 3600e3);
  const mid = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1);
  const guess = new Date(mid - off * 3600e3);
  return new Date(mid - pacificOffset(guess) * 3600e3);
}

/** Claude-style 5h window: starts at the first message, floored to the hour. */
export function fiveHourReset(firstMessage) {
  const start = new Date(firstMessage);
  start.setMinutes(0, 0, 0);
  return new Date(start.getTime() + 5 * 3600e3);
}

/** Next weekly occurrence of weekday (0=Sun) at hh:mm local time, strictly after now. */
export function nextWeekly(weekday, hh, mm, now = new Date()) {
  const d = new Date(now);
  d.setHours(hh, mm, 0, 0);
  let add = (weekday - d.getDay() + 7) % 7;
  if (add === 0 && d <= now) add = 7;
  d.setDate(d.getDate() + add);
  return d;
}

/** Roll a repeating reset forward until it's in the future. */
export function rollForward(at, everyMs, now = new Date()) {
  let t = new Date(at).getTime();
  if (!everyMs || t > now.getTime()) return new Date(t);
  const steps = Math.ceil((now.getTime() - t) / everyMs);
  return new Date(t + steps * everyMs + (t + steps * everyMs === now.getTime() ? everyMs : 0));
}

/** "6m0s", "1h 20m", "45 min", "2h", "90s", "1d 3h" -> milliseconds (null if unparseable). */
export function parseDuration(text) {
  const s = String(text).trim().toLowerCase();
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s) * 60e3; // bare number = minutes
  const re = /(\d+(?:\.\d+)?)\s*(d|days?|h|hours?|hrs?|m(?!s)|min(?:ute)?s?|s|sec(?:ond)?s?|ms)(?![a-z])/g;
  let total = 0, any = false, m;
  while ((m = re.exec(s))) {
    any = true;
    const v = Number(m[1]), u = m[2];
    total += u.startsWith("d") ? v * 864e5 : u.startsWith("h") ? v * 36e5 : u === "ms" ? v
      : u.startsWith("s") ? v * 1e3 : v * 6e4;
  }
  return any ? total : null;
}

export function formatLeft(ms) {
  if (ms <= 0) return "0:00";
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60), sec = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return d ? `${d}d ${h}h ${pad(m)}m` : h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/** Script-aware token estimate (≈). Latin ~4 chars/token, Arabic/Cyrillic ~2.5, CJK ~1.5. */
export function estimateTokens(text) {
  let t = 0;
  for (const ch of text) {
    const o = ch.codePointAt(0);
    t += o < 0x370 ? 0.25 : o < 0x800 ? 0.4 : (o >= 0x3000 && o < 0xa000) || (o >= 0xac00 && o < 0xd7b0) ? 1 / 1.5 : 1 / 3;
  }
  return text ? Math.max(1, Math.round(t)) : 0;
}
