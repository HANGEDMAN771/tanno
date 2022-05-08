import {
  beforeEach,
  describe,
  expect,
  it,
  run,
} from "https://deno.land/x/tincan@1.0.1/mod.ts";
import { Renderer } from "../../lib/renderer/renderer.ts";
import { Composition } from "../../lib/renderer/composition.ts";
import { Flow } from "../../lib/renderer/flow.ts";

const EXPECT_1 = `
\`\`\`mermaid
stateDiagram-v2
  state_1: hoge
  state_2: fuga
  state_3: hige
  state_4: bogo

  [*] --> state_1
  state_1 --> state_2
  state_2 --> state_3
  state_2 --> state_4
  state_3 --> [*]
  state_4 --> [*]
\`\`\`
`;
const EXPECT_2 = `
\`\`\`mermaid
stateDiagram-v2
  state_1: hoge
  state_1_1_1: hogehoge
  state_1_1_2: hogehogehoge
  state_1_2_1: hogefuga
  state_2: fuga

  state state_1 {
    [*] --> state_1_1_1
    state_1_1_1 --> state_1_1_2
    --
    [*] --> state_1_2_1
  }
  [*] --> state_1
  state_1 --> state_2
  state_2 --> [*]
\`\`\`
`;

describe("Renderer", () => {
  let root: Composition = new Composition();
  let labels: { [lalbel: string]: string };

  beforeEach(() => {
    root = new Composition();
    labels = {};
  });

  describe("render", () => {
    it("#1 should return label & flow strings with simple composition", () => {
      const flow = new Flow();
      flow.start("state_1")
        .transit("state_1", "state_2")
        .transit("state_2", "state_3")
        .transit("state_2", "state_4")
        .end("state_3")
        .end("state_4");

      root.addFlow(flow);
      labels["state_1"] = "hoge";
      labels["state_2"] = "fuga";
      labels["state_3"] = "hige";
      labels["state_4"] = "bogo";

      const renderer = new Renderer(labels, root);
      expect(renderer.render()).toBe(EXPECT_1);
    });

    it("#2 should return label & flow strings with nest composition", () => {
      const rootFlow = new Flow();
      rootFlow.start("state_1").transit("state_1", "state_2").end("state_2");
      const childFlow1 = new Flow();
      childFlow1.start("state_1_1_1").transit("state_1_1_1", "state_1_1_2");
      const childFlow2 = new Flow();
      childFlow2.start("state_1_2_1");
      const child = new Composition("state_1");
      child.addFlow(childFlow1);
      child.addFlow(childFlow2);

      root.addFlow(rootFlow);
      root.addComposition(child);
      labels["state_1"] = "hoge";
      labels["state_1_1_1"] = "hogehoge";
      labels["state_1_1_2"] = "hogehogehoge";
      labels["state_1_2_1"] = "hogefuga";
      labels["state_2"] = "fuga";

      const renderer = new Renderer(labels, root);
      expect(renderer.render()).toBe(EXPECT_2);
    });
  });
});

run();
