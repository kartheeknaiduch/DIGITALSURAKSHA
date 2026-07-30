import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfFile } from '@/lib/threat-scanners';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const result = await analyzePdfFile(file);

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
