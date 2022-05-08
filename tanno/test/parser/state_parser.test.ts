import {
  describe,
  expect,
  it,
  run,
} from "https://deno.land/x/tincan@1.0.1/mod.ts";
import {
  ChoiceParser,
  FailParser,
  MapParser,
  ParallelParser,
  PassParser,
  SucceedParser,
  TaskParser,
  WaitParser,
} from "../../lib/parser/state_parser.ts";
import {
  Choice,
  Fail,
  Map,
  Parallel,
  Pass,
  Succeed,
  Task,
  Wait,
} from "../../lib/statemachine/type.ts";

describe("Parser", () => {
  describe("PassParser", () => {
    it("#1 should return next state if next exists", () => {
      const state = {
        Type: "Pass",
        Next: "next state",
      } as Pass;
      const parser = new PassParser();
      expect(parser.parse(state)).toEqual({
        next: ["next state"],
        end: false,
      });
    });
    it("#2 should not return next if end is true", () => {
      const state = {
        Type: "Pass",
        End: true,
      } as Pass;
      const parser = new PassParser();
      expect(parser.parse(state)).toEqual({
        next: [],
        end: true,
      });
    });
    it("#3 should throw error if it does not have both Next and End field", () => {
      const state = {
        Type: "Pass",
      } as Pass;
      const parser = new PassParser();
      expect(() => {
        parser.parse(state);
      }).toThrow();
    });
  });
  describe("TaskParser", () => {
    it("#1 should return next state if next exists", () => {
      const state = {
        Type: "Task",
        Next: "next state",
      } as Task;
      const parser = new TaskParser();
      expect(parser.parse(state)).toEqual({
        next: ["next state"],
        end: false,
      });
    });
    it("#2 should not return next if end is true", () => {
      const state = {
        Type: "Task",
        End: true,
      } as Task;
      const parser = new TaskParser();
      expect(parser.parse(state)).toEqual({
        next: [],
        end: true,
      });
    });
    it("#3 should throw error if it does not have both Next and End field", () => {
      const state = {
        Type: "Task",
      } as Task;
      const parser = new TaskParser();
      expect(() => {
        parser.parse(state);
      }).toThrow();
    });
    it("#4 should return both next and catch next if catch exists", () => {
      const state = {
        Type: "Task",
        Next: "next state",
        Catch: [{
          ErrorEquals: ["eror"],
          Next: "error case",
        }],
      } as Task;
      const parser = new TaskParser();
      expect(parser.parse(state)).toEqual({
        next: ["next state", "error case"],
        end: false,
      });
    });
  });
  describe("WaitParser", () => {
    it("#1 should return next state if next exists", () => {
      const state = {
        Type: "Wait",
        Next: "next state",
      } as Wait;
      const parser = new WaitParser();
      expect(parser.parse(state)).toEqual({
        next: ["next state"],
        end: false,
      });
    });
    it("#2 should not return next if end is true", () => {
      const state = {
        Type: "Wait",
        End: true,
      } as Wait;
      const parser = new WaitParser();
      expect(parser.parse(state)).toEqual({
        next: [],
        end: true,
      });
    });
    it("#3 should throw error if it does not have both Next and End field", () => {
      const state = {
        Type: "Wait",
      } as Wait;
      const parser = new WaitParser();
      expect(() => {
        parser.parse(state);
      }).toThrow();
    });
  });
  describe("ParallelParser", () => {
    it("#1 should return next state if next exists", () => {
      const state = {
        Type: "Parallel",
        Next: "next state",
      } as Parallel;
      const parser = new ParallelParser();
      expect(parser.parse(state)).toEqual({
        next: ["next state"],
        end: false,
      });
    });
    it("#2 should not return next if end is true", () => {
      const state = {
        Type: "Parallel",
        End: true,
      } as Parallel;
      const parser = new ParallelParser();
      expect(parser.parse(state)).toEqual({
        next: [],
        end: true,
      });
    });
    it("#3 should throw error if it does not have both Next and End field", () => {
      const state = {
        Type: "Parallel",
      } as Parallel;
      const parser = new ParallelParser();
      expect(() => {
        parser.parse(state);
      }).toThrow();
    });
  });
  describe("MapParser", () => {
    it("#1 should return next state if next exists", () => {
      const state = {
        Type: "Map",
        Next: "next state",
      } as Map;
      const parser = new MapParser();
      expect(parser.parse(state)).toEqual({
        next: ["next state"],
        end: false,
      });
    });
    it("#2 should not return next if end is true", () => {
      const state = {
        Type: "Map",
        End: true,
      } as Map;
      const parser = new MapParser();
      expect(parser.parse(state)).toEqual({
        next: [],
        end: true,
      });
    });
    it("#3 should throw error if it does not have both Next and End field", () => {
      const state = {
        Type: "Map",
      } as Map;
      const parser = new MapParser();
      expect(() => {
        parser.parse(state);
      }).toThrow();
    });
  });
  describe("SucceedParser", () => {
    it("#1 should always return end", () => {
      const state = {
        Type: "Succeed",
      } as Succeed;
      const parser = new SucceedParser();
      expect(parser.parse(state)).toEqual({
        next: [],
        end: true,
      });
    });
  });
  describe("FailParser", () => {
    it("#1 should always return end", () => {
      const state = {
        Type: "Fail",
      } as Fail;
      const parser = new FailParser();
      expect(parser.parse(state)).toEqual({
        next: [],
        end: true,
      });
    });
  });
  describe("ChoiceParser", () => {
    it("#1 should return default and choices Next state", () => {
      const state = {
        Type: "Choice",
        Choices: [{
          Next: "option 1",
        }, {
          Next: "option 2",
        }],
        Default: "default state",
      } as Choice;
      const parser = new ChoiceParser();
      expect(parser.parse(state)).toEqual({
        next: ["option 1", "option 2", "default state"],
        end: false,
      });
    });
    it("#2 should return choices Next state if Default is omitted", () => {
      const state = {
        Type: "Choice",
        Choices: [{
          Next: "option 1",
        }, {
          Next: "option 2",
        }],
      } as Choice;
      const parser = new ChoiceParser();
      expect(parser.parse(state)).toEqual({
        next: ["option 1", "option 2"],
        end: false,
      });
    });
    it("#3 should throw error if Choices dont have Next", () => {
      const state = {
        Type: "Choice",
        Choices: [{}, {
          Next: "option 2",
        }],
      } as Choice;
      const parser = new ChoiceParser();
      expect(() => {
        parser.parse(state);
      }).toThrow();
    });
  });
});

run();
