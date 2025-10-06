import { NextRequest, NextResponse } from "next/server";
import { PlayerHistory } from "../../../../../types/type";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { player1, stats1, history1, player2, stats2, history2 } = body;

    if (!player1 || !stats1 || !player2 || !stats2) {
      return NextResponse.json(
        { error: "Missing players or stats in request body" },
        { status: 400 }
      );
    }

    // Build recent form strings
    const recentForm1 = history1
      ? history1
          .slice(-5)
          .map(
            (h: PlayerHistory) =>
              `GW${h.fixture.gameweek}: ${h.total_points} pts, G:${h.goals_scored}, A:${h.assists}`
          )
          .join("\n")
      : "No recent form";

    const recentForm2 = history2
      ? history2
          .slice(-5)
          .map(
            (h: PlayerHistory) =>
              `GW${h.fixture.gameweek}: ${h.total_points} pts, G:${h.goals_scored}, A:${h.assists}`
          )
          .join("\n")
      : "No recent form";

    // Prompt for comparing 2 players
    const prompt = `You are a fantasy football advisor. You are given the stats of two players.
Compare them and recommend whether the user should:
- Buy both
- Buy only Player 1
- Buy only Player 2
- Hold both
- Avoid both
- Shortlist/Wait

Return a JSON object with this structure:
{
  "recommendation": "<Buy Both|Buy Player1.webname|Buy Player2.webname|Hold Both|Avoid Both|Shortlist>",
  "reasoning": "<1-2 sentence explanation comparing the players>"
}

Player 1: ${player1.first_name} ${player1.second_name} (${player1.web_name})
Team: ${player1.team.name}, Position: ${player1.position}
Stats: Appearances ${stats1.appearances}, Goals ${stats1.goals}, Assists ${
      stats1.assists
    }, Points ${stats1.totalPoints}, Minutes ${stats1.minutes}, xG ${
      stats1.expectedGoals || 0
    }, xA ${stats1.expectedAssists || 0}, Influence ${
      stats1.influence || 0
    }, Creativity ${stats1.creativity || 0}, Threat ${stats1.threat || 0}
Recent form:
${recentForm1}

Player 2: ${player2.first_name} ${player2.second_name} (${player2.web_name})
Team: ${player2.team.name}, Position: ${player2.position}
Stats: Appearances ${stats2.appearances}, Goals ${stats2.goals}, Assists ${
      stats2.assists
    }, Points ${stats2.totalPoints}, Minutes ${stats2.minutes}, xG ${
      stats2.expectedGoals || 0
    }, xA ${stats2.expectedAssists || 0}, Influence ${
      stats2.influence || 0
    }, Creativity ${stats2.creativity || 0}, Threat ${stats2.threat || 0}
Recent form:
${recentForm2}`;

    // Call OpenAI
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
    const insightRaw = data.choices?.[0]?.message?.content || "";

    let insight;
    try {
      insight = JSON.parse(insightRaw);
    } catch {
      insight = { recommendation: "Unknown", reasoning: insightRaw };
    }

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Compare AI error:", error);
    return NextResponse.json(
      { error: "Failed to get AI comparison" },
      { status: 500 }
    );
  }
}
