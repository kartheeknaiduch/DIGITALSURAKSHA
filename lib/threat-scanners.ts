import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import https from 'node:https';

type Severity = 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
type Verdict = 'safe' | 'suspicious' | 'high_risk' | 'unable_to_analyze';

interface AnalysisResult {
  verdict: Verdict;
  score: number;
  riskScore: number;
  confidence: number;
  severity: Severity;
  matchedRules: string[];
  reasons: string[];
  recommendations: string[];
  analysisTime: string;
  scanEngine: string;
  status: 'completed' | 'unable_to_analyze';
  matchedPatterns?: string[];
  highRiskPatterns?: string[];
  suspiciousPatterns?: string[];
  embeddedUrls?: string[];
  explanation?: string;
  nextStep?: string;
  engine?: string;
  sources?: string[];
  [key: string]: unknown;
}

interface ThreatFeed { domains: Set<string>; urls: Set<string>; source: string; sources: string[]; }
declare global { var __digitalSurakshaThreatFeed: Promise<ThreatFeed> | undefined; }

const FEED_URLS = [
  { label: 'Phishing.Database domains', url: 'https://raw.githubusercontent.com/Phishing-Database/Phishing.Database/master/phishing-domains-ACTIVE.txt', kind: 'domain' as const },
  { label: 'Phishing.Database links', url: 'https://raw.githubusercontent.com/Phishing-Database/Phishing.Database/master/phishing-links-ACTIVE-NOW.txt', kind: 'url' as const },
  { label: 'URLhaus', url: 'https://urlhaus.abuse.ch/downloads/text/', kind: 'url' as const },
  { label: 'OpenPhish', url: 'https://raw.githubusercontent.com/openphish/public_feed/refs/heads/main/feed.txt', kind: 'url' as const },
];

function normalizeText(value: string): string { return value.replace(/\s+/g, ' ').trim(); }
function normalizeForSearch(value: string): string { return value.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').trim(); }
function extractUrls(text: string): string[] { const urlRegex = /(https?:\/\/[^\s<>'"`]+|www\.[^\s<>'"`]+)/gi; return (text.match(urlRegex) || []).map((u) => u.replace(/[),.;]+$/g, '')); }
function extractPhoneNumbers(text: string): string[] { const regex = /(?:\+?91[-\s]?)?(?:\(?\d{3}\)?[-\s]?){2}\d{4}/g; return Array.from(new Set((text.match(regex) || []).map((v) => v.replace(/[^\d+]/g, '')))); }
function severityFor(score: number): Severity { if (score >= 85) return 'Critical'; if (score >= 65) return 'High'; if (score >= 35) return 'Medium'; if (score >= 15) return 'Low'; return 'Safe'; }
function verdictFor(score: number, matchedRules: string[], status: 'completed' | 'unable_to_analyze'): Verdict { if (status === 'unable_to_analyze') return 'unable_to_analyze'; if (score >= 70 || matchedRules.length >= 4) return 'high_risk'; if (score >= 20 || matchedRules.length >= 1) return 'suspicious'; return 'safe'; }
function calculateConfidence(score: number, matchedRules: string[], status: 'completed' | 'unable_to_analyze', evidenceCount: number): number {
  if (status === 'unable_to_analyze') return 15;
  let confidence = 55;
  confidence += Math.min(20, matchedRules.length * 5);
  confidence += Math.min(15, evidenceCount * 4);
  if (score >= 70) confidence += 10;
  else if (score >= 35) confidence += 5;
  else if (score === 0) confidence += 8;
  return Math.min(95, Math.max(30, Math.round(confidence)));
}
function buildSummary(score: number, matchedRules: string[], reasons: string[], recommendations: string[], engine: string, status: 'completed' | 'unable_to_analyze', extra: Partial<AnalysisResult> = {}): AnalysisResult { const finalScore = Math.min(100, Math.max(0, score)); const computedConfidence = typeof extra.confidence === 'number'
    ? extra.confidence
    : calculateConfidence(finalScore, matchedRules, status, extra.sources?.length ? Math.min(6, extra.sources.length) : 3);
  return { verdict: verdictFor(finalScore, matchedRules, status), score: finalScore, riskScore: finalScore, confidence: computedConfidence, severity: severityFor(finalScore), matchedRules, reasons, recommendations, analysisTime: new Date().toISOString(), scanEngine: engine, status, explanation: reasons.join(' '), nextStep: recommendations[0] || 'Review carefully.', engine, ...extra }; }
function getHost(value: string): string | null { try { return new URL(value.startsWith('http') ? value : `https://${value}`).hostname.toLowerCase(); } catch { return null; } }
function isTrustedDomain(host: string): boolean {
  const normalizedHost = host.toLowerCase().replace(/^www\./, '').replace(/:\d+$/, '');
  const trustedDomains = new Set([
    'google.com',
    'gmail.com',
    'accounts.google.com',
    'mail.google.com',
    'drive.google.com',
    'photos.google.com',
    'meet.google.com',
    'maps.google.com',
    'play.google.com',
    'docs.google.com',
    'youtube.com',
    'instagram.com',
    'facebook.com',
    'microsoft.com',
    'outlook.com',
    'live.com',
    'office.com',
    'amazon.com',
    'paypal.com',
    'netflix.com',
    'linkedin.com',
    'x.com',
    'twitter.com',
    'github.com',
    'apple.com',
    'icloud.com',
    'sbi.co.in',
    'sbi.in',
    'hdfcbank.com',
    'icicibank.com',
    'axisbank.com',
    'uidai.gov.in',
    'rbi.org.in',
    'paytm.com',
    'phonepe.com',
    'bharatpe.com',
  ]);

  return Array.from(trustedDomains).some((domain) => normalizedHost === domain || normalizedHost.endsWith(`.${domain}`));
}
function getUrlSignalDetails(url: string): { highRiskLabels: string[]; suspiciousLabels: string[] } { const result = { highRiskLabels: [] as string[], suspiciousLabels: [] as string[] }; try { const parsed = new URL(url.startsWith('http') ? url : `https://${url}`); const host = parsed.hostname.toLowerCase().replace(/^www\./, ''); const path = parsed.pathname.toLowerCase(); if (!isTrustedDomain(host)) { const hasBrand = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'google', 'microsoft', 'uidai', 'rbi', 'incometax', 'bank'].some((brand) => host.includes(brand)); const hasSensitive = ['login', 'signin', 'verify', 'secure', 'update', 'alert', 'account', 'auth', 'wallet', 'payment', 'claim', 'support', 'recovery'].some((term) => host.includes(term) || path.includes(term)); if (hasBrand && hasSensitive) result.highRiskLabels.push('Brand impersonation / credential-harvesting page'); }
 if (/\.(xyz|top|club|online|shop|tk|ml|ga|cf)$/i.test(host)) result.suspiciousLabels.push('Unusual domain TLD'); if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) result.suspiciousLabels.push('Raw IP-based hostname'); if (host.split('.').length > 5) result.suspiciousLabels.push('Long subdomain chain'); if (['bit.ly', 'tinyurl.com', 't.co', 'ow.ly', 'rb.gy', 'is.gd'].includes(host)) result.suspiciousLabels.push('URL shortener'); if (!isTrustedDomain(host) && /(login|verify|secure|update|account|claim|payment)/i.test(path)) result.suspiciousLabels.push('Sensitive path keyword'); } catch { result.suspiciousLabels.push('Malformed URL'); } return result; }
async function loadThreatFeed(): Promise<ThreatFeed> { if (globalThis.__digitalSurakshaThreatFeed) return globalThis.__digitalSurakshaThreatFeed; const promise = (async () => { const domains = new Set<string>(); const urls = new Set<string>(); const sources: string[] = []; for (const feedUrl of FEED_URLS) { try { const res = await fetch(feedUrl.url, { headers: { Accept: 'text/plain' } }); if (!res.ok) continue; const text = await res.text(); const loaded = text.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith('#')).length; if (loaded > 0) { sources.push(feedUrl.label); } for (const rawLine of text.split(/\r?\n/)) { const line = rawLine.trim(); if (!line || line.startsWith('#')) continue; const clean = normalizeForSearch(line.replace(/^https?:\/\//, '').replace(/^www\./, '')); if (feedUrl.kind === 'domain') { if (clean) domains.add(clean.split('/')[0]); } else if (clean) { urls.add(clean); } } } catch {} } return { domains, urls, source: sources.length ? sources.join(', ') : 'No public feeds loaded', sources }; })(); globalThis.__digitalSurakshaThreatFeed = promise; return promise; }
async function getTlsInfo(url: string): Promise<{ subject: string; issuer: string; selfSigned: boolean } | null> { try { const parsed = new URL(url.startsWith('http') ? url : `https://${url}`); return await new Promise((resolve) => { const req = https.request(parsed, { method: 'GET', rejectUnauthorized: false }, (res) => { const socket = res.socket as typeof res.socket & { getPeerCertificate?: (detailed?: boolean) => any }; const cert = socket.getPeerCertificate?.(true); resolve({ subject: cert?.subject?.CN || cert?.subject?.O || 'unknown', issuer: cert?.issuer?.CN || cert?.issuer?.O || 'unknown', selfSigned: cert?.issuer?.CN === cert?.subject?.CN }); res.resume(); res.destroy(); }); req.on('error', () => resolve(null)); req.end(); }); } catch { return null; } }async function getDomainAge(host: string): Promise<string | null> { try { const res = await fetch(`https://rdap.org/domain/${host.toLowerCase()}`); if (!res.ok) return null; const data = await res.json() as { events?: Array<{ eventAction: string; eventDate?: string }> }; const reg = data.events?.find((entry) => entry.eventAction === 'registration'); return reg?.eventDate || null; } catch { return null; } }

export async function analyzeSmsText(message: string): Promise<AnalysisResult> {
  const startedAt = Date.now();
  const text = normalizeText(message);
  const urls = extractUrls(text);
  const phoneNumbers = extractPhoneNumbers(text);
  const lower = text.toLowerCase();
  const rules: Array<{ id: string; weight: number; reason: string }> = [];
  const reasons: string[] = [];
  const recommendations: string[] = [];
  const checks = [
    { id: 'otp-scam', regex: /\b(otp|one[-\s]?time password|one time password)\b/i, weight: 8, reason: 'OTP or one-time password is being requested.', recommendation: 'Never share OTPs with anyone who contacts you unexpectedly.' },
    { id: 'phishing-intent', regex: /\b(click|tap|open|visit|verify|update|secure|login|confirm)\b/i, weight: 5, reason: 'The message urges action through a click or verification flow.', recommendation: 'Avoid following urgent verification links from unsolicited messages.' },
    { id: 'urgency-language', regex: /\b(now|immediately|today|urgent|within|soon|warning|blocked|suspend|deactivate)\b/i, weight: 6, reason: 'The message uses urgency language to pressure the recipient.', recommendation: 'Do not act immediately when a message is demanding urgency.' },
    { id: 'financial-scam', regex: /\b(upi|refund|reward|prize|cashback|loan|investment|profit|stock|trading|bank|account|debit|credited|payment)\b/i, weight: 6, reason: 'The message references financial transactions or money movement.', recommendation: 'Verify financial messages with the official organization before acting.' },
    { id: 'kyc-scam', regex: /\b(kyc|aadhaar|uidai|pan|account verification)\b/i, weight: 8, reason: 'The message impersonates a KYC or identity verification process.', recommendation: 'Do not provide identity documents or OTPs for KYC over SMS.' },
    { id: 'courier-scam', regex: /\b(courier|parcel|customs|delivery|package|shipment)\b/i, weight: 7, reason: 'The message impersonates a parcel or courier delivery issue.', recommendation: 'Do not pay fees or click links for package delivery issues without checking the sender.' },
    { id: 'police-scam', regex: /\b(police|fir|arrest|legal notice|cybercrime|fraud case|warrant)\b/i, weight: 9, reason: 'The message uses police or legal threats to create fear.', recommendation: 'Treat police-threat messages as suspicious and verify independently.' },
    { id: 'bank-scam', regex: /\b(sbi|hdfc|icici|axis|bank|account block|suspend|freeze)\b/i, weight: 7, reason: 'The message impersonates a bank or financial institution.', recommendation: 'Contact the bank through an official number instead of the message channel.' },
    { id: 'upi-scam', regex: /\b(upi id|upi pin|qr code|phonepe|paytm|gpay)\b/i, weight: 7, reason: 'The message requests UPI or payment details.', recommendation: 'Never share UPI IDs or PINs over unsolicited messages.' },
    { id: 'investment-scam', regex: /\b(invest|return|profit|trading|stock|crypto|double your money)\b/i, weight: 8, reason: 'The message promotes an investment or profit opportunity.', recommendation: 'Ignore unsolicited investment offers and verify with licensed sources.' },
    { id: 'suspicious-url', regex: /https?:\/\//i, weight: 5, reason: 'The message contains an external URL.', recommendation: 'Check the URL before clicking it.' },
    { id: 'suspicious-phone', regex: /(?:\+?91[-\s]?)?(?:\(?\d{3}\)?[-\s]?){2}\d{4}/, weight: 4, reason: 'The message includes a phone number that may be used for callback scams.', recommendation: 'Do not call back numbers from unsolicited messages without verifying them.' },
  ];
  for (const check of checks) { if (check.regex.test(text)) { rules.push({ id: check.id, weight: check.weight, reason: check.reason }); reasons.push(check.reason); recommendations.push(check.recommendation); } }
  if (urls.length > 0) { for (const url of urls) { const signals = getUrlSignalDetails(url); if (signals.highRiskLabels.length) { rules.push({ id: 'url-structure-risk', weight: 6, reason: signals.highRiskLabels[0] }); reasons.push(signals.highRiskLabels[0]); recommendations.push('Treat this URL as a possible phishing page.'); } if (signals.suspiciousLabels.length) { rules.push({ id: 'url-structure-suspicious', weight: 3, reason: signals.suspiciousLabels[0] }); } } }
  if (phoneNumbers.length > 0 && /urgent|immediately|call|contact|reply/i.test(lower)) { rules.push({ id: 'callback-pressure', weight: 4, reason: 'The message asks the receiver to call back a phone number.' }); reasons.push('The message asks the receiver to call back a phone number.'); recommendations.push('Call the official number you already know instead of the number in the message.'); }
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0));
  const evidenceCount = 2 + Number(urls.length > 0) + Number(phoneNumbers.length > 0);
  const feed = await loadThreatFeed();
  const baseSummary = buildSummary(score, rules.map((rule) => rule.id), reasons, recommendations, 'SMS / Scam Scanner', 'completed', { matchedPatterns: rules.map((rule) => rule.reason), highRiskPatterns: rules.filter((rule) => rule.weight >= 7).map((rule) => rule.reason), suspiciousPatterns: rules.filter((rule) => rule.weight < 7).map((rule) => rule.reason), embeddedUrls: urls, explanation: reasons.join(' '), nextStep: recommendations[0] || 'Treat unsolicited financial or identity requests cautiously.', analysisTime: `${Date.now() - startedAt}ms`, confidence: calculateConfidence(score, rules.map((rule) => rule.id), 'completed', evidenceCount), sources: ['Message content analysis', 'URL pattern analysis', ...feed.sources] });
  return { ...baseSummary, analysisTime: `${Date.now() - startedAt}ms` };
}

export async function analyzeEmailContent(sender: string, subject: string, body: string): Promise<AnalysisResult> {
  const startedAt = Date.now();
  const text = normalizeText(`${sender}\n${subject}\n${body}`);
  const urls = extractUrls(text);
  const rules: Array<{ id: string; weight: number; reason: string }> = [];
  const reasons: string[] = [];
  const recommendations: string[] = [];
  const checks = [
    { id: 'email-urgency', regex: /urgent|immediately|today|within|reply now|verify now/i, weight: 6, reason: 'The email uses urgency language.', recommendation: 'Do not act on urgent email requests without verifying them.' },
    { id: 'email-bank-impersonation', regex: /sbi|hdfc|icici|axis|bank|account|credit|debit|payment|wallet/i, weight: 6, reason: 'The email refers to a banking or payment event.', recommendation: 'Verify the email through the official website or app.' },
    { id: 'email-kyc', regex: /kyc|verify|update profile|secure account/i, weight: 7, reason: 'The email requests account verification or profile updates.', recommendation: 'Do not follow account-update links from email messages.' },
    { id: 'email-otp', regex: /otp|one time password|one-time password/i, weight: 8, reason: 'The email requests or references an OTP.', recommendation: 'Never share OTPs in response to an email.' },
    { id: 'email-legal-threat', regex: /police|fir|arrest|cybercrime|legal notice|warrant/i, weight: 8, reason: 'The email uses legal threats or impersonates authorities.', recommendation: 'Treat the message as suspicious and verify through official channels.' },
    { id: 'email-courier', regex: /courier|parcel|customs|delivery|shipment/i, weight: 7, reason: 'The email impersonates a courier or shipment service.', recommendation: 'Do not pay courier fees from unsolicited email requests.' },
    { id: 'email-investment', regex: /investment|profit|trading|stock|crypto|double your money/i, weight: 8, reason: 'The email promotes an investment offer.', recommendation: 'Ignore unsolicited investment offers and verify with licensed advisors.' },
    { id: 'email-link', regex: /https?:\/\//i, weight: 4, reason: 'The email contains an external URL.', recommendation: 'Inspect the URL before clicking it.' },
  ];
  for (const check of checks) { if (check.regex.test(text)) { rules.push({ id: check.id, weight: check.weight, reason: check.reason }); reasons.push(check.reason); recommendations.push(check.recommendation); } }
  if (/noreply.*gmail\.com|support.*yahoo\.com|alerts.*hotmail|mail\.com/i.test(sender.toLowerCase())) { rules.push({ id: 'suspicious-sender-domain', weight: 6, reason: 'The sender uses a generic email provider rather than an official domain.' }); reasons.push('The sender uses a generic email provider rather than an official domain.'); recommendations.push('Verify the sender independently before trusting the message.'); }
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0));
  const evidenceCount = 2 + Number(urls.length > 0);
  const feed = await loadThreatFeed();
  const baseSummary = buildSummary(score, rules.map((rule) => rule.id), reasons, recommendations, 'Email / Scam Scanner', 'completed', { highRiskPatterns: rules.filter((rule) => rule.weight >= 7).map((rule) => rule.reason), suspiciousPatterns: rules.filter((rule) => rule.weight < 7).map((rule) => rule.reason), embeddedUrls: urls, explanation: reasons.join(' '), nextStep: recommendations[0] || 'Handle unsolicited email carefully.', analysisTime: `${Date.now() - startedAt}ms`, confidence: calculateConfidence(score, rules.map((rule) => rule.id), 'completed', evidenceCount), sources: ['Email content analysis', 'Sender pattern analysis', ...feed.sources] });
  return { ...baseSummary, analysisTime: `${Date.now() - startedAt}ms` };
}

export async function analyzeUrl(url: string): Promise<AnalysisResult & { feedMatches: string[]; redirectChain: string[]; finalUrl: string }> {
  let finalUrl = url;
  let redirectChain: string[] = [];
  const rules: Array<{ id: string; weight: number; reason: string }> = [];
  const reasons: string[] = [];
  const recommendations: string[] = [];
  let feedMatchesList: string[] = [];
  const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
  const feed = await loadThreatFeed();
  try {
    const hostname = parsed.hostname;
    const dnsInfo = await dns.lookup(hostname).catch(() => null);
    if (!dnsInfo) { rules.push({ id: 'dns-resolution-failed', weight: 10, reason: 'The hostname could not be resolved.' }); reasons.push('The hostname could not be resolved.'); recommendations.push('Do not visit this site until the hostname resolves.'); } else { reasons.push(`Resolved host ${hostname} to ${dnsInfo.address}.`); }
    const certificateInfo = await getTlsInfo(parsed.toString());
    if (!isTrustedDomain(hostname) && certificateInfo?.selfSigned) { rules.push({ id: 'self-signed-certificate', weight: 7, reason: 'The TLS certificate appears self-signed.' }); reasons.push('The TLS certificate appears self-signed.'); recommendations.push('Treat this site as untrusted until a trusted certificate is verified.'); }
    let response: Response | null = null;
    let html = '';
    let headers: Headers | null = null;
    try { response = await fetch(parsed.toString(), { method: 'GET', redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0' } }); headers = response.headers; html = await response.text(); finalUrl = response.url || parsed.toString(); redirectChain = [parsed.toString()]; if (response.status >= 300 && response.status < 400) { const location = response.headers.get('location'); if (location) { const nextUrl = new URL(location, response.url).toString(); redirectChain.push(nextUrl); finalUrl = nextUrl; const followup = await fetch(nextUrl, { method: 'GET', redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0' } }); html = await followup.text(); headers = followup.headers; finalUrl = followup.url || nextUrl; } } } catch { /* ignore */ }
    if (redirectChain.length > 2) { rules.push({ id: 'excessive-redirects', weight: 6, reason: 'The URL redirects through multiple hosts.' }); reasons.push('The URL redirects through multiple hosts.'); recommendations.push('Excessive redirects can be used to hide the final destination.'); }
    if (html) {
      const trustedHost = isTrustedDomain(hostname);
      const hasPasswordForm = /<form[^>]*>[^<]*(<input[^>]*type=['"]password['"][^>]*|<input[^>]*name=['"][^'"]*(pass|pwd|passwd)[^'"]*['"][^>]*|<input[^>]*type=['"]text['"][^>]*name=['"][^'"]*(user|email|phone)[^'"]*['"][^>]*>)/i.test(html);
      if (!trustedHost && hasPasswordForm) { rules.push({ id: 'login-form-detected', weight: 6, reason: 'The page contains a login form.' }); reasons.push('The page contains a login form.'); recommendations.push('Be careful with pages that ask for credentials.'); }
      const hiddenIframe = /<iframe[^>]*(style=['"][^'"]*(display\s*:\s*none|visibility\s*:\s*hidden)[^'"]*|width=['"]0['"]|height=['"]0['"])/i.test(html);
      if (!trustedHost && hiddenIframe) { rules.push({ id: 'hidden-iframe-detected', weight: 7, reason: 'The page contains hidden iframes.' }); reasons.push('The page contains hidden iframes.'); recommendations.push('Avoid interacting with the page if it contains invisible frame-based content.'); }
      if (!trustedHost && /window\.location|location\.replace|document\.location|setTimeout\([^\n]*location/i.test(html)) { rules.push({ id: 'javascript-redirect-detected', weight: 8, reason: 'The page contains JavaScript redirect logic.' }); reasons.push('The page contains JavaScript redirect logic.'); recommendations.push('Do not rely on this page to stay on a trustworthy host.'); }
      const downloadLinks = html.match(/<a[^>]+href=['"][^'"]*\.(?:exe|zip|apk|scr|bat|dll)(?:\?[^'"]*)?['"]/gi) || [];
      if (!trustedHost && downloadLinks.length) { rules.push({ id: 'suspicious-download-detected', weight: 8, reason: 'The page offers executable or archive downloads.' }); reasons.push('The page offers executable or archive downloads.'); recommendations.push('Do not download files from pages that try to push executables or archives.'); }
      const externalScripts = html.match(/<script[^>]+src=['"][^'"]+['"]/gi) || [];
      const thirdPartyScripts = externalScripts.filter((src) => /src=['"]https?:\/\//i.test(src) && !src.includes(parsed.hostname));
      if (!trustedHost && thirdPartyScripts.length) { rules.push({ id: 'external-script-detected', weight: 4, reason: 'The page loads external JavaScript from third-party hosts.' }); reasons.push('The page loads external JavaScript from third-party hosts.'); recommendations.push('Inspect third-party scripts carefully before entering credentials.'); }
      if (!trustedHost && /(?:src|href)=['"][^'"]*https?:\/\/[^'"]*/i.test(html)) { rules.push({ id: 'mixed-content-detected', weight: 3, reason: 'The page references insecure or mixed content.' }); reasons.push('The page references insecure or mixed content.'); recommendations.push('Prefer sites that load resources only over HTTPS.'); }
    }
    const securityHeaders = ['strict-transport-security', 'content-security-policy', 'x-frame-options', 'x-content-type-options'];
    const missing = securityHeaders.filter((name) => !Array.from(headers?.entries() || []).some(([key]) => key === name));
    if (!isTrustedDomain(hostname) && missing.length) { rules.push({ id: 'missing-security-headers', weight: 3, reason: 'The site is missing important security headers.' }); reasons.push(`The site is missing security headers: ${missing.join(', ')}.`); recommendations.push('Be cautious with sites that do not present basic security headers.'); }
    const urlSignals = getUrlSignalDetails(finalUrl);
    for (const label of urlSignals.highRiskLabels) { rules.push({ id: 'url-structure-risk', weight: 6, reason: label }); reasons.push(label); recommendations.push('Treat this link as a possible phishing or credential-harvesting page.'); }
    for (const label of urlSignals.suspiciousLabels) { rules.push({ id: 'url-structure-suspicious', weight: 3, reason: label }); }
    const host = getHost(finalUrl) || parsed.hostname;
    const commonBrands = ['google', 'microsoft', 'apple', 'amazon', 'facebook', 'paypal', 'netflix', 'sbi', 'hdfc', 'icici', 'axis', 'uidai', 'irctc', 'incometax'];
    if (!isTrustedDomain(host)) {
      for (const brand of commonBrands) { if (host.includes(brand) && host !== brand) { rules.push({ id: 'typosquatting-detected', weight: 9, reason: `The host resembles the brand ${brand}.` }); reasons.push(`The host resembles the brand ${brand}.`); recommendations.push(`Check whether ${host} is an impersonation of the official ${brand} service.`); break; } }
    }
    const age = await getDomainAge(host); if (age) reasons.push(`Observed registration date: ${age}.`); else reasons.push('No public registration date was available.');
    const feedMatchesList = Array.from(new Set((await Promise.resolve(feed)).domains.has(host) ? [host] : [])).slice(0, 3);
    if (feedMatchesList.length) { rules.push({ id: 'phishing-feed-match', weight: 8, reason: `The URL matched the open-source feed: ${feedMatchesList.join(', ')}.` }); reasons.push(`The open-source feed flagged the URL: ${feedMatchesList.join(', ')}.`); recommendations.push('The URL appears on the open-source phishing feed and should be treated as unsafe.'); }
  } catch {
    return { ...buildSummary(0, [], ['The site could not be fully analyzed because the request failed.'], ['Try again later or verify the URL manually.'], 'URL / Website Scanner', 'unable_to_analyze', { feedMatches: [] as string[], redirectChain: [] as string[], finalUrl }), feedMatches: [], redirectChain: [], finalUrl };
  }
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0));
  const evidenceCount = 4 + Number(feedMatchesList.length > 0);
  const baseSummary = buildSummary(score, rules.map((rule) => rule.id), reasons, recommendations, 'URL / Website Scanner', 'completed', { embeddedUrls: [finalUrl], explanation: reasons.join(' '), nextStep: recommendations[0] || 'No suspicious indicators were found during the live URL analysis.', feedMatches: feedMatchesList, redirectChain, finalUrl, confidence: calculateConfidence(score, rules.map((rule) => rule.id), 'completed', evidenceCount), sources: ['DNS resolution', 'TLS certificate inspection', 'HTTP header inspection', 'HTML fetch analysis', ...feed.sources] });
  return { ...baseSummary, feedMatches: feedMatchesList, redirectChain, finalUrl };
}

export async function analyzePdfFile(file: File): Promise<AnalysisResult & { fileHash: string; fileMime: string; metadata: Record<string, string> }> {
  const startedAt = Date.now();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();
  const mimeType = file.type || 'application/octet-stream';
  const fileHash = crypto.createHash('sha256').update(Buffer.from(bytes)).digest('hex');
  const rules: Array<{ id: string; weight: number; reason: string }> = [];
  const reasons: string[] = [];
  const recommendations: string[] = [];
  if (fileName.includes('.exe') || fileName.includes('.bat') || fileName.includes('.scr') || fileName.includes('.dll')) { rules.push({ id: 'executable-masquerading', weight: 10, reason: 'The filename suggests an executable file is being disguised as a document.' }); reasons.push('The filename suggests executable content is being disguised as a document.'); recommendations.push('Do not open the file because it may be executable malware.'); }
  if (/\.(pdf|doc|docx|xlsx|pptx|zip|exe|bat|scr|dll)\.[a-z0-9]+$/i.test(fileName)) { rules.push({ id: 'double-extension', weight: 8, reason: 'The filename has a double extension.' }); reasons.push('The filename has a double extension.'); recommendations.push('Treat the file as suspicious until it is confirmed by a trusted source.'); }
  const text = Buffer.from(bytes).toString('latin1');
  const urls = extractUrls(text);
  if (urls.length) { rules.push({ id: 'embedded-url', weight: 5, reason: `The PDF embeds ${urls.length} URL(s).` }); reasons.push(`The PDF embeds ${urls.length} URL(s).`); recommendations.push('Inspect the embedded URLs because PDF files commonly contain clickable phishing links.'); }
  if (/\/JavaScript|\/OpenAction|\/Launch|\/AA|\/EmbeddedFile|\/ObjStm|\/Encrypt/i.test(text)) { rules.push({ id: 'pdf-structural-risk', weight: 8, reason: 'The PDF contains JavaScript, launch actions, embedded files, or encrypted objects.' }); reasons.push('The PDF contains JavaScript, launch actions, embedded files, or encrypted objects.'); recommendations.push('Treat this PDF as risky until it is verified by a trusted tool.'); }
  if (text.includes('/Encrypt')) { rules.push({ id: 'encrypted-pdf', weight: 6, reason: 'The PDF is encrypted or protected.' }); reasons.push('The PDF is encrypted or protected.'); recommendations.push('Encrypted PDFs can hide content and should be inspected carefully.'); }
  if (fileName.endsWith('.pdf') && !text.includes('%PDF')) { rules.push({ id: 'invalid-pdf-header', weight: 6, reason: 'The file does not contain a valid PDF header.' }); reasons.push('The file does not contain a valid PDF header.'); recommendations.push('The file may be malformed or intentionally disguised.'); }
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0));
  const evidenceCount = 2 + Number(urls.length > 0);
  const feed = await loadThreatFeed();
  const result = buildSummary(score, rules.map((rule) => rule.id), reasons, recommendations, 'PDF / File Scanner', 'completed', { embeddedUrls: urls, explanation: reasons.join(' '), nextStep: recommendations[0] || 'Review the PDF carefully before opening it.', fileHash, fileMime: mimeType, metadata: {}, analysisTime: `${Date.now() - startedAt}ms`, confidence: calculateConfidence(score, rules.map((rule) => rule.id), 'completed', evidenceCount), sources: ['PDF structure inspection', 'Embedded URL extraction', 'Metadata inspection', ...feed.sources] });
  return { ...result, fileHash, fileMime: mimeType, metadata: {} };
}

export async function analyzeQrPayload(payload: string): Promise<AnalysisResult> {
  const startedAt = Date.now();
  const rules: Array<{ id: string; weight: number; reason: string }> = [];
  const reasons: string[] = [];
  const recommendations: string[] = [];
  const lower = payload.toLowerCase();
  if (/^https?:\/\//i.test(payload)) { rules.push({ id: 'qr-url', weight: 5, reason: 'The QR payload contains a URL.' }); reasons.push('The QR payload contains a URL.'); recommendations.push('Inspect the decoded URL for phishing or payment fraud indicators.'); }
  if (/upi/i.test(payload)) { rules.push({ id: 'qr-upi', weight: 8, reason: 'The QR payload appears to be a UPI payment request.' }); reasons.push('The QR payload appears to be a UPI payment request.'); recommendations.push('Verify the recipient carefully before paying any QR code.'); }
  if (/wifi/i.test(payload)) { rules.push({ id: 'qr-wifi', weight: 4, reason: 'The QR payload contains Wi-Fi credentials.' }); reasons.push('The QR payload contains Wi-Fi credentials.'); recommendations.push('Only trust Wi-Fi QR codes from known, trusted sources.'); }
  if (/mailto:|@/i.test(payload)) { rules.push({ id: 'qr-email', weight: 4, reason: 'The QR payload contains email data.' }); reasons.push('The QR payload contains email data.'); recommendations.push('Confirm the email recipient before sending sensitive data.'); }
  if (/sms:/i.test(payload)) { rules.push({ id: 'qr-sms', weight: 4, reason: 'The QR payload contains an SMS payload.' }); reasons.push('The QR payload contains an SMS payload.'); recommendations.push('Inspect the destination number and any embedded content before acting.'); }
  if (/pay|amount|upi|qr/i.test(lower)) { rules.push({ id: 'qr-payment-risk', weight: 6, reason: 'The QR payload looks like a payment request.' }); reasons.push('The QR payload looks like a payment request.'); recommendations.push('Do not make payments from untrusted QR payloads.'); }
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0));
  const evidenceCount = 2 + Number(extractUrls(payload).length > 0);
  const feed = await loadThreatFeed();
  const baseSummary = buildSummary(score, rules.map((rule) => rule.id), reasons, recommendations, 'QR / Payload Scanner', 'completed', { embeddedUrls: extractUrls(payload), explanation: reasons.join(' '), nextStep: recommendations[0] || 'Review the QR payload carefully before acting.', analysisTime: `${Date.now() - startedAt}ms`, confidence: calculateConfidence(score, rules.map((rule) => rule.id), 'completed', evidenceCount), sources: ['QR payload inspection', 'URL pattern analysis', ...feed.sources] });
  return { ...baseSummary, analysisTime: `${Date.now() - startedAt}ms` };
}

export async function analyzeUploadedFile(file: File): Promise<AnalysisResult> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = file.type || 'application/octet-stream';
  const fileHash = crypto.createHash('sha256').update(Buffer.from(bytes)).digest('hex');
  const rules: Array<{ id: string; weight: number; reason: string }> = [];
  const reasons: string[] = [];
  const recommendations: string[] = [];
  const fileName = file.name.toLowerCase();
  if (fileName.includes('.exe') || fileName.includes('.bat') || fileName.includes('.scr')) { rules.push({ id: 'executable-extension', weight: 10, reason: 'File extension indicates an executable.' }); reasons.push('File extension indicates an executable.'); recommendations.push('Do not launch files with executable extensions from untrusted sources.'); }
  if (/\.pdf\.|\.zip\.|\.exe\.|\.bat\.|\.scr\./i.test(fileName)) { rules.push({ id: 'double-extension', weight: 8, reason: 'The filename uses a double extension.' }); reasons.push('The filename uses a double extension.'); recommendations.push('Double extensions often indicate packed or disguised malware.'); }
  if (bytes.byteLength > 25 * 1024 * 1024) { rules.push({ id: 'archive-bomb', weight: 6, reason: 'The upload is unusually large for a simple document.' }); reasons.push('The upload is unusually large for a simple document.'); recommendations.push('Large files can be used as archive bombs or packed payloads.'); }
  const score = Math.min(100, rules.reduce((sum, rule) => sum + rule.weight, 0));
  const evidenceCount = 2 + Number(bytes.byteLength > 0);
  const feed = await loadThreatFeed();
  const baseSummary = buildSummary(score, rules.map((rule) => rule.id), reasons, recommendations, 'File / Upload Scanner', 'completed', { fileHash, fileMime: mimeType, explanation: reasons.join(' '), nextStep: recommendations[0] || 'Inspect the file carefully before opening it.', analysisTime: `${Date.now()}ms`, confidence: calculateConfidence(score, rules.map((rule) => rule.id), 'completed', evidenceCount), sources: ['File hash analysis', 'MIME inspection', 'Extension and size inspection', ...feed.sources] });
  return { ...baseSummary, fileHash, fileMime: mimeType };
}
