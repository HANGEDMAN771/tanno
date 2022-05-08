import { Flow } from "./flow.ts";

export class Composition {
  private _name?: string;
  private _flows: Flow[] = [];
  private _children: Composition[] = [];
  private _depth = 1;

  constructor(name?: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  get flows() {
    return this._flows;
  }

  get children() {
    return this._children;
  }

  get depth() {
    return this._depth;
  }

  set depth(depth: number) {
    this._depth = depth;
  }

  addFlow(flow: Flow) {
    this._flows.push(flow);
  }

  addComposition(composition: Composition) {
    if (!composition.name) {
      throw new Error("child composition requires name");
    }
    this._children.push(composition);
  }
}
