import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PlayerHistory } from "../../../../types/type";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { player, stats, history } = body; // history = array of last 5 games

    if (!player || !stats) {
      return NextResponse.json(
        { error: "Missing player or stats in request body" },
        { status: 400 }
      );
    }

    // 1️⃣ Check Supabase for cached insight for this player & prompt
    const { data: cached, error: fetchError } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("player_id", player.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Supabase fetch error:", fetchError);
    }

    // If cached exists and is recent (before next GW), return it
    if (cached) {
      const cachedDate = new Date(cached.created_at);
      if (cachedDate.getTime() > Date.now() - 1000 * 60 * 60 * 24) {
        // Optional: you can refine for GW logic
        return NextResponse.json({ insight: cached.response, cached: true });
      }
      console.log("Cached insight is stale, fetching new...");
    }

    // Build a recent form string (last 5 games)
    const recentForm = history
      ? history
          .slice(-5)
          .map((h: PlayerHistory) => {
            return `GW${h.fixture.gameweek}: ${h.total_points} pts, Goals: ${h.goals_scored}, Assists: ${h.assists}, CS: ${h.clean_sheets}, YC: ${h.yellow_cards}, RC: ${h.red_cards}`;
          })
          .join("\n")
      : "No recent form data available";

    // Build dynamic prompt using player, stats, and advanced metrics
    const prompt = `You are a fantasy football advisor. You are given the stats of a player. 
Based on the player's recent performance, predict whether the user should: 
"Buy", "Avoid", "Sell", or "Shortlist/Wait". 

Consider all stats carefully, including appearances, goals, assists, clean sheets, 
yellow/red cards, total points, minutes played, expected goals, expected assists, 
influence, creativity, and threat. Also consider the player's recent form (last 5 games).

Return a JSON object with the following structure:

{
  "recommendation": "<Buy|Avoid|Sell|Shortlist>",
  "reasoning": "<Explain why this recommendation is given in 1-2 sentences>"
}

Here is the player data:

Player: ${player.first_name} ${player.second_name} (${player.web_name})
Team: ${player.team.name}
Position: ${
      player.position === 1
        ? "Goalkeeper"
        : player.position === 2
        ? "Defender"
        : player.position === 3
        ? "Midfielder"
        : "Forward"
    }

Stats:
Appearances: ${stats.appearances}
Goals: ${stats.goals}
Assists: ${stats.assists}
Clean Sheets: ${stats.cleanSheets}
Yellow Cards: ${stats.yellowCards}
Red Cards: ${stats.redCards}
Total Points: ${stats.totalPoints}
Minutes Played: ${stats.minutes}
Expected Goals: ${stats.expectedGoals || 0}
Expected Assists: ${stats.expectedAssists || 0}
Influence: ${stats.influence || 0}
Creativity: ${stats.creativity || 0}
Threat: ${stats.threat || 0}

Recent Form (last 5 games):
${recentForm}

Based on the above data, provide your recommendation.`;

    // Call OpenAI API
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    const data = await openaiRes.json();

    // Extract AI insight
    const insightRaw = data.choices?.[0]?.message?.content || "";

    // Try to parse as JSON if OpenAI returned JSON text
    let insight;
    try {
      insight = JSON.parse(insightRaw);
    } catch {
      insight = { recommendation: "Unknown", reasoning: insightRaw };
    }

    // 6️⃣ Store in Supabase
    const { error: insertError } = await supabase.from("ai_insights").insert([
      {
        player_id: player.id,
        prompt,
        response: insight,
      },
    ]);

    if (insertError) console.error("Supabase insert error:", insertError);

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Error getting AI insight:", error);
    return NextResponse.json(
      { error: "Failed to get AI insight" },
      { status: 500 }
    );
  }
}
