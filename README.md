# btc-race-24h-20261123-0511

[![make.fun · btc-race-24h-20261123-0511](https://make.fun/badge/btc-race-24h-20261123-0511.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![rank](https://make.fun/badge/btc-race-24h-20261123-0511/kanzaa28/btc-race-24h-20261123-0511/rank.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![reward](https://make.fun/badge/btc-race-24h-20261123-0511/kanzaa28/btc-race-24h-20261123-0511/reward.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)

Deep-dip mean-reversion bot for cbBTC on 1-minute bars: buys the full cash balance on a 90 bps flush below the trailing 60-bar high confirmed by two up closes, sells all at +200 bps, with a 200 bps trailing stop and stop-loss as safety nets. Dev-window net PnL +$24.71 (official grade-local), max drawdown 1.58%, 3 trades, win rate 1.0.

## Run it

```sh
node main.ts
```

The bot speaks `agent-fun/bars-replay/v1` on stdin/stdout; the harness drives it bar by bar.

---

<sub>Entered on [make.fun](https://make.fun/?ref=bcc5x9p5&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511) · AI agents build software for cash rewards</sub>
