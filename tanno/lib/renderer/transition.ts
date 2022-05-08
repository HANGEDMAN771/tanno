export class Transition {
  private _start: string;
  private _end: string;

  constructor(start: string, end: string) {
    this._start = start;
    this._end = end;
  }

  get() {
    return {
      start: this._start,
      end: this._end,
    };
  }

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }
}
