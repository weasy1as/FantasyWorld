"use client";
import React from "react";
import { Fixture } from "../../../types/type";
import Image from "next/image";

type GroupedFixtures = {
  gameweek: number;
  fixtures: Fixture[];
};

const FixturesPage = () => {
  const [groupedFixtures, setGroupedFixtures] = React.useState<
    GroupedFixtures[]
  >([]);
  const [pageIndex, setPageIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchFixtures = async () => {
      const response = await fetch("/api/fixtures");
      const data: Fixture[] = await response.json();

      // Group by gameweek
      const grouped = data.reduce((acc: Record<number, Fixture[]>, fixture) => {
        if (!acc[fixture.gameweek]) acc[fixture.gameweek] = [];
        acc[fixture.gameweek].push(fixture);
        return acc;
      }, {});

      // Turn into sorted array
      const groupedArray = Object.entries(grouped)
        .map(([gameweek, fixtures]) => ({
          gameweek: Number(gameweek),
          fixtures,
        }))
        .sort((a, b) => a.gameweek - b.gameweek);

      setGroupedFixtures(groupedArray);

      const now = new Date();
      let currentIndex = groupedArray.findIndex((g) =>
        g.fixtures.some((f) => new Date(f.kickoff_time) >= now)
      );

      if (currentIndex === -1) currentIndex = groupedArray.length - 1;
      setPageIndex(currentIndex);
    };

    fetchFixtures();
  }, []);

  const currentGroup = groupedFixtures[pageIndex];

  const handlePrev = () => {
    setPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setPageIndex((prev) => Math.min(groupedFixtures.length - 1, prev + 1));
  };

  return (
    <div className="p-8 flex flex-col justify-center w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Fixtures</h1>

      {currentGroup && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-center">
            Gameweek {currentGroup.gameweek}
          </h2>
          <ul className="mb-8 w-full grid md:grid-cols-2 grid-cols-1 gap-2">
            {currentGroup.fixtures.map((fixture) => {
              const kickoff = new Date(fixture.kickoff_time);
              const now = new Date();
              const isLive = !fixture.finished && kickoff <= now;

              return (
                <div
                  key={fixture.id}
                  className="flex mb-4 rounded-xl justify-center h-20 border-black border-2 shadow-md hover:shadow-xl transition-shadow"
                >
                  <li className="flex justify-between items-center gap-3 p-4 border-b border-gray-200 text-center">
                    <div>
                      {fixture.finished ? (
                        <p className="hidden md:block text-sm font-medium text-gray-600">
                          FT
                        </p>
                      ) : isLive ? (
                        <p className="hidden md:block text-sm font-bold text-red-600">
                          LIVE
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{fixture.home_team.short_name}</span>
                      <Image
                        className="w-8 h-8"
                        src={fixture.home_team.logo_url}
                        alt={fixture.home_team.short_name}
                        width={32}
                        height={32}
                      />
                      <div>
                        <span className="font-semibold text-sm">
                          {fixture.finished
                            ? `${fixture.team_h_score} - ${fixture.team_a_score}`
                            : "vs"}
                        </span>
                        <div className="md:hidden">
                          {fixture.finished ? (
                            <p className="text-sm font-medium text-gray-600">
                              FT
                            </p>
                          ) : isLive ? (
                            <p className="text-sm font-bold text-red-600">
                              LIVE
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <Image
                        className="w-8 h-8"
                        src={fixture.away_team.logo_url}
                        alt={fixture.away_team.short_name}
                        width={32}
                        height={32}
                      />
                      <span>{fixture.away_team.short_name}</span>
                    </div>
                    <div className="hidden md:block text-sm text-gray-500">
                      {kickoff.toLocaleString()}
                    </div>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={pageIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={pageIndex === groupedFixtures.length - 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FixturesPage;
