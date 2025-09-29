import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { playerId: string } }
) {
  const playerId = params.playerId;
  console.log("playerid " + playerId);

  const { data, error } = await supabase
    .from("players")
    .select("*,team:teams(*)")
    .eq("id", playerId)
    .single();

  if (error) {
    return new Response("Player not found", { status: 404 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
