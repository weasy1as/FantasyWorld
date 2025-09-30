import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search"); // get search param
  const teamId = url.searchParams.get("teamId");

  // Base query: select all players with team info
  let query = supabase.from("players").select("*, team:teams(*)");

  if (search) {
    // If search exists, filter by first_name OR second_name (case-insensitive)
    query = query.or(
      `first_name.ilike.%${search}%,second_name.ilike.%${search}%`
    );
  }
  if (teamId) {
    // If teamId exists, filter by teamId
    query = query.eq("team_id", teamId);
  }

  const { data: players, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(players), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
