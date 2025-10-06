"use client";
import FixtureCard from "@/components/fixtureCard";
import PlayerCard from "@/components/PLayerCard";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  AggregatedStats,
  Fixture,
  Player,
  PlayerHistory,
  PlayerStat,
} from "../../../../types/type";

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
type aiDataType = {
  recommendation: string;
  reasoning: string;
};

export default function Page() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [playerHistory, setPlayerHistory] = useState<PlayerHistory[]>([]);
  const [aiData, setAiData] = useState<aiDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const playerId = params.playerId;

  useEffect(() => {
    const fetchPlayer = async () => {
      const res = await fetch(`/api/players/${playerId}`);
      const data = await res.json();
      setPlayer(data);
      console.log(data);
    };
    fetchPlayer();
  }, [playerId]);

  useEffect(() => {
    const fetchStatsAndFixtures = async () => {
      const res = await fetch(`/api/playerHistory/${playerId}`);
      const data = await res.json();

      // aggregate stats
      setStats(getAggregatedStats(data));
      setPlayerHistory(data);

      // extract fixtures from history
      const extractedFixtures: Fixture[] = data
        .map((h: PlayerHistory) => h.fixture)
        .filter((f: Fixture | null) => f != null);
      setFixtures(extractedFixtures);
    };

    fetchStatsAndFixtures();
  }, [playerId]);
  const handleAiInsights = async (player: Player) => {
    if (!stats || playerHistory.length === 0) return;

    // Prepare last 5 games
    const last5Games = playerHistory.slice(-5); // last 5 fixtures

    // Build payload with aggregated stats, advanced metrics, and recent form
    const payload = {
      player,
      stats: {
        ...stats,
        expectedGoals: last5Games.reduce(
          (sum, g) => sum + (g.expected_goals || 0),
          0
        ),
        expectedAssists: last5Games.reduce(
          (sum, g) => sum + (g.expected_assists || 0),
          0
        ),
        influence: last5Games.reduce((sum, g) => sum + (g.influence || 0), 0),
        creativity: last5Games.reduce((sum, g) => sum + (g.creativity || 0), 0),
        threat: last5Games.reduce((sum, g) => sum + (g.threat || 0), 0),
      },
      history: last5Games, // include raw stats for recent form
    };

    try {
      const res = await fetch("/api/ai-Insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setLoading(true);

      const data = await res.json();
      console.log("AI Insights:", payload);
      console.log(data);
      let insightObj;
      if (data.cached) {
        try {
          insightObj = JSON.parse(data.insight);
        } catch (err) {
          console.error("Failed to parse cached insight:", err);
          insightObj = { recommendation: "Unknown", reasoning: data.insight };
        }
      } else {
        insightObj = data.insight; // GPT response is already an object
      }
      setAiData(insightObj);
    } catch (error) {
      console.error("Error fetching AI Insights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8">
      {/* Player card on the left */}
      <div className="md:flex-1 md:w-1/3 w-full">
        <PlayerCard
          player={player}
          stats={stats}
          showStats={true}
          onInsightsClick={handleAiInsights}
          aiData={aiData}
          loading={loading}
        />
      </div>

      {/* Fixtures on the right */}
      <div className="md:flex-1">
        <div>
          {fixtures.length > 0 && (
            <div className="mb-8">
              <h1 className="text-xl font-bold mb-4">Recent Game</h1>
              <FixtureCard
                fixture={fixtures[0]}
                playerHistory={playerHistory}
                recent={true}
              />
            </div>
          )}
        </div>
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute px-4 bg-white text-gray-500 text-sm">
            Previous Games
          </span>
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
}
