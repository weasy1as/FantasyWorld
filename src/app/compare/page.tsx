"use client";
import PlayerCard from "@/components/PLayerCard";
import PlayerSearch from "@/components/playerSearch";
import React, { useEffect, useState } from "react";
import { Player, PlayerStat } from "../../../types/type";

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
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [playerHistory1, setPlayerHistory1] = useState<PlayerStat[]>([]);
  const [playerHistory2, setPlayerHistory2] = useState<PlayerStat[]>([]);
  const [aiData, setAiData] = useState<{
    recommendation: string;
    reasoning: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
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
      setPlayerHistory1(data1);
      setPlayerHistory2(data2);
      setAiData(null); // reset AI data when players change
    };
    fetchStats();
  }, [player1, player2]);

  const handleAiInsights = async (player1: Player, player2: Player) => {
    if (!stats1 || playerHistory1.length === 0) return;

    // Prepare last 5 games
    const last5Games1 = playerHistory1.slice(-5); // last 5 fixtures
    const last5Games2 = playerHistory2.slice(-5); // last 5 fixtures

    // Build payload with aggregated stats, advanced metrics, and recent form
    const payload = {
      player1,
      player2,
      stats1: {
        ...stats1,
        expectedGoals: last5Games1.reduce(
          (sum, g) => sum + (g.expected_goals || 0),
          0
        ),
        expectedAssists: last5Games1.reduce(
          (sum, g) => sum + (g.expected_assists || 0),
          0
        ),
        influence: last5Games1.reduce((sum, g) => sum + (g.influence || 0), 0),
        creativity: last5Games1.reduce(
          (sum, g) => sum + (g.creativity || 0),
          0
        ),
        threat: last5Games1.reduce((sum, g) => sum + (g.threat || 0), 0),
      },
      stats2: {
        ...stats2,
        expectedGoals: last5Games2.reduce(
          (sum, g) => sum + (g.expected_goals || 0),
          0
        ),
        expectedAssists: last5Games2.reduce(
          (sum, g) => sum + (g.expected_assists || 0),
          0
        ),
        influence: last5Games2.reduce((sum, g) => sum + (g.influence || 0), 0),
        creativity: last5Games2.reduce(
          (sum, g) => sum + (g.creativity || 0),
          0
        ),
        threat: last5Games2.reduce((sum, g) => sum + (g.threat || 0), 0),
      },
      history1: last5Games1, // include raw stats for recent form
      history2: last5Games2, // include raw stats for recent form
    };

    try {
      const res = await fetch("/api/ai-Insight/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setLoading(true);
      console.log("Payload sent to /api/ai-Insight:", payload);

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
        <PlayerCard
          player={player1}
          stats={stats1}
          showStats={true}
          comparePage={true}
        />
        <PlayerCard
          player={player2}
          stats={stats2}
          showStats={true}
          comparePage={true}
        />
      </div>

      {/* AI Insights Button */}
      {player1 && player2 && (
        <>
          {!aiData ? (
            <button
              onClick={() => handleAiInsights(player1, player2)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer text-white px-8 py-4 rounded-3xl shadow-xl hover:scale-105 transition-transform font-semibold text-lg"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Compare Players with AI Insights"}
            </button>
          ) : (
            <div className="text-left bg-white rounded-xl p-6 shadow-md space-y-4 max-w-xl w-full">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                AI Insights
              </h3>

              <span
                className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                  aiData.recommendation.includes("Buy") ||
                  aiData.recommendation.includes("Hold")
                    ? "bg-green-100 text-green-700"
                    : aiData.recommendation.includes("Avoid") ||
                      aiData.recommendation.includes("Sell")
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {aiData.recommendation}
              </span>

              <p className="text-gray-700">{aiData.reasoning}</p>
            </div>
          )}
        </>
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
