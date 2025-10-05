"use client";
import PlayerCard from "@/components/PLayerCard";
import PlayerSearch from "@/components/playerSearch";
import React, { useEffect, useState } from "react";

type PlayerStat = {
  id: number;
  player_id: number;
  fixture_id: number;
  total_points: number;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  yellow_cards: number;
  red_cards: number;
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

function getAggregatedStats(stats: PlayerStat[]): AggregatedStats {
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

const Compare = () => {
  const [player1, setPlayer1] = useState<any>(null);
  const [player2, setPlayer2] = useState<any>(null);
  const [stats1, setStats1] = useState<AggregatedStats | null>(null);
  const [stats2, setStats2] = useState<AggregatedStats | null>(null);

  useEffect(() => {
    if (!player1 || !player2) return;
    const fetchStats = async () => {
      const [res1, res2] = await Promise.all([
        fetch(`/api/playerHistory/${player1.id}`),
        fetch(`/api/playerHistory/${player2.id}`),
      ]);
      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
      setStats1(getAggregatedStats(data1));
      setStats2(getAggregatedStats(data2));
    };
    fetchStats();
  }, [player1, player2]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 px-4 py-12">
      {/* Hero / Introduction Section */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Compare Football Players
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          Quickly analyze and compare the performance of two football players.
          View their stats, strengths, and contributions in recent matches, and
          get AI-powered insights to help you make better decisions.
        </p>
        <p className="text-gray-500 mt-2">
          Use the search boxes below to select two players and see a detailed
          comparison.
        </p>
      </div>

      {/* Player Search Section */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mb-10">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Player 1</h2>
          <PlayerSearch label="Search for Player 1..." onSelect={setPlayer1} />
        </div>

        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Player 2</h2>
          <PlayerSearch label="Search for Player 2..." onSelect={setPlayer2} />
        </div>
      </div>

      {/* Player Comparison Cards */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mb-8">
        <PlayerCard player={player1} stats={stats1} showStats={true} />
        <PlayerCard player={player2} stats={stats2} showStats={true} />
      </div>

      {/* AI Insights Button */}
      {player1 && player2 && (
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-3xl shadow-xl hover:scale-105 transition-transform font-semibold text-lg">
          Compare Players with AI Insights
        </button>
      )}

      {/* Optional Footer / Explanation */}
      <div className="max-w-3xl text-center text-gray-600 mt-12">
        <p>
          This page allows you to compare two players in terms of appearances,
          goals, assists, clean sheets, and other key performance metrics. Use
          this comparison to evaluate player performance over the season or
          upcoming fixtures.
        </p>
      </div>
    </div>
  );
};

export default Compare;
