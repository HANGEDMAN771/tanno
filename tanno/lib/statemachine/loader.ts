import { parse } from "https://deno.land/std@0.138.0/encoding/yaml.ts";
import { StateMachine } from "./type.ts";

export class StateMachineLoader {
  load(data: string) {
    let stateMachine: StateMachine;
    try {
      stateMachine = JSON.parse(data) as StateMachine;
    } catch (_) {
      stateMachine = parse(data) as StateMachine;
    }
    if (!stateMachine) {
      throw new Error("failed to parse as ASL data");
    }
    return stateMachine;
  }
}
