import { NextRequest, NextResponse } from 'next/server';
import { analyzeEmailContent } from '@/lib/threat-scanners';

export async function POST(req: NextRequest) {
  try {
    const { sender = '', subject = '', body = '' } = await req.json();
    if (!sender && !subject && !body) {
      return NextResponse.json({ error: 'At least one field (sender, subject, or body) is required' }, { status: 400 });
    }

    const result = await analyzeEmailContent(sender, subject, body);

    return NextResponse.json({
      verdict: result.verdict,
      confidence: result.confidence,
      score: result.score,
      riskScore: result.riskScore,
      severity: result.severity,
      matchedRules: result.matchedRules,
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
