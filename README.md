# ⏳ AI Reset Clock

**When does my Claude, ChatGPT / Codex or Gemini limit reset? Live countdowns in your own timezone, with alerts, in English and العربية.**

### 👉 [Open the clock](https://mohammed2345353.github.io/ai-reset-clock/)

[![CI](https://github.com/mohammed2345353/ai-reset-clock/actions/workflows/ci.yml/badge.svg)](https://github.com/mohammed2345353/ai-reset-clock/actions/workflows/ci.yml)
![No build](https://img.shields.io/badge/build-none-brightgreen)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

## The problem

Every AI tool resets on a different clock, and none of them use yours:

| Service | How it resets | The confusing part |
|---|---|---|
| **Gemini API / Gemini CLI** daily quota | midnight **US Pacific** | That's 11:00 in Baghdad, 08:00 UTC, 13:30 in Delhi… and it moves with US daylight saving |
| **Claude Pro/Max** session | rolling **5 hours** from your first message (floored to the hour) | Not midnight, and it depends on when *you* started |
| **Claude** weekly cap | a fixed time each week | Easy to forget which day |
| **Codex (ChatGPT plan)** | 5-hour + weekly windows | Shown in `/status`, but only while you're in Codex |

So people keep asking "when can I use it again?" and doing timezone math by hand.

## What the page does

- **Gemini countdown, automatic.** It computes the next midnight Pacific with correct DST rules and shows it in your local time.
- **Claude 5-hour window.** Press *I just started*, enter the time of your first message, or paste "resets in 2h 14m".
- **Weekly limits** for Claude and Codex: pick the day and time once and it rolls forward every week.
- **Codex 5-hour window**: paste the time left from `/status`.
- **Your own timers** for anything else (ChatGPT image caps, free trials…): once, every 5 h, daily or weekly.
- **Browser notification** when a limit resets, and the tab title shows the next reset.
- **Token estimator**: paste a prompt or log to see ≈ tokens and the share of a 128K / 200K / 1M context window.
- **Arabic (RTL) and English**, light/dark theme, works on phones.
- **Private.** Everything stays in your browser (`localStorage`). No sign-in, no tracking, no server.

## Run locally

```bash
git clone https://github.com/mohammed2345353/ai-reset-clock
cd ai-reset-clock
python -m http.server 8000   # ES modules need http://, not file://
# open http://localhost:8000
```

Tests (Node 18+): `node --test`

## How it works

`clock.js` holds the pure logic (Pacific DST rules, 5-hour windows, weekly roll-forward, duration parsing like `6m0s` / `1h 20m`, token estimate). Node tests cover it. `index.html` is the UI. There's no framework and no build step.

## Limitations

- Claude and Codex don't expose your reset time to web pages, so you enter it once from `/usage` or `/status`. To read it automatically from local logs, use [burnrate](https://github.com/mohammed2345353/burnrate).
- Providers change their reset rules. Open an issue if one changes.

## Roadmap

- [ ] PWA / install as an app with offline support
- [ ] Shareable link with your timers encoded in the URL
- [ ] More languages (Spanish, Turkish, Persian)

## Related tools in this suite

Small, dependency-free tools for people fighting AI usage limits:

| Tool | What it does |
|---|---|
| [burnrate](https://github.com/mohammed2345353/burnrate) | Forecast Claude Code / Codex limits from local logs |
| [context-diet](https://github.com/mohammed2345353/context-diet) | Find the CLAUDE.md / AGENTS.md / GEMINI.md bloat you pay for on every message |
| [ai-handoff](https://github.com/mohammed2345353/ai-handoff) | Hit a limit? Move the task to another AI with a handoff file |
| [ai-error-decoder](https://github.com/mohammed2345353/ai-error-decoder) | Explain 429 / 529 / quota errors from Anthropic, OpenAI and Gemini |
| [ratelimit-retry](https://github.com/mohammed2345353/ratelimit-retry) | Retry that respects provider rate-limit headers (JS) |
| [chat-export-md](https://github.com/mohammed2345353/chat-export-md) | ChatGPT / Claude / Gemini exports → Markdown |
| [mcp-token-audit](https://github.com/mohammed2345353/mcp-token-audit) | Measure how many tokens each MCP server's tools cost |
| [logslim](https://github.com/mohammed2345353/logslim) | Shrink logs and stack traces before pasting them into a chat |
| [chunkwise](https://github.com/mohammed2345353/chunkwise) | Split big files into token-budgeted chunks with continuation prompts |
| **ai-reset-clock** | When does my quota reset? A countdown in your timezone |

## Contributing

Translations are especially welcome. Add a block to the `T` dictionary in `index.html`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
