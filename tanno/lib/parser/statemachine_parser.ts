import { Map, Parallel, State, StateMachine } from "../statemachine/type.ts";
import { Flow } from "../renderer/flow.ts";
import { Composition } from "../renderer/composition.ts";
import {
  ChoiceParser,
  FailParser,
  MapParser,
  ParallelParser,
  Parser,
  PassParser,
  SucceedParser,
  TaskParser,
  WaitParser,
} from "./state_parser.ts";

export class StateMachineParser {
  parse(stateMachine: StateMachine) {
    const { labels, composition } = this.parseComposedStateMachine([
      stateMachine,
    ], "state");
    return {
      labels: labels,
      composition: composition,
    };
  }

  parseComposedStateMachine(
    stateMachineArray: StateMachine[],
    parentName: string,
  ) {
    const isRoot = parentName == "state";
    const parentComposition = new Composition(
      parentName == "state" ? undefined : parentName,
    );
    let idNameMap: { [id: string]: string } = {};

    stateMachineArray.map((stateMachine, i) => {
      const flowMap: { [from: string]: string[] } = {};
      const ends: string[] = [];
      let count = 1;

      for (const [name, state] of Object.entries(stateMachine.States)) {
        const stateId = stateMachineArray.length == 1
          ? `${parentName}_${count}`
          : `${parentName}_${i}_${count}`;
        idNameMap[stateId] = name;
        const { next, end } = this.parseState(state);
        flowMap[name] = next;
        if (end && isRoot) { // Delete End mark except root, and make close to the official design
          ends.push(name);
        }
        if (state.Type == "Parallel" || state.Type == "Map") {
          const { labels, composition } = this.parseComposedStateMachine(
            this.stateMachineChildren(state),
            stateId,
          );
          idNameMap = { ...idNameMap, ...labels };
          parentComposition.addComposition(composition);
        }
        count++;
      }
      const flow = this.buildFlow(
        idNameMap,
        stateMachine.StartAt,
        flowMap,
        ends,
      );
      parentComposition.addFlow(flow);
    });
    return {
      labels: idNameMap,
      composition: parentComposition,
    };
  }

  stateMachineChildren(state: State) {
    switch (state.Type) {
      case "Parallel":
        return (state as Parallel).Branches;
      case "Map":
        return [(state as Map).Iterator];
      default:
        throw new Error(
          "don't use this function when state is not Parallel or Map",
        );
    }
  }

  buildFlow(
    idNameMap: { [id: string]: string },
    startAt: string,
    flowMap: { [name: string]: string[] },
    ends: string[],
  ) {
    const flippedMap: { [label: string]: string } = {};
    Object.keys(idNameMap).map((id) => {
      flippedMap[idNameMap[id]] = id;
    });
    const flow = new Flow();
    flow.start(flippedMap[startAt]);
    for (const [from, to] of Object.entries(flowMap)) {
      to.map((t) => {
        flow.transit(flippedMap[from], flippedMap[t]);
      });
    }
    ends.map((e) => {
      flow.end(flippedMap[e]);
    });
    return flow;
  }

  parseState(state: State) {
    let parser: Parser;
    switch (state.Type) {
      case "Pass":
        parser = new PassParser();
        break;
      case "Task":
        parser = new TaskParser();
        break;
      case "Choice":
        parser = new ChoiceParser();
        break;
      case "Wait":
        parser = new WaitParser();
        break;
      case "Succeed":
        parser = new SucceedParser();
        break;
      case "Fail":
        parser = new FailParser();
        break;
      case "Parallel":
        parser = new ParallelParser();
        break;
      case "Map":
        parser = new MapParser();
        break;
      default:
        throw new Error("Internal Error: Unknown State Type");
    }
    return parser.parse(state);
  }
}
