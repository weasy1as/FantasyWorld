import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params;

  const { data, error } = await supabase
    .from("player_history")
    .select(
      `
    *,
    fixture:fixtures (
      id,
      gameweek,
      kickoff_time,
      team_h,
      team_a,
      team_h_score,
      team_a_score,
      finished,
      home_team:team_h (
        id,
        name,
        short_name,
        logo_url
      ),
      away_team:team_a (
        id,
        name,
        short_name,
        logo_url
      )
    )
  `
    )
    .eq("player_id", playerId);

  if (error) {
    return new Response("Player history not found", { status: 404 });
  }

  const sorted = data.sort(
    (a, b) =>
      new Date(b.fixture.kickoff_time).getTime() -
      new Date(a.fixture.kickoff_time).getTime()
  );
  return new Response(JSON.stringify(sorted), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
