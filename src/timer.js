export class Timer {
    constructor(ms, complete, tick) {
        this.time = ms;
        this.currentTime = ms;
        this.completeCB = complete;
        this.tickCB = tick;
        this.finishTimeout;
        this.activeTimer;
    }
    start() {
        this.activeTimer = setInterval(() => {
            this.currentTime -= 1000;
            this.tickCB();
        }, 1000);
        this.finishTimeout = setTimeout(() => {
            if (this.activeTimer) {
                clearInterval(this.activeTimer);
            }
            this.completeCB();
        }, this.time);
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
        this.currentTime = this.ms;
        if (cb) {
            cb();
        }
    }
}