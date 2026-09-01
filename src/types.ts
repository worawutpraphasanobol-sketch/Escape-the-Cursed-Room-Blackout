export interface ClueItem {
  id: 'scroll' | 'portrait' | 'blood';
  name: string;
  emoji: string;
  title: string;
  digitIndex: 1 | 2 | 3;
  digitValue: number;
  equation: string;
  equationDisplay: string;
  story: string;
  hintText: string;
  x: number; // percentage (10% to 85%)
  y: number; // percentage (15% to 75%)
  found: boolean;
}

export type GameState = 'intro' | 'playing' | 'game_over' | 'escaped';

export type GameOverReason = 'time_up' | 'battery_empty' | 'wrong_code';

export interface GameSettings {
  soundEnabled: boolean;
}
