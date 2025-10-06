import React from "react";

interface TopStatPlayer {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  team_id: number;
  position: number;
  photo_url: string;
  stat_value: number;
  stat_label: string;
}

interface TopStatListProps {
  title: string;
  players: TopStatPlayer[];
}

const TopStatList: React.FC<TopStatListProps> = ({ title, players }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      {players.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                <p className="text-gray-600">Team ID: {player.team_id}</p>
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
                <p className="text-gray-800 font-semibold">
                  {player.stat_label}: {player.stat_value}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No {title.toLowerCase()} found.</p>
      )}
    </div>
  );
};

export default TopStatList;
