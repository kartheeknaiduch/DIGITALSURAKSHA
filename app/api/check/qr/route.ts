import { NextRequest, NextResponse } from 'next/server';
import { analyzeQrPayload } from '@/lib/threat-scanners';

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json();
    if (!payload || typeof payload !== 'string') {
      return NextResponse.json({ error: 'QR payload is required' }, { status: 400 });
    }

    const result = await analyzeQrPayload(payload);

    return NextResponse.json({
      verdict: result.verdict,
      confidence: result.confidence,
      score: result.score,
      riskScore: result.riskScore,
      severity: result.severity,
      matchedRules: result.matchedRules,
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
