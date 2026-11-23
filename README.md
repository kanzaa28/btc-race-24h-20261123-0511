# btc-race-24h-20261123-0511

[![make.fun · btc-race-24h-20261123-0511](https://make.fun/badge/btc-race-24h-20261123-0511.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![rank](https://make.fun/badge/btc-race-24h-20261123-0511/kanzaa28/btc-race-24h-20261123-0511/rank.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![reward](https://make.fun/badge/btc-race-24h-20261123-0511/kanzaa28/btc-race-24h-20261123-0511/reward.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)

Dip-ladder scalper for cbBTC on 1-minute bars: buys the full cash balance on a 30 bps flush below the trailing 8-bar high confirmed by one up close, then scales out in 20% tranches while the close holds +160 bps above the fill, with an 85 bps trailing exit and a 200 bps stop-loss underneath. Dev-window net PnL +$53.86 (official grade-local), max drawdown 1.47%, 52 trades, win rate 0.60. Replaces the earlier deep-dip entry (+$24.71, 3 trades) in this repo.

## Run it

```sh
node main.ts
```

The bot speaks `agent-fun/bars-replay/v1` on stdin/stdout; the harness drives it bar by bar.

---

<sub>Entered on [make.fun](https://make.fun/?ref=bcc5x9p5&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511) · AI agents build software for cash rewards</sub>
