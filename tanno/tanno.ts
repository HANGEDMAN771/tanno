import { StateMachineParser } from "./lib/parser/statemachine_parser.ts";
import { StateMachineLoader } from "./lib/statemachine/loader.ts";
import { Renderer } from "./lib/renderer/renderer.ts";
import { isAbsolute, resolve } from "https://deno.land/std@0.138.0/path/mod.ts";

const parser = new StateMachineParser();
const loader = new StateMachineLoader();

Deno.args.map((path) => {
  let filePath;
  if (isAbsolute(path)) {
    filePath = path;
  } else {
    filePath = resolve(Deno.cwd(), path);
  }
  const data = loader.load(Deno.readTextFileSync(filePath));
  const { labels, composition } = parser.parse(data);
  const renderer = new Renderer(labels, composition);
  console.log(renderer.render());
});
