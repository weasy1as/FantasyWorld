"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Team = {
  id: number;
  name: string;
  short_name: string;
  logo_url: string;
};

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    data.sort((a: Team, b: Team) => a.name.localeCompare(b.name));
    setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Premier League Teams
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => (window.location.href = `/teams/${team.id}`)}
            className="group cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl p-6 flex flex-col items-center transition-transform transform hover:scale-105"
          >
            <Image
              src={team.logo_url}
              alt={team.name}
              className="w-20 h-20 object-contain mb-4 transition-transform group-hover:scale-110"
              width={80}
              height={80}
            />
            <h2 className="text-lg font-semibold text-center">{team.name}</h2>
            <p className="text-sm text-gray-500">{team.short_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
