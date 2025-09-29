import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // Parse query parameters
  const url = new URL(req.url);
  const teamId = url.searchParams.get("team_id"); // reads ?team_id=123

  // Build Supabase query
  let query = supabase
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

  if (teamId) {
    query = query.or(`team_h.eq.${teamId},team_a.eq.${teamId}`);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
