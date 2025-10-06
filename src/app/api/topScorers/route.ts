import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1️⃣ Fetch top scorers
    const { data: topScorers, error: topScorersError } = await supabase
      .from("top_scorers")
      .select("player_id, total_goals")
      .order("total_goals", { ascending: false })
      .limit(6);

    if (topScorersError) throw topScorersError;

    // 2️⃣ Extract player IDs
    const topPlayerIds = topScorers.map((player) => player.player_id);

    // 3️⃣ Fetch player details for those IDs
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .in("id", topPlayerIds);

    if (playersError) throw playersError;

    // 4️⃣ Merge total_goals into the player objects
    const result = playersData.map((player) => {
      const scorer = topScorers.find((s) => s.player_id === player.id);
      return { ...player, total_goals: scorer?.total_goals ?? 0 };
    });

    result.sort((a, b) => b.total_goals - a.total_goals);

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
