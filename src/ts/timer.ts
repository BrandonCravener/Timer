export default class Timer {
  private tick: Function;
  private complete: Function;

  private tickInterval: number;
  private completeTimeout: number;

  public time: number;
  public currentTime: number;
  public paused: boolean = false;

  constructor(tick: Function, complete: Function) {
    this.tick = tick;
    this.complete = complete;
  }

  start(time) {
    this.time = time;
    this.currentTime = time;

    this.tickInterval = setInterval(() => {
      this.tick();
      this.currentTime -= 1000;
    }, 1000);

    this.completeTimeout = setTimeout(() => {
      this.stop();
      this.complete();
    }, this.time);
  }

  restart() {
    const time = this.time;

    this.stop();
    this.start(time);
  }

  resume() {
    const remainingTime = this.time - (this.time - this.currentTime);

    this.paused = false;

    this.tickInterval = setInterval(() => {
      this.tick();
      this.currentTime -= 1000;
    }, 1000);

    this.completeTimeout = setTimeout(() => {
      this.stop();
      this.complete();
    }, remainingTime);
  }

  pause() {
    this.paused = true;
    clearInterval(this.tickInterval);
    clearTimeout(this.completeTimeout);
  }

  stop() {
    clearInterval(this.tickInterval);
    clearTimeout(this.completeTimeout);
  }

  getTimeString() {
    const oneHour = 60 * 60 * 1000;
    const oneMinute = 60 * 1000;
    const oneSecond = 1000;

    let localTime = this.currentTime;

    const hours = (localTime - (localTime % oneHour)) / oneHour;
    localTime -= hours * oneHour;

    const minutes = (localTime - (localTime % oneMinute)) / oneMinute;
    localTime -= minutes * oneMinute;

    const seconds = (localTime - (localTime % oneSecond)) / oneSecond;
    localTime -= seconds * oneSecond;

    let times = [];

    if (hours != 0) times.push(hours);
    if (hours > 1) times.push("hours");
    else if (hours == 1) times.push("hour");

    if (minutes != 0) times.push(minutes);
    if (minutes > 1) times.push("minutes");
    else if (minutes == 1) times.push("minute");

    if (seconds != 0) times.push(seconds);
    if (seconds > 1) times.push("seconds");
    else if (seconds == 1) times.push("second");

    return times.join(" ");
  }
}
