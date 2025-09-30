import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const teamId = url.searchParams.get("teamId");

  let query = supabase.from("teams").select("*");

  if (teamId) {
    query = query.eq("id", teamId);
  }

  const { data: teams, error } = await query;

  if (error) {
    return new Response("Error fetching teams", { status: 500 });
  }

  return new Response(JSON.stringify(teams), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
