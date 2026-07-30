import { NextRequest, NextResponse } from 'next/server';
import { analyzeSmsText } from '@/lib/threat-scanners';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const result = await analyzeSmsText(message);

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
    });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
