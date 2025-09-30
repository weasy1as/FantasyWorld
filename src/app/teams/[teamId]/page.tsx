"use client";
import PlayerCard from "@/components/PLayerCard";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TeamPage = () => {
  const params = useParams();
  const teamId = params.teamId;

  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);

  const fetchTeam = async (id: string) => {
    const res = await fetch(`/api/teams?teamId=${id}`);
    const data = await res.json();
    setTeam(data[0]);
  };

  const fetchPlayers = async (id: string) => {
    const res = await fetch(`/api/players?teamId=${id}`);
    const data = await res.json();
    setPlayers(data);
  };

  useEffect(() => {
    if (teamId) {
      fetchTeam(teamId);
      fetchPlayers(teamId);
    }
  }, [teamId]);

  return (
    <div className="p-8">
      {team && (
        <div className="mb-8">
          {/* Team Header */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={team.logo_url}
              alt={team.name}
              className="w-24 h-24 rounded-full border p-2 bg-white shadow"
            />
            <div>
              <h1 className="text-3xl font-bold">{team.name}</h1>
              <p className="text-gray-500 text-lg">{team.short_name}</p>
            </div>
          </div>

          {/* Players Grid */}
          <h2 className="text-2xl font-semibold mb-4">Players</h2>
          <div className="max-h-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {players.map((player: any) => (
              <PlayerCard
                key={player.id}
                player={player}
                stats={player.aggregated_stats}
              />
            ))}
          </div>
        </div>
      )}

      {!team && (
        <p className="text-gray-500 text-center mt-10">Loading team info...</p>
      )}
    </div>
  );
};

export default TeamPage;
