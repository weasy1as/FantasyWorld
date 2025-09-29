import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("fixtures")
    .select(
      `
      id,
      gameweek,
      kickoff_time,
      team_h,
      team_a,
      team_h_score,
      team_a_score,
      team_h_difficulty,
      team_a_difficulty,
      finished,
      home_team:team_h ( id, short_name, logo_url ),
      away_team:team_a ( id, short_name, logo_url )
    `
    )
    .order("kickoff_time", { ascending: true });

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: error?.message || "No fixtures found" }),
      { status: 500 }
    );
  }

  // Group by gameweek
  const grouped = data.reduce((acc: Record<number, any[]>, fixture) => {
    const gw = fixture.gameweek;
    if (!acc[gw]) acc[gw] = [];
    acc[gw].push(fixture);
    return acc;
  }, {});

  return new Response(JSON.stringify(grouped), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
