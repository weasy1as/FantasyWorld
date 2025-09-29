"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const [player, setPlayer] = React.useState(null);
  const params = useParams();
  const playerId = params.playerId;

  const fetchPlayer = async () => {
    const res = await fetch(`/api/players/${playerId}`);
    const data = await res.json();
    setPlayer(data);
    console.log(data);
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  return (
    <div className="p-8 flex  items-center gap-4">
      {player && (
        <>
          <h1 className="text-2xl font-bold">
            {player.first_name} <br /> {player.second_name}
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p>{player.team.name}</p>
            <p>{player.team.short_name}</p>
            <img
              sizes="(max-width: 600px) 100vw, 50vw"
              className="w-32 h-32 object-contain"
              src={player.team.logo_url}
            />
          </div>

          <p>
            {player.position == 1 && "Goalkeeper"}
            {player.position == 2 && "Defender"}
            {player.position == 3 && "Midfielder"}
            {player.position == 4 && "Forward"}
          </p>
          <img src={player.photo_url} alt={player.web_name} />
        </>
      )}
    </div>
  );
};

export default page;
