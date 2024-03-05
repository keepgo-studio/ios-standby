// SingleTon Data Class
export class Timer {
  static time = new Date();

  static _tikTok() {
    this.time = new Date();
    requestAnimationFrame(this._tikTok.bind(this));
  }

  static on() {
    requestAnimationFrame(this._tikTok.bind(this));
  }
}