import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: teams, error } = await supabase.from("teams").select("*");
  if (error) {
    return new Response("Error fetching teams", { status: 500 });
  }
  return new Response(JSON.stringify(teams), { status: 200 });
}
