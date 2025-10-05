// app/api/ai-Insight/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // You can extract a player ID from query params if needed
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");

  // Dummy AI Insight data
  const dummyData = {
    playerId,
    analysis: {
      strengths: [
        "Excellent passing accuracy",
        "High work rate",
        "Strong defensive positioning",
      ],
      weaknesses: [
        "Low aerial duels won",
        "Susceptible to fatigue in late games",
      ],
      predictedPerformanceNextMatch: {
        expectedGoals: 0.7,
        expectedAssists: 0.5,
        expectedPoints: 6,
      },
      overallRating: 8.3, // out of 10
    },
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(dummyData);
}
