"use client";
import React from "react";

type Fixture = {
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
};

type GroupedFixtures = {
  gameweek: number;
  fixtures: Fixture[];
};

const page = () => {
  const [Fixtures, setFixtures] = React.useState<GroupedFixtures[]>([]);

  React.useEffect(() => {
    const fetchFixtures = async () => {
      const response = await fetch("/api/fixtures");
      const data = await response.json();
      setFixtures(data);
    };
    fetchFixtures();
  }, []);

  return (
    <div className="p-8 flex flex-col justify-center w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Fixtures</h1>
      {Object.entries(Fixtures).map(([gameweek, fixtures]) => (
        <div key={gameweek}>
          <h2 className="text-xl font-semibold mb-2">Gameweek {gameweek}</h2>
          <ul className="mb-8">
            {fixtures.map((fixture) => (
              <li
                className="flex justify-between items-center gap-3 p-4 border-b border-gray-200 text-center"
                key={fixture.id}
              >
                <div>{fixture.finished ? <p>FT</p> : ""}</div>
                <div className="flex items-center gap-2">
                  {" "}
                  {fixture.home_team.short_name}{" "}
                  <img
                    className="w-8 h-8"
                    src={fixture.home_team.logo_url}
                    alt=""
                  />{" "}
                  {fixture.finished
                    ? `${fixture.team_h_score} - ${fixture.team_a_score}`
                    : "vs"}{" "}
                  {fixture.away_team.short_name}{" "}
                  <img
                    className="w-8 h-8"
                    src={fixture.away_team.logo_url}
                    alt=""
                  />{" "}
                </div>
                <div>{new Date(fixture.kickoff_time).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default page;
