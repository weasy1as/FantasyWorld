"use client";
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

const page = () => {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const params = useParams();
  const playerId = params.playerId;

  const fetchPlayer = async () => {
    const res = await fetch(`/api/players/${playerId}`);
    const data = await res.json();
    setPlayer(data);
    console.log(data);
  };
  // Fetch fixtures filtered by player's team
  const fetchFixtures = async (teamId: number) => {
    const res = await fetch(`/api/fixtures?team_id=${teamId}`);
    const data = await res.json();
    const fixturesArray: Fixture[] = Object.values(data).flat();
    setFixtures(fixturesArray);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchPlayer();
    };
    loadData();
  }, [playerId]);

  // Once player is loaded, fetch fixtures
  useEffect(() => {
    if (player?.team.id) {
      fetchFixtures(player.team.id);
    }
  }, [player, player?.team.id]);

  const lastMatch = fixtures
    .filter((f) => f.finished)
    .sort(
      (a, b) =>
        new Date(b.kickoff_time).getTime() - new Date(a.kickoff_time).getTime()
    )[0];

  const upcomingMatches = fixtures
    .filter((f) => !f.finished)
    .sort(
      (a, b) =>
        new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime()
    );

  return (
    <div className="p-8 flex flex-col  w-full">
      <div className="mb-8 flex gap-8">
        {" "}
        <div className="bg-blue-300 p-4 w-[800px] rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition cursor-pointer">
          <img
            src={player?.photo_url}
            alt={player?.web_name}
            className="w-62 h-62 object-contain"
          />
          <div className="flex flex-col ">
            <span className="text-black text-xl">{player?.first_name}</span>
            <span className="text-black text-4xl font-bold">
              {player?.second_name}
            </span>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 object-contain"
                  src={player?.team.logo_url}
                  alt={player?.team.short_name}
                />
                <span className="text-black text-md">
                  {player?.team.short_name}
                </span>
              </div>
              <span className="text-black text-md">
                {player?.position === 1
                  ? "Goalkeeper"
                  : player?.position === 2
                  ? "Defender"
                  : player?.position === 3
                  ? "Midfielder"
                  : "Forward"}
              </span>
            </div>
          </div>
        </div>
        {/* Fixtures */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          {/* Last Match */}
          <div className="flex flex-col justify-center bg-white shadow-md p-4 rounded-lg w-full">
            <h2 className="font-bold text-lg mb-2">Last Match</h2>
            {lastMatch ? (
              <div className="flex items-center ">
                <div className="flex items-center gap-2 ">
                  {/* Home Team */}
                  <div className="flex items-center gap-2">
                    <img
                      src={lastMatch.home_team.logo_url}
                      className="w-6 h-6"
                      alt={lastMatch.home_team.short_name}
                    />
                    <span className="font-medium">
                      {lastMatch.home_team.short_name}
                    </span>
                  </div>

                  {/* Score & Kickoff Time */}
                  <div className="flex flex-col items-center">
                    <span className="font-bold">
                      {lastMatch.team_h_score} - {lastMatch.team_a_score}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(lastMatch.kickoff_time).toLocaleString()}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {lastMatch.away_team.short_name}
                    </span>
                    <img
                      src={lastMatch.away_team.logo_url}
                      className="w-6 h-6"
                      alt={lastMatch.away_team.short_name}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No finished matches yet</p>
            )}
          </div>

          {/* Upcoming Fixtures */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="font-bold text-lg mb-2">Upcoming Matches</h2>

            <div className="max-h-64 overflow-y-auto">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <img src={f.home_team.logo_url} className="w-6 h-6" />
                      <span>{f.home_team.short_name}</span>
                    </div>
                    <span>vs</span>
                    <div className="flex items-center gap-2">
                      <span>{f.away_team.short_name}</span>
                      <img src={f.away_team.logo_url} className="w-6 h-6" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming matches</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
