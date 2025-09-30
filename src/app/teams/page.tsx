"use client";
import React, { useEffect, useState } from "react";

type Team = {
  id: number;
  name: string;
  short_name: string;
  logo_url: string;
};

const page = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(data);
  };
  useEffect(() => {
    fetchTeams();
  }, []);
  return (
    <div className="p-8 flex gap-3 flex-wrap items-center">
      {teams.map((team, index) => (
        <div
          className="border rounded-xl p-4 mb-4 flex flex-col items-center gap-3 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 cursor-pointer hover:shadow-lg transition-shadow"
          key={index}
          onClick={() => (window.location.href = `/teams/${team.id}`)}
        >
          <h2>{team.name}</h2>
          <p>{team?.short_name}</p>
          <img
            sizes="(max-width: 600px) 100vw, 50vw"
            className="w-32 h-32 object-contain"
            src={team?.logo_url}
            alt=""
          />
        </div>
      ))}
    </div>
  );
};

export default page;
