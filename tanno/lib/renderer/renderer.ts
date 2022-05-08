import { Composition } from "./composition.ts";

export class Renderer {
  private INDENT = 2;
  private _label: { [id: string]: string };
  private _composition: Composition;

  constructor(labels: { [id: string]: string }, composition: Composition) {
    this._label = labels;
    this._composition = composition;
  }

  render() {
    return `
\`\`\`mermaid
stateDiagram-v2
${this.renderLabel()}

${this.renderComposition(this._composition)}
\`\`\`
`;
  }

  renderLabel() {
    const labelArray: string[] = [];
    for (const [id, label] of Object.entries(this._label)) {
      labelArray.push(`${id}: ${label}`);
    }
    return "  " + labelArray.join("\n  ");
  }

  renderComposition(c: Composition) {
    return [
      this.renderState(c),
      this.renderFlow(c),
    ].filter((s) => !!s).join("\n");
  }

  renderState(c: Composition) {
    return c.children.map((child) => {
      child.depth = c.depth + child.depth;
      let returnStrings = `${this.calcIndent(c.depth)}state ${child.name} {\n`;
      returnStrings += [
        this.renderState(child),
        this.renderFlow(child),
      ].filter((s) => !!s).join("\n");
      returnStrings += `\n${this.calcIndent(c.depth)}}`;
      return returnStrings;
    }).join("\n");
  }

  renderFlow(c: Composition) {
    return c.flows.map((f) =>
      f.transition.map((t) => {
        const { start, end } = t.get();
        return `${this.calcIndent(c.depth)}${start} --> ${end}`;
      }).join("\n")
    ).join(`\n${this.calcIndent(c.depth)}--\n`);
  }

  calcIndent(depth: number) {
    return " ".repeat(this.INDENT * depth);
  }
}
