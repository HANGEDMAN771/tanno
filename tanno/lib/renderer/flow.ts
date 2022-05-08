import { Transition } from "./transition.ts";

export class Flow {
  private _startAt = "";
  private _transitions: Transition[] = [];

  start(start: string) {
    this._transitions = [];
    this._startAt = start;
    this._transitions.push(new Transition("[*]", start));
    return this;
  }

  transit(from: string, to: string) {
    this._transitions.push(new Transition(from, to));
    return this;
  }

  end(end: string) {
    this._transitions.push(new Transition(end, "[*]"));
    return this;
  }

  get startAt() {
    return this._startAt;
  }

  get transition() {
    return this._transitions;
  }
}
