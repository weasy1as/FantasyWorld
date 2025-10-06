export type Player = {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  position: number;
  photo_url: string;
  team: Team;
};
export type Team = {
  id: number;
  short_name: string;
  logo_url: string;
  name: string;
};
export type AggregatedStats = {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  totalPoints: number;
  minutes: number;
};

export type Fixture = {
  id: number;
  gameweek: number;
  kickoff_time: string;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  team_h_difficulty: number;
  team_a_difficulty: number;
  finished: boolean;
  home_team: Team;
  away_team: Team;
};

export type PlayerStat = {
  id: number;
  player_id: number;
  fixture_id: number;
  total_points: number;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number | null;
  yellow_cards: number;
  red_cards: number;
  influence: number;
  creativity: number;
  threat: number;
  ict_index: number;
  expected_goals: number;
  expected_assists: number;
  expected_goal_involvements: number;
  expected_goals_conceded: number;
  created_at: string;
};
