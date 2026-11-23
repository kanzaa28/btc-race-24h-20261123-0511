// Deep-dip mean reversion on cbBTC/USDC, 1-minute bars.
//
// Idea: on a choppy tape the tape keeps flushing a little below its recent
// range and then bouncing back. This bot waits for a real flush — the close
// at least 90 bps under the trailing 60-bar high, with two consecutive up
// closes confirming the dip is turning — buys with all its cash, and sells
// everything once the bounce has paid 200 bps, or sooner if the position
// falls 200 bps under its fill or gives back 200 bps from its peak close.
// After a full exit it sits out 15 bars so it never re-buys the same
// falling knife on the next bar.
//
// Why these numbers: a grid search on this competition's frozen dev window
// plus the two previous editions' dev windows (an up tape +3.59%, a choppy
// tape +0.49%, a down tape -3.16%) ranked by worst-window net PnL. This
// parameter set is positive on all three (+$24.71 / +$21.86 / +$14.64,
// mean +$20.40, worst +$14.64) with max drawdown under 2% on each. The
// trailing stop and stop-loss never fired on any of the three windows;
// they are safety nets for the unseen race window, not profit sources.
// A shallower dip (80 bps, one up-tick) scores higher on this window
// (+$30.82) but its worst window drops to +$6.94, so it was not shipped.
//
// Determinism: every decision uses only the bars the harness has sent.
// No clock, no environment, no randomness. All arithmetic is bigint on
// the closes the harness reports, so two runs on the same data agree
// byte for byte.

import { runBars } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const BPS = 10_000n;

// --- tuned parameters (see the header) ---------------------------------
const DIP_BPS = 90n; // entry: close this far under the trailing 60-bar high
const LOOKBACK = 60; // bars in the trailing high
const UPTICKS = 2; // consecutive up closes confirming the turn
const TAKE_PROFIT_BPS = 200n; // exit: close this far above the fill price
const TRAIL_BPS = 200n; // exit: close this far under the peak close since entry
const STOP_BPS = 200n; // exit: close this far under the fill price
const COOLDOWN_BARS = 15; // bars to sit out after a full exit
const MAX_SLIPPAGE_BPS = 100; // cap on every order, vs the latest close

// --- per-run state -------------------------------------------------------
const closes: bigint[] = []; // every close seen, oldest first
let fillPrice: bigint | null = null; // price the open position filled at
let peakClose: bigint | null = null; // highest close since entry
let cooldown = 0;

function trailingHigh(): bigint {
  let high = 0n;
  const from = Math.max(0, closes.length - LOOKBACK);
  for (let i = from; i < closes.length; i++) {
    if (closes[i]! > high) high = closes[i]!;
  }
  return high;
}

function risingTicks(n: number): boolean {
  if (closes.length < n + 1) return false;
  for (let u = 0; u < n; u++) {
    if (closes[closes.length - 1 - u]! <= closes[closes.length - 2 - u]!) return false;
  }
  return true;
}

await runBars({
  onBatch(state, batch) {
    if (state.warmingUp) return [];
    const close = state.close(SYMBOL);
    if (close === null) return [];

    // A fill that landed on this bar's open: learn the entry price.
    for (const fill of batch.fills) {
      if (fill.symbol === SYMBOL && fill.status === 'filled' && fill.side === 'buy') {
        fillPrice = BigInt(fill.price);
        peakClose = close;
      }
    }

    closes.push(close);
    if (cooldown > 0) cooldown--;

    const held = state.positions.get(SYMBOL);
    const qty = held?.qty ?? 0n;

    if (qty === 0n) {
      fillPrice = null;
      peakClose = null;
      if (cooldown > 0) return [];
      const high = trailingHigh();
      if (high === 0n) return [];
      const dip = ((high - close) * BPS) / high;
      if (dip >= DIP_BPS && risingTicks(UPTICKS) && state.cash > 0n) {
        return [
          {
            side: 'buy',
            symbol: SYMBOL,
            notional_quote_units: state.cash,
            max_slippage_bps: MAX_SLIPPAGE_BPS,
          },
        ];
      }
      return [];
    }

    // Holding: update the peak, then check the three exits.
    if (fillPrice === null) return []; // should not happen; never sell blind
    if (peakClose === null || close > peakClose) peakClose = close;
    const up = ((close - fillPrice) * BPS) / fillPrice;
    const giveback = ((peakClose - close) * BPS) / peakClose;
    const down = ((fillPrice - close) * BPS) / fillPrice;
    if (up >= TAKE_PROFIT_BPS || giveback >= TRAIL_BPS || down >= STOP_BPS) {
      cooldown = COOLDOWN_BARS;
      return [
        {
          side: 'sell',
          symbol: SYMBOL,
          qty,
          max_slippage_bps: MAX_SLIPPAGE_BPS,
        },
      ];
    }
    return [];
  },
});
