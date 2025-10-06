"use client";
import React, { useState, useEffect } from "react";
import { SiPremierleague } from "react-icons/si";
import TopStatList from "../components/TopStatList";

type Player = {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  team: {
    id: number;
    name: string;
    short_name: string;
    logo_url: string;
  };
  position: number;
  photo_url: string;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [topScorers, setTopScorers] = useState<any[]>([]);
  const [topAssists, setTopAssists] = useState<any[]>([]);
  const [loadingTopScorers, setLoadingTopScorers] = useState(false);
  const [loadingTopAssists, setLoadingTopAssists] = useState(false);

  // Fetch players matching searchTerm
  const fetchPlayers = async () => {
    if (!searchTerm) return setPlayers([]); // clear if empty
    setLoading(true);

    try {
      const res = await fetch(`/api/players?search=${searchTerm}`);
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch top scorers
  useEffect(() => {
    const fetchTopScorers = async () => {
      setLoadingTopScorers(true);
      try {
        const res = await fetch("/api/topScorers");
        const data = await res.json();
        setTopScorers(data);
      } catch (err) {
        console.error("Error fetching top scorers:", err);
      } finally {
        setLoadingTopScorers(false);
      }
    };
    fetchTopScorers();
  }, []);

  useEffect(() => {
    const fetchTopAssists = async () => {
      setLoadingTopAssists(true);
      try {
        const res = await fetch("/api/topAssists");
        const data = await res.json();
        setTopAssists(data);
      } catch (err) {
        console.error("Error fetching top assists:", err);
      } finally {
        setLoadingTopAssists(false);
      }
    };
    fetchTopAssists();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#191022]">
      <header className="flex flex-col justify-center items-center text-center space-y-4 py-12 text-white">
        <SiPremierleague className=" text-white" size={98} />
        <div className="">
          <h1 className="text-4xl font-bold mb-2">FPL player analysis</h1>
          <p className="text-lg text-gray-400 w-sm md:w-md dark:text-gray-400 max-w-2xl">
            Track and compare Fantasy Premier League players with AI-driven
            insights. Analyze player performance, statistics, and trends to make
            informed decisions for your team.
          </p>
        </div>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search player by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border bg-gray-600 text-white"
          />
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading players...</p>
        )}

        {players.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-1 gap-6 overflow-y-scroll h-auto max-h-[600px]">
            {players.map((player) => (
              <li
                key={player.id}
                className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => (window.location.href = `/player/${player.id}`)}
              >
                <img
                  src={player.photo_url}
                  alt={player.web_name}
                  className="w-16 h-20 object-fit rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {player.first_name} {player.second_name} ({player.web_name})
                  </h3>
                  <p className="text-gray-600">
                    Team: {player.team.name} ({player.team.short_name})
                  </p>
                  <p className="text-gray-600">
                    Position:{" "}
                    {player.position === 1
                      ? "Goalkeeper"
                      : player.position === 2
                      ? "Defender"
                      : player.position === 3
                      ? "Midfielder"
                      : "Forward"}
                  </p>
                </div>
                <img
                  src={player.team.logo_url}
                  alt={player.team.short_name}
                  className="w-10 h-10 object-contain"
                />
              </li>
            ))}
          </ul>
        )}

        {!loading && searchTerm && players.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No players found.</p>
        )}

        {/* Top Scorers Section */}
        <TopStatList
          title="Top Scorers"
          players={topScorers.map((p: any) => ({
            ...p,
            stat_value: p.total_goals,
            stat_label: "Goals",
          }))}
        />
        {/* Top Assists Section */}
        <TopStatList
          title="Top Assists"
          players={topAssists.map((p: any) => ({
            ...p,
            stat_value: p.total_assists,
            stat_label: "Assists",
          }))}
        />
      </main>
    </div>
  );
}
