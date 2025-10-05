import { useEffect, useState } from "react";

const PlayerSearch = ({
  label,
  onSelect,
}: {
  label: string;
  onSelect: (player: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    if (!searchTerm) {
      setPlayers([]);
      return;
    }
    const debounce = setTimeout(async () => {
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
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${label} by name...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border bg-gray-600 text-white"
        />
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {players.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-scroll">
          {players.map((player) => (
            <li
              key={player.id}
              className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                onSelect(player);
                setSearchTerm(""); // clear search after selecting
              }}
            >
              <img
                src={player.photo_url}
                alt={player.web_name}
                className="w-16 h-20 object-cover rounded-full"
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
        <p className="text-center text-gray-500">No players found.</p>
      )}
    </main>
  );
};

export default PlayerSearch;
