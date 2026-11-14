import test from "node:test";
import assert from "node:assert/strict";
import { pacificOffset, nextPacificMidnight, fiveHourReset, nextWeekly, rollForward, parseDuration,
  formatLeft, estimateTokens } from "../clock.js";

test("pacific offset handles DST", () => {
  assert.equal(pacificOffset(new Date("2026-07-01T12:00:00Z")), -7);
  assert.equal(pacificOffset(new Date("2026-12-01T12:00:00Z")), -8);
  assert.equal(pacificOffset(new Date("2026-03-08T09:59:00Z")), -8);
  assert.equal(pacificOffset(new Date("2026-03-08T10:00:00Z")), -7);
  assert.equal(pacificOffset(new Date("2026-11-01T08:59:00Z")), -7);
  assert.equal(pacificOffset(new Date("2026-11-01T09:00:00Z")), -8);
});

test("next pacific midnight", () => {
  assert.equal(nextPacificMidnight(new Date("2026-11-14T12:00:00Z")).toISOString(), "2026-11-15T08:00:00.000Z");
  assert.equal(nextPacificMidnight(new Date("2026-07-01T12:00:00Z")).toISOString(), "2026-07-02T07:00:00.000Z");
  // just before midnight PT
  assert.equal(nextPacificMidnight(new Date("2026-11-15T07:59:00Z")).toISOString(), "2026-11-15T08:00:00.000Z");
});

test("five hour window floors to the hour", () => {
  const r = fiveHourReset(new Date(2026, 10, 14, 15, 42));
  assert.equal(r.getHours(), 20);
  assert.equal(r.getMinutes(), 0);
});

test("next weekly", () => {
  const now = new Date(2026, 10, 14, 12, 0); // Saturday
  const fri = nextWeekly(5, 21, 54, now);
  assert.equal(fri.getDay(), 5);
  assert.equal(fri.getDate(), 20);
  const sameDayLater = nextWeekly(6, 18, 0, now);
  assert.equal(sameDayLater.getDate(), 14);
  const sameDayEarlier = nextWeekly(6, 9, 0, now);
  assert.equal(sameDayEarlier.getDate(), 21);
});

test("roll forward", () => {
  const now = new Date("2026-11-14T12:00:00Z");
  const r = rollForward("2026-11-14T02:00:00Z", 5 * 3600e3, now);
  // 02:00 + 5h steps lands exactly on "now" (12:00), so the next future reset is 17:00
  assert.equal(r.toISOString(), "2026-11-14T17:00:00.000Z");
  assert.equal(rollForward("2026-11-14T03:00:00Z", 5 * 3600e3, now).toISOString(), "2026-11-14T13:00:00.000Z");
  assert.equal(rollForward("2026-11-15T00:00:00Z", 0, now).toISOString(), "2026-11-15T00:00:00.000Z");
});

test("parse durations", () => {
  assert.equal(parseDuration("6m0s"), 360e3);
  assert.equal(parseDuration("1h 20m"), 80 * 60e3);
  assert.equal(parseDuration("45 min"), 45 * 60e3);
  assert.equal(parseDuration("2 hours"), 2 * 36e5);
  assert.equal(parseDuration("1d 3h"), 27 * 36e5);
  assert.equal(parseDuration("90"), 90 * 60e3);
  assert.equal(parseDuration("soon"), null);
});

test("format + tokens", () => {
  assert.equal(formatLeft(0), "0:00");
  assert.equal(formatLeft(65e3), "1:05");
  assert.equal(formatLeft(3 * 36e5 + 61e3), "3:01:01");
  assert.equal(formatLeft(26 * 36e5), "1d 2h 00m");
  assert.equal(estimateTokens("a".repeat(400)), 100);
  assert.equal(estimateTokens("ب".repeat(400)), 160);
  assert.equal(estimateTokens(""), 0);
});
