import {
  describe,
  expect,
  it,
  run,
} from "https://deno.land/x/tincan@1.0.1/mod.ts";
import { StateMachine } from "../../lib/statemachine/type.ts";
import { StateMachineParser } from "../../lib/parser/statemachine_parser.ts";
import { Composition } from "../../lib/renderer/composition.ts";
import { Flow } from "../../lib/renderer/flow.ts";

describe("StateMachineParser", () => {
  describe("parse", () => {
    const stateMachine = {
      StartAt: "step 1",
      States: {
        "step 1": {
          Type: "Task",
          Next: "step 2",
        },
        "step 2": {
          Type: "Choice",
          Default: "step 3",
          Choices: [{
            Next: "step 3",
          }, {
            Next: "step 4",
          }],
        },
        "step 3": {
          Type: "Parallel",
          Next: "step 5",
          Branches: [{
            StartAt: "step 3-1-1",
            States: {
              "step 3-1-1": {
                Type: "Pass",
                Next: "step 3-1-2",
              },
              "step 3-1-2": {
                Type: "Wait",
                End: true,
              },
            },
          }, {
            StartAt: "step 3-2-1",
            States: {
              "step 3-2-1": {
                Type: "Map",
                End: true,
                Iterator: {
                  StartAt: "step 3-2-1-1",
                  States: {
                    "step 3-2-1-1": {
                      Type: "Task",
                      End: true,
                    },
                  },
                },
              },
            },
          }],
        },
        "step 4": {
          Type: "Fail",
        },
        "step 5": {
          Type: "Succeed",
        },
      },
    } as StateMachine;
    const parser = new StateMachineParser();
    const labels = {
      "state_1": "step 1",
      "state_2": "step 2",
      "state_3": "step 3",
      "state_3_0_1": "step 3-1-1",
      "state_3_0_2": "step 3-1-2",
      "state_3_1_1": "step 3-2-1",
      "state_3_1_1_1": "step 3-2-1-1",
      "state_4": "step 4",
      "state_5": "step 5",
    };
    const composition = new Composition();
    const flow1 = new Flow();
    flow1.start("state_1")
      .transit("state_1", "state_2")
      .transit("state_2", "state_3")
      .transit("state_2", "state_4")
      .transit("state_3", "state_5")
      .end("state_4")
      .end("state_5");
    composition.addFlow(flow1);

    const parallelComposition = new Composition("state_3");
    const flow2 = new Flow();
    flow2.start("state_3_0_1")
      .transit("state_3_0_1", "state_3_0_2");
    parallelComposition.addFlow(flow2);
    const flow3 = new Flow();
    flow3.start("state_3_1_1");
    parallelComposition.addFlow(flow3);
    const mapComposition = new Composition("state_3_1_1");
    const flow4 = new Flow();
    flow4.start("state_3_1_1_1");
    mapComposition.addFlow(flow4);
    parallelComposition.addComposition(mapComposition);
    composition.addComposition(parallelComposition);

    const actual = parser.parse(stateMachine);

    it("should return labels", () => {
      expect(actual.labels).toEqual(labels);
    });
    it("should return composition name", () => {
      expect(actual.composition.name).toEqual(composition.name);
    });
    it("should return composition children", () => {
      expect(actual.composition.children).toEqual(composition.children);
    });
    it("should return flows", () => {
      expect(actual.composition.flows).toEqual(composition.flows);
    });
  });
});

run();
