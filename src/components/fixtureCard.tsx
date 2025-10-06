import React from "react";
import { Fixture, PlayerHistory } from "../../types/type";
import Image from "next/image";

const FixtureCard = ({
  fixture,
  playerHistory,
  recent = false,
}: {
  fixture: Fixture;
  playerHistory: PlayerHistory[];
  recent?: boolean;
}) => {
  const stats = playerHistory?.find(
    (h: PlayerHistory) => h.fixture.id === fixture.id
  );
  return (
    <div
      className={`bg-white ${
        recent ? "ring-2 ring-blue-500" : ""
      } rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center`}
    >
      <h2 className="text-lg font-bold mb-2">Gameweek {fixture.gameweek}</h2>

      <div className="flex items-center justify-between w-full mb-4">
        {/* Home Team */}
        <div className="flex flex-col items-center">
          <Image
            src={fixture.home_team?.logo_url}
            alt={fixture.home_team?.short_name}
            className="w-12 h-12 mb-2"
            width={48}
            height={48}
          />
          <span className="font-semibold">{fixture.home_team?.short_name}</span>
        </div>

        {/* Score */}
        <div className="text-xl font-bold">
          {fixture.finished
            ? `${fixture.team_h_score} - ${fixture.team_a_score}`
            : "vs"}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center">
          <Image
            src={fixture.away_team?.logo_url}
            alt={fixture.away_team?.short_name}
            className="w-12 h-12 mb-2"
            width={48}
            height={48}
          />
          <span className="font-semibold">{fixture.away_team?.short_name}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {new Date(fixture.kickoff_time).toLocaleString()}
      </p>
      {/* Player stats for this fixture */}
      {stats && (
        <div className="flex justify-around w-full text-sm text-gray-700 border-t pt-2 mt-2">
          <div>
            <p className="font-semibold">{stats.goals_scored}</p>
            <p className="text-gray-500">Goals</p>
          </div>
          <div>
            <p className="font-semibold">{stats.assists}</p>
            <p className="text-gray-500">Assists</p>
          </div>
          <div>
            <p className="font-semibold">{stats.clean_sheets}</p>
            <p className="text-gray-500">Clean Sheets</p>
          </div>
          <div>
            <p className="font-semibold">{stats.minutes}</p>
            <p className="text-gray-500">Minutes</p>
          </div>
          <div>
            <p className="font-semibold">{stats.total_points}</p>
            <p className="text-gray-500">FPL Points</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixtureCard;
