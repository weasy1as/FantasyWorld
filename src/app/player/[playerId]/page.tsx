"use client";
import FixtureCard from "@/components/fixtureCard";
import PlayerCard from "@/components/PLayerCard";
import { get } from "http";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Team = {
  id: number;
  short_name: string;
  logo_url: string;
  name: string;
};

type Player = {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  position: number;
  photo_url: string;
  team: Team;
};

type Fixture = {
  id: number;
  kickoff_time: string;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  finished: boolean;
  home_team: Team;
  away_team: Team;
};

type PlayerStat = {
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

type AggregatedStats = {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  totalPoints: number;
  minutes: number;
};
function getAggregatedStats(stats: PlayerStat[]) {
  return stats.reduce(
    (acc, s) => {
      acc.appearances += s.minutes > 0 ? 1 : 0;
      acc.goals += s.goals_scored;
      acc.assists += s.assists;
      acc.cleanSheets += s.clean_sheets;
      acc.yellowCards += s.yellow_cards;
      acc.redCards += s.red_cards;
      acc.totalPoints += s.total_points;
      acc.minutes += s.minutes;
      return acc;
    },
    {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      totalPoints: 0,
      minutes: 0,
    }
  );
}

const page = () => {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [playerHistory, setPlayerHistory] = useState<PlayerStat[]>([]);
  const params = useParams();
  const playerId = params.playerId;

  const fetchPlayer = async () => {
    const res = await fetch(`/api/players/${playerId}`);
    const data = await res.json();
    setPlayer(data);
    console.log(data);
  };

  const fetchStatsAndFixtures = async () => {
    const res = await fetch(`/api/playerHistory/${playerId}`);
    const data = await res.json();

    // aggregate stats
    setStats(getAggregatedStats(data));
    setPlayerHistory(data);

    // extract fixtures from history
    const extractedFixtures = data
      .map((h: any) => h.fixture)
      .filter((f: any) => f != null);
    setFixtures(extractedFixtures);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchPlayer();
    };
    loadData();
  }, [playerId]);

  useEffect(() => {
    const fetchStatsAndFixturesData = async () => {
      await fetchStatsAndFixtures(); // this function should use player.team.id
    };
    fetchStatsAndFixturesData();
  }, [playerId]);

  return (
    <div className="flex gap-6 p-8">
      {/* Player card on the left */}
      <div className="flex-1 w-1/3">
        <PlayerCard player={player} stats={stats} />
      </div>

      {/* Fixtures on the right */}
      <div className="flex-1">
        <div>
          {fixtures.length > 0 && (
            <div className="mb-8">
              <h1 className="text-xl font-bold mb-4">Recent Game</h1>
              <FixtureCard
                fixture={fixtures[0]}
                playerHistory={playerHistory}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6 overflow-y-scroll pb-4 h-[80vh]">
          {fixtures.slice(1).map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              playerHistory={playerHistory}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
