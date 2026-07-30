import { NextRequest, NextResponse } from 'next/server';
import { analyzeUrl } from '@/lib/threat-scanners';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await analyzeUrl(url);

    return NextResponse.json({
      verdict: result.verdict,
      confidence: result.confidence,
      score: result.score,
      riskScore: result.riskScore,
      severity: result.severity,
      matchedRules: result.matchedRules,
      matchedPatterns: result.matchedPatterns,
      highRiskPatterns: result.highRiskPatterns,
      suspiciousPatterns: result.suspiciousPatterns,
      reasons: result.reasons,
      recommendations: result.recommendations,
      embeddedUrls: result.embeddedUrls,
      explanation: result.explanation,
      nextStep: result.nextStep,
      analysisTime: result.analysisTime,
      scanEngine: result.scanEngine,
      status: result.status,
      engine: result.engine,
      sources: result.sources,
      feedMatches: result.feedMatches,
      isMock: false,
      engines: {
        threatFeed: {
          checked: true,
          flagged: result.feedMatches.length > 0,
          matches: result.feedMatches,
        },
        heuristic: {
          checked: true,
          flagged: (result.highRiskPatterns ?? []).length > 0 || (result.suspiciousPatterns ?? []).length > 0,
          reasons: [...(result.highRiskPatterns ?? []), ...(result.suspiciousPatterns ?? [])],
        },
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
