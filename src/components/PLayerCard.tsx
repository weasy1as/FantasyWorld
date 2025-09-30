import Image from "next/image";
type Player = {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  position: number;
  photo_url: string;
  team: Team;
};
type Team = {
  id: number;
  short_name: string;
  logo_url: string;
  name: string;
};
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
export default function PlayerCard({
  player,
  stats,
}: {
  player: Player | null;
  stats: AggregatedStats | null;
}) {
  if (!player) return null;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      {/* Header Section */}
      <div className="bg-red-600 px-4 pt-4 relative h-full">
        <div className="flex items-center gap-3">
          <Image
            src={player.photo_url}
            alt={`${player.first_name} ${player.second_name}`}
            width={110}
            height={110}
            className=""
          />
          <div className="flex flex-col  text-white">
            <h2 className="text-lg font-medium">{player.first_name}</h2>
            <h1 className="text-2xl font-bold leading-tight">
              {player.second_name}
            </h1>
            <div className="flex gap-3 text-sm mt-1">
              <div className="flex gap-2">
                <img
                  className="w-8 h-8"
                  src={player.team.logo_url}
                  alt={player.team.name}
                />
                {player.team.name}
              </div>{" "}
              •
              {player.position === 1
                ? "Goalkeeper"
                : player.position === 2
                ? "Defender"
                : player.position === 3
                ? "Midfielder"
                : "Forward"}{" "}
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white text-red-600 rounded-full px-9 py-4 text-sm font-medium"></div>
      </div>

      {/* Stats Section */}
      <div className="p-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Appearances</p>
          <p className="font-medium">{stats?.appearances}</p>
        </div>
        <div>
          <p className="text-gray-500">Goals</p>
          <p className="font-medium">{stats?.goals}</p>
        </div>
        <div>
          <p className="text-gray-500">Assists</p>
          <p className="font-medium">{stats?.assists}</p>
        </div>
        <div>
          <p className="text-gray-500">Clean Sheets</p>
          <p className="font-medium">{stats?.cleanSheets}</p>
        </div>
        <div>
          <p className="text-gray-500">Yellow Cards</p>
          <p className="font-medium">{stats?.yellowCards}</p>
        </div>
        <div>
          <p className="text-gray-500">Red Cards</p>
          <p className="font-medium">{stats?.redCards}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Points</p>
          <p className="font-medium">{stats?.totalPoints}</p>
        </div>
        <div>
          <p className="text-gray-500">Minutes Played</p>
          <p className="font-medium">{stats?.minutes}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center">
        <button className="text-sm font-semibold text-white px-4 py-2 rounded-xl  bg-[#080808] cursor-pointer hover:bg-gray-800 hover:scale-110 transition ease-in-out">
          Ai insights
        </button>
      </div>
    </div>
  );
}
