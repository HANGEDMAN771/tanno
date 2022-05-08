import { expandGlobSync } from "https://deno.land/std@0.138.0/fs/expand_glob.ts";
import {
  dirname,
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.138.0/path/mod.ts";
import { StateMachineParser } from "../../lib/parser/statemachine_parser.ts";
import { StateMachineLoader } from "../../lib/statemachine/loader.ts";
import { Renderer } from "../../lib/renderer/renderer.ts";

const parser = new StateMachineParser();
const loader = new StateMachineLoader();
const sampleData = resolve(
  dirname(fromFileUrl(import.meta.url)),
  "../../../examples/aws-stepfunctions-examples/sam/",
);
const examples = resolve(
  dirname(fromFileUrl(import.meta.url)),
  "../../../examples/mermaid/",
);

for (
  const entry of expandGlobSync(
    `${sampleData}/**/*.asl.{json,yaml}`,
  )
) {
  const data = loader.load(Deno.readTextFileSync(entry.path));
  const { labels, composition } = parser.parse(data);
  const renderer = new Renderer(labels, composition);
  const filePath = resolve(
    examples,
    entry.path.replace(sampleData, "").substring(1).replaceAll(/asl.*$/g, "md"),
  );
  const dir = dirname(filePath);
  Deno.mkdirSync(dir, { recursive: true });
  Deno.writeTextFile(filePath, renderer.render());
}
