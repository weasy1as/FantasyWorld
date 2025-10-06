import Image from "next/image";
import { FaUserAlt } from "react-icons/fa";
import { AggregatedStats, Player } from "../../types/type";

export default function PlayerCard({
  player,
  stats,
  showStats,
  onInsightsClick,
  aiData,
  loading,
  comparePage,
}: {
  player: Player | null;
  stats: AggregatedStats | null;
  showStats: boolean;
  onInsightsClick?: (player: Player) => void;
  aiData?: { recommendation: string; reasoning: string } | null;
  loading?: boolean;
  comparePage?: boolean;
}) {
  if (!player) return null;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      {/* Header Section */}
      <div
        className="bg-blue-300 px-4 pt-4 h-auto relative cursor-pointer"
        onClick={() => {
          window.location.href = `/player/${player.id}`;
        }}
      >
        <div className="flex items-center gap-3">
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={player.web_name}
              height={110}
              width={110}
              onError={(e) => {
                // fallback to placeholder if image fails
                e.currentTarget.style.display = "none";
                e.currentTarget.insertAdjacentHTML(
                  "afterend",
                  `<div class='flex items-center justify-center w-20 h-20 rounded-full bg-gray-200'>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" />
                   <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                 </svg>
               </div>`
                );
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200">
              <FaUserAlt className="w-10 h-10 text-gray-500" />
            </div>
          )}

          <div className="flex flex-col  text-white">
            <h2 className="text-lg font-medium">{player.first_name}</h2>
            <h1 className="text-2xl font-bold leading-tight">
              {player.second_name}
            </h1>
            <div className="flex flex-col items-center gap-3 text-sm mt-1">
              <div className="flex flex-col md:flex-row items-center pb-2 gap-2">
                <Image
                  className="w-8 h-8"
                  src={player.team.logo_url}
                  alt={player.team.name}
                  width={32}
                  height={32}
                />
                {player.team.name}
              </div>{" "}
              {player.position === 1 ? (
                <p className="font-bold text-xl ">• Goalkeeper</p>
              ) : player.position === 2 ? (
                <p className="font-bold text-xl ">• Defender</p>
              ) : player.position === 3 ? (
                <p className="font-bold text-xl ">• Midfielder</p>
              ) : (
                <p className="font-bold text-xl ">• Forward</p>
              )}{" "}
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white text-red-600 rounded-full px-9 py-4 text-sm font-medium"></div>
      </div>

      {/* Stats Section */}
      {showStats && (
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
      )}

      {/* Footer */}
      {showStats && !comparePage && (
        <div className="bg-gray-100 p-4 text-center">
          {!aiData ? (
            <button
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer hover:scale-110 transition ease-in-out"
              onClick={() => onInsightsClick && onInsightsClick(player)}
              disabled={loading}
            >
              {loading ? "Getting Insights..." : "Get AI Insights"}
            </button>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-lg text-gray-800">AI Insights</h3>

              {/* Recommendation Badge */}
              <div
                className={`inline-block px-4 py-2 rounded-full font-semibold text-white ${
                  aiData?.recommendation === "Buy"
                    ? "bg-green-500"
                    : aiData?.recommendation === "Sell" ||
                      aiData?.recommendation === "Avoid"
                    ? "bg-red-500"
                    : aiData?.recommendation === "Shortlist"
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-400"
                }`}
              >
                {aiData?.recommendation}
              </div>

              {/* Reasoning */}
              <p className="text-gray-700">{aiData?.reasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
