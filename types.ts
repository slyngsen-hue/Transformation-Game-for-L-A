export enum NodeState {
  CHAOS = 0,      // Red/Dark - Inefficient
  STAGNATION = 1, // Grey - Bureaucratic
  OPTIMIZED = 2   // Blue/Gold - Transformed
}

export interface GridCell {
  row: number;
  col: number;
  state: NodeState;
}

export type Grid = GridCell[][];

export interface ScenarioData {
  title: string;
  description: string;
  stakes: string;
}

export interface AnalysisData {
  feedback: string;
  score: number;
  consultantNote: string;
}

export enum AppStage {
  HERO,
  SCENARIO_LOADING,
  GAME_INTRO,
  PLAYING,
  ANALYZING,
  RESULTS
}
