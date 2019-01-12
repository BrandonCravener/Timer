export class Timer {
  constructor(complete, tick) {
    this.tickCB = tick;
    this.completeCB = complete;

    this.time;
    this.currentTime;
    this.activeTimer;
    this.finishTimeout;
    this.paused = false;
  }

  start(time) {
    if (this.paused) time = this.currentTime;
    else {
      this.time = time;
      this.currentTime = time;
    }

    this.activeTimer = setInterval(() => {
      this.currentTime -= 1000;
      this.tickCB();
    }, 1000);

    this.finishTimeout = setTimeout(() => {
      if (this.activeTimer) {
        clearInterval(this.activeTimer);
      }
      this.completeCB();
    }, time);
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      if (this.activeTimer) {
        clearInterval(this.activeTimer);
        this.activeTimer = undefined;
      }
      if (this.finishTimeout) {
        clearTimeout(this.finishTimeout);
        this.finishTimeout = undefined;
      }
    }
  }

  restart() {
    const lastTime = this.time;
    this.reset();
    this.start(lastTime);
  }

  reset(cb) {
    if (this.activeTimer) {
      clearInterval(this.activeTimer);
      this.activeTimer = undefined;
    }
    if (this.finishTimeout) {
      clearTimeout(this.finishTimeout);
      this.finishTimeout = undefined;
    }
    this.time = 0;
    this.currentTime = 0;
    if (cb) {
      cb();
    }
  }
}
