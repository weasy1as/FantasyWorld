import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: players, error } = await supabase.from("players").select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(players), { status: 200 });
}
