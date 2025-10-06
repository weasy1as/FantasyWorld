import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1️⃣ Fetch top assists
    const { data: topAssists, error: topAssistsError } = await supabase
      .from("top_assists")
      .select("player_id, total_assists")
      .order("total_assists", { ascending: false })
      .limit(6);

    if (topAssistsError) throw topAssistsError;

    // 2️⃣ Extract player IDs
    const topPlayerIds = topAssists.map((player) => player.player_id);

    // 3️⃣ Fetch player details for those IDs
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .in("id", topPlayerIds);

    if (playersError) throw playersError;

    // 4️⃣ Merge total_assists into the player objects
    const result = playersData.map((player) => {
      const assister = topAssists.find((s) => s.player_id === player.id);
      return { ...player, total_assists: assister?.total_assists ?? 0 };
    });

    result.sort((a, b) => b.total_assists - a.total_assists);

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
