import { Choice, Map, Parallel, State, Task } from "../statemachine/type.ts";

export interface Parser {
  parse(state: State): {
    next: string[];
    end: boolean;
  };
}

abstract class BasicParser implements Parser {
  parse(state: State) {
    if (state.End) {
      return {
        next: [],
        end: true,
      };
    } else if (state.Next) {
      return {
        next: [state.Next],
        end: false,
      };
    } else {
      throw new Error(
        `${state.Type} is invalid. This State must have Next or End(:true) field`,
      );
    }
  }
}
abstract class CachableParser implements Parser {
  parse(state: Task | Parallel | Map) {
    const nextAndEnd: { next: string[]; end: boolean } = {
      next: [],
      end: false,
    };
    if (state.End) {
      nextAndEnd.next = [];
      nextAndEnd.end = true;
    } else if (state.Next) {
      nextAndEnd.next.push(state.Next);
      nextAndEnd.end = false;
    } else {
      throw new Error(
        `${state.Type} is invalid. This State must have Next or End(:true) field`,
      );
    }

    if (state.Catch) {
      state.Catch.map((c) => {
        nextAndEnd.next.push(c.Next);
      });
    }
    nextAndEnd.next = [...new Set(nextAndEnd.next)];
    return nextAndEnd;
  }
}
abstract class TerminalParser implements Parser {
  parse(_: State) {
    return {
      next: [],
      end: true,
    };
  }
}

export class PassParser extends BasicParser {
  parse(state: State) {
    return super.parse(state);
  }
}
export class TaskParser extends CachableParser {
  parse(state: State) {
    return super.parse(state as Task);
  }
}
export class ChoiceParser implements Parser {
  parse(state: State) {
    const choice = state as Choice;
    if (choice.Choices.length == 0 || choice.Choices.some((c) => !c.Next)) {
      throw new Error(
        "Choice State must have non-empty Choices array, and they must have Next field",
      );
    }
    const nextDefault: string[] = [];
    if (choice.Default) {
      nextDefault.push(choice.Default);
    }
    const next = choice.Choices.map((c) => c.Next).concat(nextDefault);
    return {
      next: [...new Set(next)], // for unique
      end: false,
    };
  }
}
export class WaitParser extends BasicParser {
  parse(state: State) {
    return super.parse(state);
  }
}
export class SucceedParser extends TerminalParser {
  parse(state: State) {
    return super.parse(state);
  }
}
export class FailParser extends TerminalParser {
  parse(state: State) {
    return super.parse(state);
  }
}
export class ParallelParser extends CachableParser {
  parse(state: State) {
    return super.parse(state as Parallel);
  }
}
export class MapParser extends CachableParser {
  parse(state: State) {
    return super.parse(state as Map);
  }
}
