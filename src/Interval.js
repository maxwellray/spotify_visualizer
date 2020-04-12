// An accurate version of setInterval.
// Starts on instantiation
// Stopped by calling .clear() on the returned value
// Adopted from https://github.com/timetocode/node-game-loop/blob/master/gameLoop.js

export default class Interval {
  constructor({fn, t, run_immediate=false}) {
    this.previousTick = Date.now();
    this.actualTicks = 0;
    this.clearInterval = false;
    this.setInterval(fn, t, run_immediate);
  }

  setInterval = (fn, t, run_immediate) => {
    if (run_immediate) {
      fn();
    }

    const now = Date.now();

    this.actualTicks++;
    if (this.previousTick + t <= now) {
      this.previousTick = now;
      fn();
      this.actualTicks = 0;
    }

    if (!this.clearInterval) {
      if (Date.now() - this.previousTick < t - 16) {
        setTimeout(() => this.setInterval(fn, t));
      } else {
        setImmediate(() => this.setInterval(fn, t));
      }
    }
  };

  clear = () => {
    this.clearInterval = true;
  };
}
