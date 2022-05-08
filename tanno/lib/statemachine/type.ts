// deno-lint-ignore-file

export interface StateMachine {
  StartAt: string;
  States: { [name: string]: State };
  Comment?: string;
  TimeoutSeconds?: number;
  Version?: string;
}

export type StateType =
  | "Pass"
  | "Task"
  | "Choice"
  | "Wait"
  | "Succeed"
  | "Fail"
  | "Parallel"
  | "Map";
export type ErrorStates =
  | "States.ALL"
  | "States.DataLimitExceeded"
  | "States.Runtime"
  | "States.HeartbeatTimeout"
  | "States.Timeout"
  | "States.TaskFailed"
  | "States.Permissions";

export interface Retry {
  ErrorEquals: ErrorStates[] | string[];
  IntervalSeconds?: number;
  MaxAttempts?: number;
  BackoffRate?: number;
}

export interface Catch {
  ErrorEquals: ErrorStates[] | string[];
  Next: string;
  ResultPath?: string;
}

export interface ChoiceRule {
  Next: string;
  Variable?: string;
  And?: ChoiceRule[];
  BooleanEquals?: boolean;
  BooleanEqualsPath?: string;
  IsBoolean?: boolean;
  IsNull?: boolean;
  IsNumeric?: boolean;
  IsPresent?: boolean;
  IsString?: boolean;
  IsTimestamp?: boolean;
  Not?: ChoiceRule[];
  NumericEquals?: number;
  NumericEqualsPath?: string;
  NumericGreaterThan?: number;
  NumericGreaterThanPath?: string;
  NumericGreaterThanEquals?: number;
  NumericGreaterThanEqualsPath?: string;
  NumericLessThan?: number;
  NumericLessThanPath?: string;
  NumericLessThanEquals?: number;
  NumericLessThanEqualsPath?: string;
  Or?: ChoiceRule[];
  StringEquals?: string;
  StringEqualsPath?: string;
  StringGreaterThan?: string;
  StringGreaterThanPath?: string;
  StringGreaterThanEquals?: string;
  StringGreaterThanEqualsPath?: string;
  StringLessThan?: string;
  StringLessThanPath?: string;
  StringLessThanEquals?: string;
  StringLessThanEqualsPath?: string;
  StringMatches?: string;
  TimestampEquals?: string;
  TimestampEqualsPath?: string;
  TimestampGreaterThan?: string;
  TimestampGreaterThanPath?: string;
  TimestampGreaterThanEquals?: string;
  TimestampGreaterThanEqualsPath?: string;
  TimestampLessThan?: string;
  TimestampLessThanPath?: string;
  TimestampLessThanEquals?: string;
  TimestampLessThanEqualsPath?: string;
}

export interface State {
  Type: StateType;
  Next?: string;
  End?: boolean;
  Comment?: string;
  InputPath?: string;
  OutputPath?: string;
}

export interface Pass extends State {
  Result?: object;
  ResultPath?: string;
  Parameters?: object;
}
export interface Task extends State {
  Resource: string;
  Parameters?: object;
  ResultPath?: string;
  ResultSelector?: object;
  Retry?: Retry[];
  Catch?: Catch[];
  TimeoutSeconds?: number;
  TimeoutSecondsPath?: string;
  HeartbeatSeconds?: number;
  HeartbeatSecondsPath?: string;
}
export interface Choice extends State {
  Choices: ChoiceRule[];
  Default?: string;
}
export interface Wait extends State {
  Seconds?: number;
  Timestamp?: string;
  SecondsPath?: string;
  TimestampPath?: string;
}
export interface Succeed extends State {
}
export interface Fail extends State {
  Cause?: string;
  Error?: string;
}
export interface Parallel extends State {
  Branches: StateMachine[];
  ResultPath?: string;
  ResultSelector?: object;
  Retry?: Retry[];
  Catch?: Catch[];
}
export interface Map extends State {
  Iterator: StateMachine;
  ItemsPath?: string;
  MaxConcurrency?: number;
  ResultPath?: string;
  ResultSelector?: object;
  Retry?: Retry[];
  Catch?: Catch[];
}
