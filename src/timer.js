export class Timer {
    constructor(ms, complete, tick) {
        this.time = ms;
        this.currentTime = ms;
        this.completeCB = complete;
        this.tickCB = tick;
        this.finishTimeout;
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
    reset() {
        if (this.finishTimeout) {
            clearTimeout(finishTimeout);
        }
        if (this.activeTimer) {
            clearInterval(activeTimer);
        }
        this.currentTime = this.ms;
    }
    restart() {
        this.reset();
        this.start();
    }
}