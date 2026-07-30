import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { what, amount, date, phone } = await req.json();

    const draft = `To,
The Cyber Crime Cell / Nodal Officer,

Subject: Complaint regarding cyber financial fraud/scam

Sir/Madam,
I am writing to report a cyber fraud incident that occurred with me. Below are the details of the incident:

Date of Incident: ${date || '[Insert Date]'}
Amount Lost: ${amount ? `₹${amount}` : '[Insert Amount]'}
Suspect Details (Phone/URL/Account): ${phone || '[Insert Suspect Details]'}

Incident Description:
${what || '[Describe exactly how the scam started, what the scammer told you, and how the money was transferred. Mention the platform/app used.]'}

I have attached screenshots of the transaction and any communication with the suspect. I request you to kindly investigate this matter and help block the fraudulent accounts to prevent further loss.

Yours faithfully,
[Your Name]
[Your Phone Number]
[Your Address]`;

    return NextResponse.json({ draft });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
